// ====== CRT space renderer: pure canvas 2D pixel art (960x540 logical) ======
import { GameSim, WORLD } from "@/lib/game/sim";
import type { Phase } from "@/lib/game/types";
import { sfx } from "@/lib/sfx";

interface Particle {
  x: number; y: number; vx: number; vy: number;
  life: number; max: number; size: number; color: string;
}
interface Beam { x1: number; y1: number; x2: number; y2: number; ttl: number; ttlMax: number }
interface Heart { x: number; y: number; vy: number; life: number }

const PAL = {
  hull: "#8ca6b3",
  hullHi: "#c3d5dd",
  hullLo: "#4c626e",
  glass: "#5ff2f2",
  glassHi: "#d9ffff",
  glassLo: "#123f4a",
  accent: "#ffb000",
  accentHi: "#ffd24a",
  engine: "#1c2733",
  engineDark: "#0b1118",
  cont1: "#b0413c",
  cont1d: "#6e2420",
  cont2: "#2f8f83",
  cont2d: "#1a5a52",
  char: "#1a1f26",
};

export class Renderer {
  private stars: { x: number; y: number; spd: number; size: number; color: string }[] = [];
  private particles: Particle[] = [];
  private beams: Beam[] = [];
  private hearts: Heart[] = [];
  private shakeT = 0;
  private shakeMag = 0;
  private jumpT = 0;
  private flash = 0;
  private shieldFlash = 0;
  private sheet: HTMLImageElement | null = null;
  private sheetOk = false;
  // конец игры
  private loseT = -1;
  private shipGone = false;
  private shipSink = 0;
  private winT = -1;
  private loseExplosions = new Set<number>();
  private smokeT = 0;
  private glitchSeed = 0;

  constructor() {
    const colors = ["#3a5a78", "#6d95b8", "#bfe3ff", "#ff9dd2"];
    for (let i = 0; i < 130; i++) {
      this.stars.push({
        x: Math.random() * WORLD.w,
        y: Math.random() * WORLD.h,
        spd: [16, 42, 96][i % 3] * (0.7 + Math.random() * 0.6),
        size: i % 3 === 2 ? 2 : 1,
        color: colors[i % colors.length],
      });
    }
    if (typeof window !== "undefined") {
      const sp = new Image();
      sp.onload = () => {
        this.sheetOk = true;
      };
      sp.src = "sprites/cosmo_junk_sheet.png";
      this.sheet = sp;
    }
  }

  private drawSprite(
    ctx: CanvasRenderingContext2D,
    col: number,
    row: number,
    x: number,
    y: number,
    w: number,
    h: number,
    rot = 0,
    alpha = 1
  ) {
    if (!this.sheetOk || !this.sheet) return false;
    ctx.save();
    ctx.translate(x, y);
    if (rot) ctx.rotate(rot);
    if (alpha !== 1) ctx.globalAlpha *= alpha;
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(this.sheet, col * 192, row * 192, 192, 192, -w * 0.5, -h * 0.5, w, h);
    ctx.restore();
    return true;
  }

  reset() {
    this.particles = [];
    this.beams = [];
    this.hearts = [];
    this.shakeT = 0;
    this.jumpT = 0;
    this.flash = 0;
    this.loseT = -1;
    this.shipGone = false;
    this.shipSink = 0;
    this.winT = -1;
    this.loseExplosions.clear();
  }

  private burst(x: number, y: number, n: number, colors: string[], speed = 190) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const v = speed * (0.3 + Math.random() * 0.9);
      this.particles.push({
        x, y,
        vx: Math.cos(a) * v, vy: Math.sin(a) * v,
        life: 0, max: 0.4 + Math.random() * 0.5,
        size: 2 + Math.random() * 3,
        color: colors[i % colors.length],
      });
    }
  }

  private eatFx(sim: GameSim) {
    const fx = sim.fx.splice(0);
    for (const f of fx) {
      switch (f.kind) {
        case "explo":
          this.burst(f.x, f.y, f.big ? 52 : 22, ["#ffd24a", "#ff9f1c", "#ff3b5b", "#fff3d6", "#7a4a2a"], f.big ? 260 : 180);
          if (f.big) {
            this.shakeT = Math.max(this.shakeT, 0.4);
            this.shakeMag = Math.max(this.shakeMag, 7);
            sfx.play("bigboom");
          } else {
            sfx.play("boom");
          }
          break;
        case "spark":
          this.burst(f.x, f.y, 12, ["#9ff5ff", "#57e6e6", "#ffffff"], 230);
          this.shieldFlash = 0.25;
          sfx.play("shield");
          break;
        case "shake":
          this.shakeT = Math.max(this.shakeT, 0.32);
          this.shakeMag = Math.max(this.shakeMag, f.amt * 8);
          break;
        case "beam":
          this.beams.push({ x1: f.x1, y1: f.y1, x2: f.x2, y2: f.y2, ttl: 0.12, ttlMax: 0.12 });
          sfx.play("laser");
          break;
        case "muzzle":
          sfx.play("click");
          break;
        case "jump":
          this.jumpT = 1;
          sfx.play("jump");
          break;
        case "alarm": sfx.play("alarm"); break;
        case "resolve":
          sfx.play("resolve");
          this.burst(WORLD.shipX, sim.shipY - 60, 16, ["#3bff8f", "#c8ffe2", "#57e6e6"], 130);
          break;
        case "fail": sfx.play("fail"); this.flash = Math.max(this.flash, 0.35); break;
        case "trip": sfx.play("trip"); this.glitchSeed = 1; break;
        case "hit": sfx.play("hit"); break;
        case "extinguish":
          sfx.play("extinguish");
          this.burst(WORLD.shipX - 20, sim.shipY, 22, ["#e8faff", "#b8e6f0", "#ffffff"], 120);
          break;
        case "rebootOk": sfx.play("reboot"); break;
        case "cheer":
          sfx.play("cheer");
          for (let i = 0; i < 5; i++) {
            this.hearts.push({ x: 200 + Math.random() * 560, y: WORLD.h + 10, vy: -60 - Math.random() * 40, life: 3.2 });
          }
          break;
        case "denied": sfx.play("denied"); break;
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D, sim: GameSim, phase: Phase, dt: number, now: number) {
    const W = WORLD.w, H = WORLD.h;
    this.eatFx(sim);

    // поражение: цепочка взрывов
    if (sim.result && !sim.result.won && this.loseT < 0) {
      this.loseT = 0;
      sfx.play("bigboom");
      this.flash = 1;
      this.shakeT = 0.9;
      this.shakeMag = 15;
    }
    if (sim.result?.won && this.winT < 0) {
      this.winT = 0;
      sfx.play("resolve");
    }

    ctx.save();
    if (this.shakeT > 0) {
      this.shakeT -= dt;
      const m = this.shakeMag * (this.shakeT > 0 ? this.shakeT / 0.32 : 0);
      ctx.translate((Math.random() - 0.5) * m, (Math.random() - 0.5) * m);
      if (this.shakeT <= 0) this.shakeMag = 0;
    }

    // ---- фон ----
    ctx.fillStyle = "#04060e";
    ctx.fillRect(-20, -20, W + 40, H + 40);

    const speedFactor = (0.25 + sim.speed / 26) * (this.jumpT > 0 ? 6 : 1) * (this.winT >= 0 ? Math.max(0.15, 1 - this.winT) : 1);
    for (const s of this.stars) {
      s.x -= s.spd * speedFactor * dt;
      if (s.x < -4) {
        s.x = W + 4;
        s.y = Math.random() * H;
      }
      ctx.globalAlpha = 0.35 + 0.65 * Math.abs(Math.sin(s.x * 0.03 + s.y + now * 0.0012));
      ctx.fillStyle = s.color;
      if (this.jumpT > 0 && s.size === 2) ctx.fillRect(s.x, s.y, 16, 1);
      else ctx.fillRect(s.x | 0, s.y | 0, s.size, s.size);
    }
    ctx.globalAlpha = 1;
    if (this.jumpT > 0) this.jumpT -= dt;

    // штормовой оттенок
    if (sim.stormT > 0) {
      ctx.fillStyle = `rgba(255,75,216,${0.05 + 0.03 * Math.sin(now * 0.01)})`;
      ctx.fillRect(-20, -20, W + 40, H + 40);
    }
    if (sim.gravityT > 0) {
      const g = ctx.createLinearGradient(0, H * 0.55, 0, H);
      g.addColorStop(0, "rgba(120,64,255,0)");
      g.addColorStop(1, "rgba(120,64,255,0.28)");
      ctx.fillStyle = g;
      ctx.fillRect(-20, H * 0.55, W + 40, H * 0.45 + 20);
    }

    // ---- станция (финиш) ----
    if (sim.progress > 0.86 || sim.result?.won) {
      const ap = Math.min(1, (sim.progress - 0.86) / 0.14);
      const sx = W + 120 - ap * 240;
      this.drawStation(ctx, sx, H / 2, now);
    }

    // ---- сущности ----
    for (const e of sim.ents) this.drawEnt(ctx, e, now);

    // ---- корабль ----
    if (this.loseT >= 0) this.updateLose(sim, dt);
    if (!this.shipGone) {
      let shipX = WORLD.shipX;
      if (this.winT >= 0) {
        this.winT += dt;
        const t = Math.min(1, this.winT / 1.8);
        shipX += (660 - WORLD.shipX) * (t * t);
        if (this.winT > 1.4) this.shipSink += dt;
      }
      this.drawShip(ctx, shipX, sim.shipY + this.shipSink * 10, sim, now, dt);
      if (this.winT > 1.5 && Math.random() < 0.3) {
        this.burst(shipX + 40, sim.shipY, 2, ["#3bff8f", "#c8ffe2", "#57e6e6"], 60);
      }
    }

    // ---- лучи ----
    for (const b of this.beams) {
      b.ttl -= dt;
    }
    this.beams = this.beams.filter((b) => b.ttl > 0);
    for (const b of this.beams) {
      const a = b.ttl / b.ttlMax;
      ctx.strokeStyle = `rgba(255,75,216,${a})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(b.x1, b.y1);
      ctx.lineTo(b.x2, b.y2);
      ctx.stroke();
      ctx.strokeStyle = `rgba(255,255,255,${a * 0.9})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // ---- частицы ----
    this.updateParticles(ctx, dt);

    // ---- сердечки поддержки ----
    for (const hrt of this.hearts) {
      hrt.y += hrt.vy * dt;
      hrt.life -= dt;
      this.drawHeart(ctx, hrt.x, hrt.y, Math.min(1, hrt.life));
    }
    this.hearts = this.hearts.filter((hrt) => hrt.life > 0);

    // ---- глитч при выключенных датчиках (B2) ----
    if (!sim.breakers.B2 || this.glitchSeed > 0) {
      this.glitchSeed = Math.max(0, this.glitchSeed - dt);
      for (let i = 0; i < 4; i++) {
        const gy = (Math.random() * Math.max(1, H - 8)) | 0;
        const gh = 2 + ((Math.random() * 6) | 0);
        const off = ((Math.random() - 0.5) * 24) | 0;
        ctx.drawImage(ctx.canvas, 0, gy, W, gh, off, gy, W, gh);
        ctx.fillStyle = i % 2 === 0 ? "rgba(87,230,230,0.14)" : "rgba(255,59,91,0.12)";
        ctx.fillRect(0, gy, W, 1);
      }
    }

    ctx.restore();

    // белая вспышка
    if (this.flash > 0) {
      this.flash = Math.max(0, this.flash - dt * 1.4);
      ctx.fillStyle = `rgba(255,255,255,${this.flash * 0.85})`;
      ctx.fillRect(0, 0, W, H);
    }

    // виньетка поражения
    if (this.loseT >= 0 && this.loseT > 1.2) {
      ctx.fillStyle = `rgba(20,4,8,${Math.min(0.6, (this.loseT - 1.2) * 0.4)})`;
      ctx.fillRect(0, 0, W, H);
    }
  }

  private updateLose(sim: GameSim, dt: number) {
    this.loseT += dt;
    const marks = [0.05, 0.3, 0.55, 0.85];
    for (const m of marks) {
      if (this.loseT >= m && !this.loseExplosions.has(m)) {
        this.loseExplosions.add(m);
        this.burst(
          WORLD.shipX + (Math.random() - 0.5) * 110,
          sim.shipY + (Math.random() - 0.5) * 60,
          46,
          ["#ffd24a", "#ff9f1c", "#ff3b5b", "#fff3d6", "#5a5a5a"],
          280
        );
        this.shakeT = 0.4;
        this.shakeMag = 11;
        sfx.play("bigboom");
      }
    }
    if (this.loseT > 0.95) this.shipGone = true;
  }

  private updateParticles(ctx: CanvasRenderingContext2D, dt: number) {
    for (const p of this.particles) {
      p.life += dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vx *= Math.exp(-1.6 * dt);
      p.vy *= Math.exp(-1.6 * dt);
    }
    this.particles = this.particles.filter((p) => p.life < p.max);
    for (const p of this.particles) {
      const a = 1 - p.life / p.max;
      ctx.globalAlpha = a;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x | 0, p.y | 0, p.size, p.size);
    }
    ctx.globalAlpha = 1;
  }

  // ---------- спрайты ----------

  private drawStation(ctx: CanvasRenderingContext2D, x: number, y: number, now: number) {
    if (this.sheetOk) {
      const blink = Math.sin(now * 0.006) > 0 ? "#3bff8f" : "#ff3b5b";
      this.drawSprite(ctx, 4, 0, x, y, 188, 188, 0, 1);
      ctx.save();
      ctx.fillStyle = blink;
      ctx.beginPath();
      ctx.arc(x, y - 82, 4, 0, Math.PI * 2);
      ctx.arc(x, y + 82, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      return;
    }
    ctx.save();
    ctx.translate(x, y);
    const blink = Math.sin(now * 0.006) > 0 ? "#3bff8f" : "#ff3b5b";
    // пилоны
    ctx.fillStyle = "#33454f";
    ctx.fillRect(-14, -190, 28, 130);
    ctx.fillRect(-14, 60, 28, 130);
    ctx.fillStyle = "#55707d";
    ctx.fillRect(-14, -190, 6, 130);
    ctx.fillRect(-14, 60, 6, 130);
    // кольцо
    ctx.strokeStyle = "#55707d";
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.arc(0, 0, 74, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = blink;
    ctx.lineWidth = 3;
    const a0 = now * 0.001;
    ctx.beginPath();
    ctx.arc(0, 0, 74, a0, a0 + 0.9);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, 74, a0 + Math.PI, a0 + Math.PI + 0.9);
    ctx.stroke();
    ctx.fillStyle = "#0b1620";
    ctx.fillRect(-6, -56, 12, 112);
    ctx.fillStyle = blink === "#3bff8f" ? "#57e6e6" : "#ffb000";
    for (let i = -2; i <= 2; i++) ctx.fillRect(-2, i * 22, 4, 6);
    ctx.restore();
  }

  private drawEnt(ctx: CanvasRenderingContext2D, e: GameSim["ents"][number], now: number) {
    if (this.sheetOk) {
      switch (e.kind) {
        case "rock": {
          const col = Math.abs(Math.floor(e.seed)) % 3;
          this.drawSprite(ctx, col, 1, e.x, e.y, e.r * 2.35, e.r * 2.35, e.rot, 1);
          return;
        }
        case "comet": {
          const cometRot = Math.atan2(-e.vy, -e.vx);
          this.drawSprite(ctx, 3, 1, e.x + Math.cos(cometRot) * 12, e.y - Math.sin(cometRot) * 12, 68, 68, cometRot, 1);
          return;
        }
        case "flareT":
        case "flareB": {
          const pulse = 0.72 + 0.28 * Math.sin(now * 0.03 + e.seed);
          this.drawSprite(ctx, 4, 1, e.x, e.y, 40, 40, now * 0.004, pulse);
          return;
        }
        case "pirate": {
          const col = e.life <= 0 ? 3 : 2;
          this.drawSprite(ctx, col, 0, e.x, e.y, 58, 58, 0, 1);
          return;
        }
        case "bolt": {
          this.drawSprite(ctx, 5, 0, e.x, e.y, 30, 30, 0, 1);
          return;
        }
      }
    }
    switch (e.kind) {
      case "rock": {
        ctx.save();
        ctx.translate(e.x, e.y);
        ctx.rotate(e.rot);
        ctx.fillStyle = "#242e3a";
        const pts = 9;
        ctx.beginPath();
        for (let i = 0; i < pts; i++) {
          const a = (i / pts) * Math.PI * 2;
          const rr = e.r * (0.7 + 0.3 * Math.abs(Math.sin(e.seed + i * 2.35)));
          const px = Math.round(Math.cos(a) * rr);
          const py = Math.round(Math.sin(a) * rr);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = "#39485a";
        ctx.fillRect((-e.r * 0.42) | 0, (-e.r * 0.5) | 0, (e.r * 0.55) | 0, (e.r * 0.4) | 0);
        ctx.fillStyle = "#161d26";
        ctx.fillRect((e.r * 0.1) | 0, (e.r * 0.05) | 0, (e.r * 0.3) | 0, (e.r * 0.26) | 0);
        ctx.restore();
        break;
      }
      case "comet": {
        ctx.save();
        ctx.translate(e.x, e.y);
        ctx.fillStyle = "#9ff5ff";
        ctx.fillRect(-5, -5, 10, 10);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(-2, -2, 5, 5);
        ctx.fillStyle = "rgba(157,245,255,0.4)";
        const tail = 30 + Math.sin(now * 0.02 + e.seed) * 8;
        ctx.fillRect(6, -2, tail, 2);
        ctx.fillRect(6, 2, tail * 0.6, 1);
        ctx.fillRect(6, -4, tail * 0.7, 1);
        ctx.restore();
        break;
      }
      case "flareT":
      case "flareB": {
        ctx.save();
        ctx.translate(e.x, e.y);
        if (e.kind === "flareB") ctx.scale(1, -1);
        const pulse = 0.7 + 0.3 * Math.sin(now * 0.03 + e.seed);
        ctx.globalAlpha = pulse;
        ctx.fillStyle = "#ff8c42";
        ctx.fillRect(-4, -6, 8, 12);
        ctx.fillStyle = "#ffd24a";
        ctx.fillRect(-2, -3, 4, 7);
        ctx.fillStyle = "rgba(255,60,60,0.5)";
        ctx.fillRect(-6, -1, 12, 4);
        ctx.globalAlpha = 1;
        ctx.restore();
        break;
      }
      case "pirate": {
        ctx.save();
        ctx.translate(e.x, e.y);
        const fleeing = e.life <= 0;
        ctx.fillStyle = fleeing ? "#4a2530" : "#7a2534";
        ctx.fillRect(-14, -6, 22, 12);
        ctx.fillRect(-8, -10, 10, 4);
        ctx.fillRect(-8, 6, 10, 4);
        ctx.fillStyle = "#ff3b5b";
        ctx.fillRect(8, -3, 6, 6);
        ctx.fillStyle = "#ffb3c2";
        ctx.fillRect(9, -2, 2, 2);
        if (!fleeing && Math.sin(now * 0.02 + e.seed) > 0.6) {
          ctx.fillStyle = "#ff4bd8";
          ctx.fillRect(14, -1, 5, 2);
        }
        ctx.fillStyle = "#0d141c";
        ctx.fillRect(-16, -2, 3, 4);
        ctx.restore();
        break;
      }
      case "bolt": {
        ctx.save();
        ctx.translate(e.x, e.y);
        ctx.fillStyle = "rgba(255,75,216,0.35)";
        ctx.fillRect(-6, -3, 12, 6);
        ctx.fillStyle = "#ff4bd8";
        ctx.fillRect(-4, -1.5, 9, 3);
        ctx.fillStyle = "#ffd7f4";
        ctx.fillRect(2, -1, 3, 2);
        ctx.restore();
        break;
      }
    }
  }

  private drawShip(ctx: CanvasRenderingContext2D, x: number, y: number, sim: GameSim, now: number, dt = 0.016) {
    const u = 4;
    const px = (dx: number, dy: number, wd: number, ht: number, c: string) => {
      ctx.fillStyle = c;
      ctx.fillRect(Math.round(x + dx * u), Math.round(y + dy * u), Math.max(1, Math.round(wd * u)), Math.max(1, Math.round(ht * u)));
    };

    const thrusting = sim.held.thrust.v && sim.breakers.A1;
    const heatGlow = Math.max(0, sim.heat - 55) / 45;

    // щит
    if (sim.shieldUp) {
      const fl = 1 + this.shieldFlash * 2.4;
      this.shieldFlash = Math.max(0, this.shieldFlash - dt * 1.4);
      ctx.save();
      ctx.strokeStyle = `rgba(87,230,230,${0.35 * fl})`;
      ctx.lineWidth = 3;
      const R = 118;
      const ranges: Record<number, [number, number]> = {
        0: [-1.05, 1.05],
        1: [-Math.PI / 2 - 1.05, -Math.PI / 2 + 1.05],
        2: [Math.PI - 1.05, Math.PI + 1.05],
        3: [Math.PI / 2 - 1.05, Math.PI / 2 + 1.05],
      };
      const [a0, a1] = ranges[sim.shieldSide];
      ctx.setLineDash([7, 5]);
      ctx.lineDashOffset = -now * 0.03;
      ctx.beginPath();
      ctx.arc(x + 8, y, R, a0, a1);
      ctx.stroke();
      ctx.strokeStyle = `rgba(159,245,255,${0.14 * fl})`;
      ctx.lineWidth = 9;
      ctx.beginPath();
      ctx.arc(x + 8, y, R, a0, a1);
      ctx.stroke();
      ctx.restore();
    }

    // выхлоп
    if (this.sheetOk) {
      const col = thrusting ? 1 : 0;
      const sy = y + Math.sin(now * 0.006) * 1.5;
      this.drawSprite(ctx, col, 0, x - 6, sy, 114, 114, 0, 1);
      if (sim.fires > 0) {
        const pulse = 0.9 + Math.sin(now * 0.025) * 0.15;
        this.drawSprite(ctx, 1, 3, x + 6, sy - 14, 28 * pulse, 28 * pulse, 0, 0.92);
      }
      if (sim.invuln > 0 && Math.sin(now * 0.05) > 0) {
        ctx.strokeStyle = "rgba(255,255,255,0.7)";
        ctx.lineWidth = 2;
        ctx.strokeRect(Math.round(x - 14 * u), Math.round(y - 6.4 * u), Math.round(24.5 * u), Math.round(12.4 * u));
      }
      if (sim.fires > 0) {
        this.smokeT -= 0.016;
        if (this.smokeT <= 0) {
          this.smokeT = 0.06 / sim.fires;
          for (let i = 0; i < sim.fires; i++) {
            const fx0 = x - 30 + Math.random() * 80;
            const fy0 = y - 12 + Math.random() * 24;
            this.particles.push({
              x: fx0, y: fy0,
              vx: -30 - Math.random() * 40, vy: -20 - Math.random() * 30,
              life: 0, max: 0.5 + Math.random() * 0.4,
              size: 2 + Math.random() * 2,
              color: Math.random() < 0.45 ? "#ff8c42" : Math.random() < 0.7 ? "#ffd24a" : "#4a4f57",
            });
          }
        }
      }
      return;
    }

    if (sim.breakers.A1) {
      const fl = (thrusting ? 2.6 : 1.1) + Math.sin(now * 0.02) * 0.5 + Math.random() * 0.5;
      px(-13.5, -1.2, -fl * 1.4, 2.4, `rgba(45,212,238,${0.3 + heatGlow * 0.2})`);
      px(-13.2, -0.6, -fl, 1.2, heatGlow > 0.5 ? "#ffd24a" : "#9be8ff");
    }
    // двигатель
    px(-13, -2, 3, 4, PAL.engine);
    px(-10.5, -1, 0.8, 2, PAL.engineDark);
    if (heatGlow > 0.01) px(-13.2, -2.2, 0.6, 4.4, `rgba(255,90,60,${heatGlow * 0.8})`);

    // корпус
    px(-10, -3, 14, 6, PAL.hull);
    px(-9.5, -3.6, 13, 1, PAL.hullHi);
    px(-9.5, 2.6, 13, 1, PAL.hullLo);
    px(4, -2, 4, 4, PAL.hull);
    px(8, -1.4, 1.6, 2.8, PAL.hullHi);
    px(9.4, -0.6, 0.8, 1.2, PAL.hullHi);

    // контейнеры
    px(-9, -2, 2, 4, PAL.cont1);
    px(-9, -2, 2, 0.6, PAL.cont1d);
    px(-9, 1.4, 2, 0.6, PAL.cont1d);
    px(-6.8, -2, 2, 4, PAL.cont2);
    px(-6.8, -2, 2, 0.6, PAL.cont2d);
    px(-6.8, 1.4, 2, 0.6, PAL.cont2d);
    // полоса
    px(-4.4, -3, 1.6, 6, PAL.accent);

    // кабина
    px(3, -1.8, 3, 2.2, PAL.glassLo);
    px(3.4, -1.3, 2, 1.2, PAL.glass);
    px(4.6, -1.1, 0.7, 0.7, PAL.glassHi);

    // крылья
    px(-8, -4.8, 4.5, 1.8, PAL.accent);
    px(-4, -5.6, 1, 1, PAL.accentHi);
    px(-8, 3, 4.5, 1.8, PAL.accent);
    px(-4, 4.6, 1, 1, PAL.accentHi);

    // антенна
    px(0.5, -5.2, 0.5, 1.6, PAL.hullLo);
    if (Math.sin(now * 0.008) > 0) px(0.4, -6, 0.8, 0.8, "#ff3b5b");

    // повреждения
    if (sim.hull < 66) px(1.6, -2.6, 1.6, 1.4, PAL.char);
    if (sim.hull < 40) {
      px(-7.4, 1, 1.8, 1.6, PAL.char);
      px(-1, 1.8, 1.2, 1, PAL.char);
    }
    if (sim.hull < 20) px(6.2, 0.6, 1.4, 1.4, PAL.char);

    // неуязвимость после прыжка
    if (sim.invuln > 0 && Math.sin(now * 0.05) > 0) {
      ctx.strokeStyle = "rgba(255,255,255,0.7)";
      ctx.lineWidth = 2;
      ctx.strokeRect(Math.round(x - 14 * u), Math.round(y - 6.4 * u), Math.round(24.5 * u), Math.round(12.4 * u));
    }

    // пожары — дым и пламя
    if (sim.fires > 0) {
      this.smokeT -= 0.016;
      if (this.smokeT <= 0) {
        this.smokeT = 0.06 / sim.fires;
        for (let i = 0; i < sim.fires; i++) {
          const fx0 = x - 30 + Math.random() * 80;
          const fy0 = y - 12 + Math.random() * 24;
          this.particles.push({
            x: fx0, y: fy0,
            vx: -30 - Math.random() * 40, vy: -20 - Math.random() * 30,
            life: 0, max: 0.5 + Math.random() * 0.4,
            size: 2 + Math.random() * 2,
            color: Math.random() < 0.45 ? "#ff8c42" : Math.random() < 0.7 ? "#ffd24a" : "#4a4f57",
          });
        }
      }
    }
  }

  private drawHeart(ctx: CanvasRenderingContext2D, x: number, y: number, alpha: number) {
    if (this.sheetOk) {
      this.drawSprite(ctx, 0, 3, x + 12, y + 9, 26, 26, 0, Math.max(0, Math.min(1, alpha)));
      return;
    }
    const M = ["01100110", "11111111", "11111111", "01111110", "00111100", "00011000"];
    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
    ctx.fillStyle = "#ff4bd8";
    const u = 3;
    M.forEach((row, ry) => {
      for (let rx = 0; rx < row.length; rx++) {
        if (row[rx] === "1") ctx.fillRect(x + rx * u, y + ry * u, u, u);
      }
    });
    ctx.restore();
  }
}
