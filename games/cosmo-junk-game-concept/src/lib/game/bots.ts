// ====== ИИ-экипаж: занимает пустые кресла и подхватывает роль при обрыве связи ======
import { MANUAL } from "./manual";
import { botName } from "./names";
import type { GameSim } from "./sim";
import { WORLD } from "./sim";
import type { BreakerId, InputMsg, Role, ShieldSide } from "./types";

export type BotDifficulty = "green" | "norm" | "veteran";

export const DIFFICULTY_META: Record<BotDifficulty, { label: string; desc: string; color: string }> = {
  green: { label: "СТАЖЁР", desc: "Тупит и зевает. Долетают примерно в 4 случаях из 10", color: "#3bff8f" },
  norm: { label: "НОРМА", desc: "Средний космический работяга. Долетают ~8 раз из 10", color: "#ffb000" },
  veteran: { label: "ВЕТЕРАН", desc: "Железные профи. Почти не косячат", color: "#ff4bd8" },
};

interface Tuning {
  react: number;   // задержка реакции, сек
  accuracy: number; // вероятность верного действия
  chatter: number;  // болтливость
}

// Подобрано прогонами: победа полностью ботского экипажа ≈ 43% / 79% / 100%
export const TUNING: Record<BotDifficulty, Tuning> = {
  green: { react: 1.8, accuracy: 0.37, chatter: 0.6 },
  norm: { react: 1.55, accuracy: 0.44, chatter: 0.4 },
  veteran: { react: 0.5, accuracy: 0.85, chatter: 0.25 },
};

type Threat = { y: number; side: ShieldSide; eta: number };

function send(sim: GameSim, role: Role, msg: InputMsg) {
  sim.applyInput({ ...msg, playerId: `bot:${role}`, role, seq: 0 });
}

/** ближайшая угроза по времени до столкновения */
function findThreat(sim: GameSim): Threat | null {
  let best: Threat | null = null;
  for (const e of sim.ents) {
    const dx = e.x - WORLD.shipX;
    const dy = e.y - sim.shipY;
    let eta = Infinity;
    if (e.vx < -20 && dx > -40) eta = dx / -e.vx;
    else if (e.vx > 20 && dx < 40) eta = Math.abs(dx / e.vx);
    else if (Math.abs(e.vy) > 60 && Math.abs(dx) < 150) eta = Math.abs(dy / e.vy);
    if (!Number.isFinite(eta) || eta > 3.2) continue;
    const side: ShieldSide =
      Math.abs(e.vx) > Math.abs(e.vy) ? (e.vx < 0 ? 0 : 2) : e.vy > 0 ? 1 : 3;
    if (!best || eta < best.eta) best = { y: e.y, side, eta };
  }
  return best;
}

abstract class Brain {
  protected t = 0;
  protected nextThink = 0;
  protected chatCd = 6;
  readonly name: string;
  constructor(readonly role: Role, readonly diff: BotDifficulty) {
    this.name = botName(role);
  }
  protected get tune() {
    return TUNING[this.diff];
  }
  protected say(sim: GameSim, line: string, cd = 9) {
    if (this.chatCd > 0) return;
    this.chatCd = cd;
    sim.log(`${this.name}: ${line}`);
  }
  protected hasErr(sim: GameSim, id: string) {
    return sim.errors.some((e) => e.defId === id);
  }
  update(sim: GameSim, dt: number) {
    this.t += dt;
    this.chatCd -= dt;
    this.tick(sim, dt);
    if (this.t >= this.nextThink) {
      this.nextThink = this.t + this.tune.react * (0.7 + Math.random() * 0.6);
      this.think(sim);
    }
  }
  /** каждый кадр (удержание кнопок) */
  protected tick(_sim: GameSim, _dt: number) {}
  /** раз в «время реакции» */
  protected abstract think(sim: GameSim): void;
  /** отпустить всё при передаче кресла живому игроку */
  release(_sim: GameSim) {}
}

// ---------------- ПИЛОТ ----------------

class PilotBrain extends Brain {
  private want = { up: false, down: false, thrust: false };
  private refresh = 0;
  private fuelHold = 0;

  protected tick(sim: GameSim, dt: number) {
    this.refresh -= dt;
    this.fuelHold -= dt;
    if (this.refresh <= 0) {
      this.refresh = 0.22;
      send(sim, "pilot", { kind: "held", key: "up", v: this.want.up });
      send(sim, "pilot", { kind: "held", key: "down", v: this.want.down });
      send(sim, "pilot", { kind: "held", key: "thrust", v: this.want.thrust });
    }
  }

  protected think(sim: GameSim) {
    // E-9000: бунт автопилота — зажать обе
    if (this.hasErr(sim, "autopilot")) {
      this.want = { up: true, down: true, thrust: false };
      this.say(sim, "ДЕРЖУ ОБЕ КНОПКИ! АВТОПИЛОТ, УСПОКОЙСЯ!");
      return;
    }
    // E-1313: гироскоп — гиперпрыжок
    if (this.hasErr(sim, "gyro") && sim.cds.hyper <= 0 && sim.breakers.A1) {
      send(sim, "pilot", { kind: "hyper" });
      this.say(sim, "ПРЫГАЮ! ГИРОСКОП САМ СЕБЯ НЕ ПОЧИНИТ!");
    }
    // E-314: утечка топлива — не газовать
    if (this.hasErr(sim, "fuel")) this.fuelHold = 5.5;

    const threat = findThreat(sim);
    const blind = Math.random() > this.tune.accuracy; // бот иногда «зевает»
    let up = false;
    let down = false;

    if (threat && !blind && threat.eta < 2.2) {
      const dy = threat.y - sim.shipY;
      if (Math.abs(dy) < 95) {
        if (dy > 0) up = true;
        else down = true;
      }
    }
    // держаться центра, если тихо
    if (!up && !down) {
      if (sim.shipY > WORLD.h * 0.66) up = true;
      else if (sim.shipY < WORLD.h * 0.34) down = true;
    }
    // гравиколодец тянет вниз
    if (sim.gravityT > 0) {
      up = true;
      down = false;
      this.say(sim, "НАС ТЯНЕТ ВНИЗ, ДАЮ ТЯГУ ВВЕРХ!", 12);
    }

    const calm = !threat || threat.eta > 1.4;
    const thrust =
      this.fuelHold <= 0 && calm && sim.heat < (this.diff === "veteran" ? 74 : 64) && sim.breakers.A1;

    this.want = { up, down, thrust };

    if (!sim.breakers.A1) this.say(sim, "ДВИГАТЕЛЬ СДОХ! ИНЖЕНЕР, A1!", 10);
    else if (threat && threat.eta < 1 && Math.random() < this.tune.chatter)
      this.say(sim, "ДЕРЖИТЕСЬ, ЗАКЛАДЫВАЮ ВИРАЖ!", 7);
  }

  release(sim: GameSim) {
    this.want = { up: false, down: false, thrust: false };
    send(sim, "pilot", { kind: "held", key: "up", v: false });
    send(sim, "pilot", { kind: "held", key: "down", v: false });
    send(sim, "pilot", { kind: "held", key: "thrust", v: false });
  }
}

// ---------------- ИНЖЕНЕР ----------------

class EngineerBrain extends Brain {
  private leakPhase: "idle" | "off" = "idle";
  private leakT = 0;

  protected tick(_sim: GameSim, dt: number) {
    this.leakT -= dt;
  }

  protected think(sim: GameSim) {
    // выбило предохранитель — вернуть
    if (sim.tripped && Math.random() < this.tune.accuracy) {
      const id = sim.tripped;
      send(sim, "engineer", { kind: "breaker", id, v: true });
      this.say(sim, `ВЕРНУЛ ${id}, РАБОТАЕМ!`, 6);
      return;
    }
    // пожары
    if (sim.fires > 0 && sim.cds.extinguish <= 0) {
      send(sim, "engineer", { kind: "extinguish" });
      this.say(sim, "ТУШУ! НЕ ДЫШИТЕ ГЛУБОКО!", 7);
      return;
    }
    // E-8008: схема предохранителей
    if (this.hasErr(sim, "power") && sim.patternTarget) {
      const ids: BreakerId[] = ["A1", "A2", "B1", "B2"];
      const pat = sim.patternTarget;
      const wrong = ids.filter((id, i) => sim.breakers[id] !== pat[i]);
      if (wrong.length && Math.random() < this.tune.accuracy) {
        const id = wrong[0];
        send(sim, "engineer", { kind: "breaker", id, v: pat[ids.indexOf(id)] });
        this.say(sim, "СОБИРАЮ СХЕМУ ПО ЭКРАНУ!", 8);
        return;
      }
    }
    // E-404: утечка кислорода — B2 вниз на 3 сек
    if (this.hasErr(sim, "leak")) {
      if (this.leakPhase === "idle" && sim.breakers.B2) {
        send(sim, "engineer", { kind: "breaker", id: "B2", v: false });
        this.leakPhase = "off";
        this.leakT = 3.2;
        this.say(sim, "ГЛУШУ B2 НА ТРИ СЕКУНДЫ!", 8);
        return;
      }
      if (this.leakPhase === "off" && this.leakT <= 0) {
        send(sim, "engineer", { kind: "breaker", id: "B2", v: true });
        this.leakPhase = "idle";
        return;
      }
    } else if (this.leakPhase === "off" && this.leakT <= 0) {
      send(sim, "engineer", { kind: "breaker", id: "B2", v: true });
      this.leakPhase = "idle";
    }
    // охлаждение (в т.ч. E-666)
    const needCool = this.hasErr(sim, "reactor") ? sim.heat > 42 : sim.heat > 72;
    const stopCool = this.hasErr(sim, "reactor") ? sim.heat < 34 : sim.heat < 42;
    if (needCool && !sim.coolantOn && Math.random() < this.tune.accuracy) {
      send(sim, "engineer", { kind: "coolant", v: true });
      this.say(sim, "ОХЛАЖДЕНИЕ ВКЛ! ЩИТ ЗАМРЁТ, ТЕРПИТЕ!", 9);
    } else if (stopCool && sim.coolantOn) {
      send(sim, "engineer", { kind: "coolant", v: false });
      this.say(sim, "ОТПУСКАЮ ОХЛАЖДЕНИЕ, ЩИТ ВАШ!", 9);
    }
    // все тумблеры должны быть включены, если нет схемы
    if (!this.hasErr(sim, "power") && !this.hasErr(sim, "leak")) {
      const off = (Object.keys(sim.breakers) as BreakerId[]).filter((id) => !sim.breakers[id]);
      if (off.length && Math.random() < this.tune.accuracy) {
        send(sim, "engineer", { kind: "breaker", id: off[0], v: true });
      }
    }
  }
}

// ---------------- КАНОНИР ----------------

class GunnerBrain extends Brain {
  protected think(sim: GameSim) {
    // E-2077: вирус — перезагрузка
    if (this.hasErr(sim, "virus") && sim.rebootT < 0) {
      send(sim, "gunner", { kind: "reboot" });
      this.say(sim, "ПЕРЕЗАГРУЖАЮ СЕТЬ, НЕ ТРОГАЙТЕ НИЧЕГО!", 9);
      return;
    }
    const threat = findThreat(sim);
    if (threat && Math.random() < this.tune.accuracy) {
      if (sim.shieldSide !== threat.side && !sim.coolantOn && sim.breakers.A2) {
        send(sim, "gunner", { kind: "shield", side: threat.side });
        if (Math.random() < this.tune.chatter) {
          const names = ["НОС", "ВЕРХ", "КОРМУ", "НИЗ"];
          this.say(sim, `ЩИТ НА ${names[threat.side]}!`, 8);
        }
      }
    }
    if (sim.coolantOn && sim.hull < 70) this.say(sim, "ЩИТ ЗАМОРОЖЕН ОХЛАЖДЕНИЕМ!", 14);
    if (!sim.breakers.A2) this.say(sim, "ЩИТЫ ОБЕСТОЧЕНЫ! A2!", 10);
    if (!sim.breakers.B1) this.say(sim, "ПУШКА БЕЗ ПИТАНИЯ! B1!", 10);
  }

  protected tick(sim: GameSim, _dt: number) {
    // стрельба чаще, чем «размышления»
    if (sim.cds.fire > 0 || !sim.breakers.B1 || sim.rebootT >= 0) return;
    const rate = this.diff === "veteran" ? 0.25 : this.diff === "norm" ? 0.13 : 0.06;
    if (Math.random() < rate * 0.35) send(sim, "gunner", { kind: "fire" });
  }
}

// ---------------- НАВИГАТОР ----------------

class NavigatorBrain extends Brain {
  private announced = new Set<string>();
  private queue: string[] = [];
  private speakT = 0;

  protected tick(sim: GameSim, dt: number) {
    this.speakT -= dt;
    // вычищаем устранённые аварии, чтобы при повторе снова читал
    for (const id of [...this.announced]) {
      if (!sim.errors.some((e) => e.defId === id)) this.announced.delete(id);
    }
    if (this.queue.length && this.speakT <= 0) {
      this.speakT = 2.4;
      sim.log(`${this.name}: ${this.queue.shift()}`);
    }
  }

  protected think(sim: GameSim) {
    for (const err of sim.errors) {
      if (this.announced.has(err.defId)) continue;
      this.announced.add(err.defId);
      const entry = MANUAL.find((m) => m.id === err.defId);
      if (!entry) continue;
      this.queue.push(`${entry.code}! ${entry.title}. ЧИТАЮ МАНУАЛ…`);
      const steps = this.tune.accuracy > 0.7 ? entry.fix : entry.fix.slice(0, 1);
      for (const f of steps) {
        const who =
          f.role === "any" ? "ВСЕ" : f.role === "pilot" ? "ПИЛОТ" : f.role === "engineer" ? "ИНЖЕНЕР" : "КАНОНИР";
        this.queue.push(`${who}: ${f.text}`);
      }
      if (Math.random() > this.tune.accuracy) {
        this.queue.push("…ИЛИ НЕТ. СТРАНИЦА ЗАЛИТА КОФЕ, ИЗВИНИТЕ.");
      }
    }
    if (sim.errors.length === 0 && Math.random() < this.tune.chatter * 0.25) {
      this.say(sim, "ПОКА ТИХО. ПОДОЗРИТЕЛЬНО ТИХО.", 22);
    }
  }
}

// ---------------- КОМАНДА БОТОВ ----------------

function makeBrain(role: Role, diff: BotDifficulty): Brain | null {
  switch (role) {
    case "pilot": return new PilotBrain(role, diff);
    case "engineer": return new EngineerBrain(role, diff);
    case "gunner": return new GunnerBrain(role, diff);
    case "navigator": return new NavigatorBrain(role, diff);
    default: return null;
  }
}

export class BotCrew {
  private brains = new Map<Role, Brain>();
  private difficulty: BotDifficulty = "norm";

  setDifficulty(d: BotDifficulty) {
    if (d === this.difficulty) return;
    this.difficulty = d;
    const roles = [...this.brains.keys()];
    this.brains.clear();
    for (const r of roles) {
      const b = makeBrain(r, d);
      if (b) this.brains.set(r, b);
    }
  }

  /** Синхронизировать состав: какие роли сейчас за ботами */
  sync(sim: GameSim | null, roles: Role[]): { added: Role[]; removed: Role[] } {
    const want = new Set(roles);
    const added: Role[] = [];
    const removed: Role[] = [];
    for (const [role, brain] of [...this.brains]) {
      if (!want.has(role)) {
        if (sim) brain.release(sim);
        this.brains.delete(role);
        removed.push(role);
      }
    }
    for (const role of want) {
      if (!this.brains.has(role)) {
        const b = makeBrain(role, this.difficulty);
        if (b) {
          this.brains.set(role, b);
          added.push(role);
        }
      }
    }
    return { added, removed };
  }

  nameOf(role: Role): string | null {
    return this.brains.get(role)?.name ?? null;
  }

  get roles(): Role[] {
    return [...this.brains.keys()];
  }

  get size() {
    return this.brains.size;
  }

  update(sim: GameSim, dt: number) {
    if (sim.result) return;
    for (const brain of this.brains.values()) brain.update(sim, dt);
  }
}
