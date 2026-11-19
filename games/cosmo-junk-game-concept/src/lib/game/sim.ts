// ====== Authoritative game simulation. Runs on the main-screen browser. ======
import { MANUAL } from "./manual";
import type {
  BreakerId, GameResult, Phase, QueuedInput, ShieldSide, Snapshot,
} from "./types";

export const WORLD = { w: 960, h: 540, shipX: 170, goal: 3400 };
export const REBOOT_DUR = 3;

export type EntKind = "rock" | "comet" | "flareT" | "flareB" | "pirate" | "bolt";

export interface Ent {
  id: number;
  kind: EntKind;
  x: number; y: number; vx: number; vy: number;
  r: number; hp: number; rot: number; vr: number; seed: number;
  shootT: number; life: number;
}

export type Fx =
  | { kind: "explo"; x: number; y: number; big?: boolean }
  | { kind: "spark"; x: number; y: number }
  | { kind: "shake"; amt: number }
  | { kind: "beam"; x1: number; y1: number; x2: number; y2: number }
  | { kind: "muzzle" }
  | { kind: "jump" }
  | { kind: "alarm" }
  | { kind: "resolve" }
  | { kind: "fail" }
  | { kind: "trip" }
  | { kind: "hit" }
  | { kind: "extinguish" }
  | { kind: "rebootOk" }
  | { kind: "cheer"; name: string }
  | { kind: "denied" };

interface ActiveError {
  inst: number;
  defId: string;
  code: string;
  title: string;
  dur: number;
  tLeft: number;
  data: Record<string, number>;
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const rand = (a: number, b: number) => a + Math.random() * (b - a);
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

function rankFor(won: boolean, hull: number): { code: GameResult["rankCode"]; title: string } {
  if (!won) return { code: "X", title: "КУЧКА ПЕПЛА" };
  if (hull >= 75) return { code: "S", title: "ЛЕГЕНДЫ КОСМОСА" };
  if (hull >= 55) return { code: "A", title: "ЗВЁЗДНЫЕ ВОЛКИ" };
  if (hull >= 35) return { code: "B", title: "БЫВАЛЫЕ КОСМОДАЛЬЩИКИ" };
  if (hull >= 15) return { code: "C", title: "ЕЛЕ ДОТЯНУЛИ" };
  return { code: "D", title: "ГРУДА ХЛАМА (НО ЦЕЛАЯ)" };
}

export class GameSim {
  t = 0;
  dist = 0;
  speed = 11;
  shipY = WORLD.h / 2;
  vy = 0;
  hull = 100;
  heat = 22;
  fires = 0;
  breakers: Record<BreakerId, boolean> = { A1: true, A2: true, B1: true, B2: true };
  shieldSide: ShieldSide = 0;
  coolantOn = false;
  held = {
    up: { v: false, at: -9 },
    down: { v: false, at: -9 },
    thrust: { v: false, at: -9 },
  };
  cds = { fire: 0, extinguish: 0, hyper: 0 };
  rebootT = -1;
  invuln = 0;
  ents: Ent[] = [];
  errors: ActiveError[] = [];
  patternTarget: boolean[] | null = null;
  stormT = 0;
  gravityT = 0;
  fx: Fx[] = [];
  logLines: string[] = [];
  shakeSeq = 0;
  lastShake = 0;
  errSeq = 0;
  resolved = 0;
  failedN = 0;
  kills = 0;
  result: GameResult | null = null;
  tripped: BreakerId | null = null;
  tripFlashT = 0;

  private nextId = 1;
  private nextInst = 1;
  private spawnT = 2.6;
  private errT = 16;
  private tripT = 24;
  private hazardT = 30;
  private scheduled = new Set<string>();
  private flags = { hyperUsed: false, rebootDone: false };

  get progress() {
    return clamp(this.dist / WORLD.goal, 0, 1);
  }
  get shieldUp() {
    return this.breakers.A2;
  }

  log(msg: string) {
    const mm = Math.floor(this.t / 60).toString().padStart(2, "0");
    const ss = Math.floor(this.t % 60).toString().padStart(2, "0");
    this.logLines.push(`[${mm}:${ss}] ${msg}`);
    if (this.logLines.length > 40) this.logLines.shift();
  }

  damage(amount: number, fireChance = 0) {
    if (this.result) return;
    this.hull = clamp(this.hull - amount, 0, 100);
    this.shakeSeq++;
    this.lastShake = amount;
    this.fx.push({ kind: "shake", amt: clamp(amount / 14, 0.4, 1.6) }, { kind: "hit" });
    if (Math.random() < fireChance && this.fires < 3) {
      this.fires++;
      this.fx.push({ kind: "alarm" });
      this.log("ПОЖАР В ОТСЕКЕ! Горим.");
    }
    if (this.hull <= 0) this.finish(false);
  }

  private finish(won: boolean) {
    if (this.result) return;
    const r = rankFor(won, Math.round(this.hull));
    const score = Math.max(
      0,
      Math.round(this.progress * 1200) + this.resolved * 60 + this.kills * 5 +
        (won ? 300 + Math.round(this.hull) * 8 : 0) - this.failedN * 40
    );
    this.result = {
      won,
      score,
      rankCode: r.code,
      rankTitle: r.title,
      hull: Math.round(this.hull),
      progress: Math.round(this.progress * 100),
      resolved: this.resolved,
      failed: this.failedN,
      kills: this.kills,
      timeSec: Math.round(this.t),
    };
    this.log(won ? "СТЫКОВКА! Мы долетели." : "КОРАБЛЬ ПОТЕРЯН. Спаскапсулы не завелись.");
  }

  applyInput(msg: QueuedInput) {
    if (this.result) return;
    const { role } = msg;
    switch (msg.kind) {
      case "held":
        if (role !== "pilot") return;
        this.held[msg.key] = { v: msg.v, at: this.t };
        break;
      case "hyper":
        if (role !== "pilot" || this.cds.hyper > 0 || !this.breakers.A1) return;
        this.cds.hyper = 18;
        this.invuln = 1.2;
        this.dist += 160;
        this.flags.hyperUsed = true;
        this.fx.push({ kind: "jump" }, { kind: "shake", amt: 1 });
        this.log("ГИПЕРПРЫЖОК! Всех слегка швырнуло в стирку.");
        break;
      case "shield":
        if (role !== "gunner") return;
        if (this.coolantOn) {
          this.fx.push({ kind: "denied" });
          return;
        }
        this.shieldSide = msg.side;
        break;
      case "fire": {
        if (role !== "gunner" || !this.breakers.B1 || this.rebootT >= 0) return;
        if (this.cds.fire > 0) return;
        const target = this.pickTarget();
        if (!target) {
          this.cds.fire = 0.35;
          this.fx.push({ kind: "muzzle" });
          return;
        }
        this.cds.fire = this.coolantOn ? 1.3 : 0.65;
        this.fx.push({
          kind: "beam",
          x1: WORLD.shipX + 34,
          y1: this.shipY - 30,
          x2: target.x,
          y2: target.y,
        });
        target.hp -= 1;
        if (target.hp <= 0) {
          this.destroyEnt(target, true);
        } else {
          this.fx.push({ kind: "spark", x: target.x, y: target.y });
        }
        break;
      }
      case "extinguish":
        if (role !== "engineer" || this.cds.extinguish > 0) return;
        if (this.fires > 0) {
          this.fires--;
          this.cds.extinguish = 5;
          this.fx.push({ kind: "extinguish" });
          this.log(`Огнетушитель сработал. Осталось очагов: ${this.fires}`);
        } else {
          this.cds.extinguish = 1;
        }
        break;
      case "coolant":
        if (role !== "engineer") return;
        this.coolantOn = msg.v;
        this.log(msg.v ? "Аварийное охлаждение ВКЛ. Щиты заморожены." : "Охлаждение выкл. Щиты снова слушаются.");
        break;
      case "breaker":
        if (role !== "engineer") return;
        this.breakers[msg.id] = msg.v;
        if (msg.v && this.tripped === msg.id) this.tripped = null;
        this.log(`Тумблер ${msg.id} → ${msg.v ? "ВКЛ" : "ВЫКЛ"}`);
        break;
      case "reboot":
        if (role !== "gunner" || this.rebootT >= 0) return;
        this.rebootT = 0;
        this.log("Перезагрузка бортовой сети… не трогать!");
        break;
      case "cheer":
        this.fx.push({ kind: "cheer", name: "" });
        break;
    }
  }

  private pickTarget(): Ent | null {
    let best: Ent | null = null;
    let bestD = Infinity;
    for (const e of this.ents) {
      if (e.kind === "bolt") continue;
      const d = Math.hypot(e.x - WORLD.shipX, e.y - this.shipY);
      const inFront = e.x > WORLD.shipX - 30 && d < 620;
      const isPirate = e.kind === "pirate" && d < 700;
      if ((inFront || isPirate) && d < bestD) {
        best = e;
        bestD = d;
      }
    }
    return best;
  }

  private destroyEnt(e: Ent, byGun: boolean) {
    this.ents = this.ents.filter((x) => x !== e);
    this.fx.push({ kind: "explo", x: e.x, y: e.y, big: e.r > 20 || e.kind === "pirate" });
    if (byGun) this.kills++;
  }

  private spawnError() {
    const activeIds = new Set(this.errors.map((e) => e.defId));
    const pool = MANUAL.filter((m) => !activeIds.has(m.id));
    if (!pool.length) return;
    const err = { ...pool[Math.floor(Math.random() * pool.length)] };
    const dur = Math.round(rand(17, 21) - err.danger * 2);
    this.errors.push({
      inst: this.nextInst++,
      defId: err.id,
      code: err.code,
      title: err.title,
      dur,
      tLeft: dur,
      data: {},
    });
    if (err.id === "power") {
      this.patternTarget = [0, 1, 2, 3].map(() => Math.random() < 0.5);
    }
    this.errSeq++;
    this.fx.push({ kind: "alarm" });
    this.log(`АВАРИЯ ${err.code}: ${err.title}. Навигатор, ищи в мануале!`);
  }

  private failError(e: ActiveError) {
    this.failedN++;
    this.fx.push({ kind: "fail" }, { kind: "shake", amt: 1.2 });
    this.log(`${e.code} НЕ УСТРАНЕНА. Это больно.`);
    if (e.defId === "power") this.patternTarget = null;
    this.damage(8, 0.5);
  }

  private resolveError(e: ActiveError) {
    this.resolved++;
    this.fx.push({ kind: "resolve" });
    this.log(`${e.code} устранена. Команда — красавчики.`);
    if (e.defId === "power") this.patternTarget = null;
  }

  private spawnAsteroid() {
    const p = this.progress;
    const roll = Math.random();
    const spd = rand(150, 235) * lerp(1, 1.35, p);
    if (roll < 0.6) {
      const r = rand(13, 32);
      this.ents.push({
        id: this.nextId++, kind: "rock",
        x: WORLD.w + 60, y: rand(40, WORLD.h - 40),
        vx: -spd, vy: rand(-26, 26),
        r, hp: r < 20 ? 1 : 2,
        rot: rand(0, Math.PI * 2), vr: rand(-1.4, 1.4), seed: Math.random() * 1000,
        shootT: 0, life: 99,
      });
    } else if (roll < 0.78) {
      this.ents.push({
        id: this.nextId++, kind: "comet",
        x: WORLD.w + 60, y: rand(30, WORLD.h - 30),
        vx: -spd * 1.55, vy: rand(-40, 40),
        r: 8, hp: 1, rot: 0, vr: 0, seed: Math.random() * 1000, shootT: 0, life: 99,
      });
    } else {
      const top = Math.random() < 0.5;
      this.ents.push({
        id: this.nextId++, kind: top ? "flareT" : "flareB",
        x: rand(320, WORLD.w - 60), y: top ? -30 : WORLD.h + 30,
        vx: -30, vy: top ? rand(160, 210) : -rand(160, 210),
        r: 10, hp: 1, rot: 0, vr: 0, seed: Math.random() * 1000, shootT: 0, life: 99,
      });
    }
  }

  private spawnPirate() {
    this.ents.push({
      id: this.nextId++, kind: "pirate",
      x: -50, y: rand(80, WORLD.h - 80),
      vx: 58, vy: 0, r: 16, hp: 2,
      rot: 0, vr: 0, seed: Math.random() * 1000,
      shootT: rand(1.6, 2.6), life: 15,
    });
  }

  private scheduleHazards() {
    const p = this.progress;
    const mark = (k: string) => this.scheduled.add(k);
    if (p > 0.24 && !this.scheduled.has("pirates1")) {
      mark("pirates1");
      this.spawnPirate();
      this.spawnPirate();
      this.log("КОСМО-ПИРАТЫ на корме! Они машут батонами.");
      this.fx.push({ kind: "alarm" });
    }
    if (p > 0.47 && !this.scheduled.has("storm1")) {
      mark("storm1");
      this.stormT = 12;
      this.log("СОЛНЕЧНАЯ БУРЯ! Держитесь за что-нибудь крепкое.");
      this.fx.push({ kind: "alarm" });
    }
    if (p > 0.7 && !this.scheduled.has("gravity1")) {
      mark("gravity1");
      this.gravityT = 7;
      this.log("ГРАВИТАЦИОННЫЙ КОЛОДЕЦ! Тянет вниз, как теща в гости.");
      this.fx.push({ kind: "alarm" });
    }
    this.hazardT -= 1 / 60;
    if (this.hazardT <= 0 && p > 0.15) {
      this.hazardT = rand(24, 36);
      const roll = Math.random();
      if (roll < 0.4 && this.stormT <= 0) {
        this.stormT = rand(7, 11);
        this.log("Вспышка солнечной бури!");
        this.fx.push({ kind: "alarm" });
      } else if (roll < 0.7 && this.gravityT <= 0) {
        this.gravityT = rand(5, 7);
        this.log("Гравитационная аномалия прямо по курсу!");
        this.fx.push({ kind: "alarm" });
      } else if (!this.ents.some((e) => e.kind === "pirate" && e.life > 0)) {
        this.spawnPirate();
        this.log("Пират на хвосте! Вежливо стреляет.");
        this.fx.push({ kind: "alarm" });
      }
    }
  }

  update(dt: number) {
    if (this.result) return;
    this.t += dt;
    const p = this.progress;
    const storm = this.stormT > 0;
    if (this.stormT > 0) this.stormT -= dt;
    if (this.gravityT > 0) this.gravityT -= dt;
    if (this.cds.fire > 0) this.cds.fire -= dt;
    if (this.cds.extinguish > 0) this.cds.extinguish -= dt;
    if (this.cds.hyper > 0) this.cds.hyper -= dt;
    if (this.invuln > 0) this.invuln -= dt;
    if (this.tripFlashT > 0) this.tripFlashT -= dt;

    // held-key expiry (если телефон отвалился — кнопка "отпускается")
    const heldKeys = ["up", "down", "thrust"] as const;
    for (const k of heldKeys) {
      if (this.held[k].v && this.t - this.held[k].at > 0.8) this.held[k].v = false;
    }

    // --- ship physics ---
    const engine = this.breakers.A1;
    if (engine) {
      if (this.held.up.v && !this.held.down.v) this.vy -= 640 * dt;
      if (this.held.down.v && !this.held.up.v) this.vy += 640 * dt;
    }
    if (this.gravityT > 0) this.vy += 240 * dt;
    this.vy *= Math.exp(-2.6 * dt);
    this.vy = clamp(this.vy, -330, 330);
    this.shipY = clamp(this.shipY + this.vy * dt, 48, WORLD.h - 48);

    // --- heat & speed ---
    const thrusting = engine && this.held.thrust.v;
    if (thrusting) this.heat += 24 * dt * (storm ? 1.35 : 1);
    else this.heat -= 8 * dt;
    if (this.coolantOn) this.heat -= 34 * dt;
    this.heat += this.fires * 6 * dt;
    this.heat = clamp(this.heat, 0, 112);
    if (this.heat >= 100) {
      this.heat = 86;
      this.fires = Math.min(3, this.fires + 1);
      this.fx.push({ kind: "alarm" });
      this.log("ДВИГАТЕЛЬ ПЕРЕГРЕЛСЯ! Пожар и вонища.");
      this.damage(5);
    }
    this.speed = engine ? (thrusting ? 26 : 11) : 4;
    this.dist += this.speed * dt;
    if (this.dist >= WORLD.goal) {
      this.finish(true);
      return;
    }

    // --- fires burn hull ---
    if (this.fires > 0) {
      this.hull = clamp(this.hull - this.fires * 1.7 * dt, 0, 100);
      if (this.hull <= 0) {
        this.finish(false);
        return;
      }
    }

    // --- director ---
    this.spawnT -= dt * (storm ? 1.9 : 1);
    if (this.spawnT <= 0) {
      this.spawnAsteroid();
      this.spawnT = lerp(1.8, 0.9, p) * rand(0.7, 1.3);
    }
    this.scheduleHazards();
    this.errT -= dt;
    if (this.errT <= 0) {
      if (this.errors.length < 2) this.spawnError();
      this.errT = rand(17, 25) * (1 - p * 0.25) + 4;
    }
    this.tripT -= dt;
    if (this.tripT <= 0) {
      this.tripT = rand(26, 40);
      const onIds = (Object.keys(this.breakers) as BreakerId[]).filter((id) => this.breakers[id]);
      if (onIds.length) {
        const id = onIds[Math.floor(Math.random() * onIds.length)];
        this.breakers[id] = false;
        this.tripped = id;
        this.tripFlashT = 6;
        this.fx.push({ kind: "trip" }, { kind: "alarm" });
        this.log(`ВЫБИЛО ПРЕДОХРАНИТЕЛЬ ${id}! Инженер, ну!`);
      }
    }

    // --- reboot channel ---
    if (this.rebootT >= 0) {
      this.rebootT += dt;
      if (this.rebootT >= REBOOT_DUR) {
        this.rebootT = -1;
        this.flags.rebootDone = true;
        this.fx.push({ kind: "rebootOk" });
        this.log("Сеть перезагружена. Компьютер делает вид, что всё само починилось.");
      }
    }

    // --- entities ---
    for (const e of this.ents) {
      e.x += e.vx * dt;
      e.y += e.vy * dt;
      e.rot += e.vr * dt;
      if (e.kind === "pirate") {
        e.life -= dt;
        if (e.life <= 0) {
          e.vx = -200;
        } else {
          if (e.x > 110) e.vx = 0;
          e.vy = clamp((this.shipY - e.y) * 0.9, -70, 70);
          e.shootT -= dt;
          if (e.shootT <= 0 && e.x > 20) {
            e.shootT = rand(2.2, 3.1);
            this.ents.push({
              id: this.nextId++, kind: "bolt",
              x: e.x + 16, y: e.y,
              vx: 245, vy: clamp((this.shipY - e.y) * 0.8, -130, 130),
              r: 5, hp: 1, rot: 0, vr: 0, seed: 0, shootT: 0, life: 99,
            });
          }
        }
      }
    }
    this.ents = this.ents.filter(
      (e) => e.x > -90 && e.x < WORLD.w + 140 && e.y > -90 && e.y < WORLD.h + 90
    );

    // --- collisions ---
    if (this.invuln <= 0) {
      const sx = WORLD.shipX, sy = this.shipY;
      for (const e of [...this.ents]) {
        const dx = Math.max(Math.abs(e.x - sx) - 82, 0);
        const dy = Math.max(Math.abs(e.y - sy) - 26, 0);
        if (dx * dx + dy * dy > e.r * e.r) continue;
        const approachSide: ShieldSide =
          Math.abs(e.vx) > Math.abs(e.vy) ? (e.vx < 0 ? 0 : 2) : e.vy > 0 ? 1 : 3;
        if (this.shieldUp && this.shieldSide === approachSide) {
          this.fx.push({ kind: "spark", x: e.x, y: e.y }, { kind: "shake", amt: 0.35 });
          this.destroyEnt(e, false);
        } else {
          const dmg = e.kind === "rock" ? (e.r > 20 ? 12 : 7) : e.kind === "bolt" ? 6 : e.kind === "pirate" ? 10 : 9;
          this.fx.push({ kind: "explo", x: e.x, y: e.y });
          this.destroyEnt(e, false);
          this.log(e.kind === "bolt" ? "Пиратский болт в борт! Больно!" : "Удар по корпусу! Кто-то не смотрел на экран.");
          this.damage(dmg, e.kind === "rock" ? 0.4 : 0.25);
        }
      }
    }

    // --- errors resolution / failure ---
    for (const e of [...this.errors]) {
      e.tLeft -= dt * (this.breakers.B2 ? 1 : 1.5);
      if (this.checkResolved(e, dt)) {
        this.resolveError(e);
        this.errors = this.errors.filter((x) => x !== e);
        continue;
      }
      if (e.tLeft <= 0) {
        this.failError(e);
        this.errors = this.errors.filter((x) => x !== e);
      }
    }

    this.tripFlashT = Math.max(0, this.tripFlashT);
  }

  private checkResolved(e: ActiveError, dt: number): boolean {
    const d = e.data;
    switch (e.defId) {
      case "leak": {
        if (!this.breakers.B2) d.offT = (d.offT ?? 0) + dt;
        else {
          if ((d.offT ?? 0) >= 2.5) return true;
          d.offT = 0;
        }
        return false;
      }
      case "gyro":
        if (this.flags.hyperUsed) {
          this.flags.hyperUsed = false;
          return true;
        }
        return false;
      case "reactor": {
        if (this.coolantOn && this.heat < 45) d.okT = (d.okT ?? 0) + dt;
        else d.okT = 0;
        return (d.okT ?? 0) >= 1;
      }
      case "virus":
        if (this.flags.rebootDone) {
          this.flags.rebootDone = false;
          return true;
        }
        return false;
      case "power": {
        const pat = this.patternTarget;
        if (!pat) return false;
        const ids: BreakerId[] = ["A1", "A2", "B1", "B2"];
        const match = ids.every((id, i) => this.breakers[id] === pat[i]);
        if (match) d.matchT = (d.matchT ?? 0) + dt;
        else d.matchT = 0;
        return (d.matchT ?? 0) >= 1;
      }
      case "fuel": {
        if (!this.held.thrust.v) d.t = (d.t ?? 0) + dt;
        else d.t = 0;
        return (d.t ?? 0) >= 5;
      }
      case "fire": {
        if (this.fires === 0) d.okT = (d.okT ?? 0) + dt;
        else d.okT = 0;
        return (d.okT ?? 0) >= 0.8;
      }
      case "autopilot": {
        if (this.held.up.v && this.held.down.v) d.t = (d.t ?? 0) + dt;
        else d.t = 0;
        return (d.t ?? 0) >= 2;
      }
      default:
        return false;
    }
  }

  snapshot(phase: Phase): Snapshot {
    const hazards: string[] = [];
    if (this.stormT > 0) hazards.push("storm");
    if (this.gravityT > 0) hazards.push("gravity");
    if (this.ents.some((e) => e.kind === "pirate" && e.life > 0)) hazards.push("pirates");
    return {
      phase,
      t: this.t,
      hull: Math.round(this.hull),
      heat: Math.round(this.heat),
      fires: this.fires,
      breakers: { ...this.breakers },
      shieldSide: this.shieldSide,
      shieldUp: this.shieldUp,
      coolantOn: this.coolantOn,
      rebootT: this.rebootT,
      errors: this.errors.map((e) => ({
        code: e.code, title: e.title, tLeft: Math.max(0, e.tLeft), dur: e.dur,
      })),
      patternTarget: this.patternTarget,
      hazards,
      heldNote: { up: this.held.up.v, down: this.held.down.v, thrust: this.held.thrust.v },
      progress: this.progress,
      speed: this.speed,
      cds: {
        fire: Math.max(0, this.cds.fire),
        extinguish: Math.max(0, this.cds.extinguish),
        hyper: Math.max(0, this.cds.hyper),
        fireMax: this.coolantOn ? 1.3 : 0.65,
      },
      shakeSeq: this.shakeSeq,
      lastShake: this.lastShake,
      errSeq: this.errSeq,
      result: this.result,
      log: this.logLines.slice(-6),
      tripped: this.tripped,
    };
  }
}
