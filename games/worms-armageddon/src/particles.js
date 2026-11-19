export class ParticleSystem {
  constructor() {
    this.particles = [];
    this.shockwaves = [];
    this.popups = [];
    this.fxSprites = [];
  }

  clear() {
    this.particles.length = 0;
    this.shockwaves.length = 0;
    this.popups.length = 0;
    this.fxSprites.length = 0;
  }

  spawnExplosion(cx, cy, radius, terrain = null, customColor = null) {
    this.shockwaves.push({
      x: cx,
      y: cy,
      r: 4,
      maxR: radius * 1.45,
      alpha: 0.9,
      color: customColor || '#fff2a6',
    });

    this.fxSprites.push({
      sheet: 'worms',
      key: 'explosion',
      x: cx,
      y: cy,
      vx: 0,
      vy: 0,
      size: Math.max(30, radius * 0.95),
      startSize: Math.max(30, radius * 0.95),
      endSize: Math.max(66, radius * 2.15),
      life: 0.36,
      maxLife: 0.36,
      rot: (Math.random() - 0.5) * 0.6,
      spin: 0,
    });

    const fireCount = Math.round(14 + radius * 0.25);
    for (let i = 0; i < fireCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = (0.2 + Math.random() * 0.85) * radius * 3.8;
      const life = 0.28 + Math.random() * 0.35;
      this.particles.push({
        kind: 'fire',
        x: cx + Math.cos(angle) * (radius * 0.18),
        y: cy + Math.sin(angle) * (radius * 0.18),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 40,
        size: 6 + Math.random() * (radius * 0.24),
        life,
        maxLife: life,
        color: customColor || (Math.random() < 0.45 ? '#fff3a8' : Math.random() < 0.7 ? '#ff8f1f' : '#ff3d1f'),
        gravity: 90,
        windFactor: 0.2,
      });
    }

    const smokeCount = Math.round(10 + radius * 0.18);
    for (let i = 0; i < smokeCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 20 + Math.random() * 85;
      const life = 0.7 + Math.random() * 0.8;
      this.particles.push({
        kind: 'smoke',
        x: cx + (Math.random() - 0.5) * radius * 0.5,
        y: cy + (Math.random() - 0.5) * radius * 0.5,
        vx: Math.cos(angle) * speed,
        vy: -35 - Math.random() * 55,
        size: 10 + Math.random() * (radius * 0.28),
        life,
        maxLife: life,
        color: customColor ? 'rgba(255, 240, 185, 0.7)' : 'rgba(65, 65, 72, 0.75)',
        gravity: -28,
        windFactor: 0.85,
      });
    }

    const debrisCount = Math.round(10 + radius * 0.22);
    for (let i = 0; i < debrisCount; i++) {
      const angle = -Math.PI * 0.92 + Math.random() * Math.PI * 0.84;
      const speed = 130 + Math.random() * (radius * 5.2);
      const life = 0.65 + Math.random() * 0.7;
      const color = terrain
        ? terrain.sampleColor(cx + (Math.random() - 0.5) * radius, cy + (Math.random() - 0.5) * radius)
        : '#7a5436';
      this.particles.push({
        kind: 'debris',
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2.8 + Math.random() * 3.8,
        life,
        maxLife: life,
        color,
        gravity: 430,
        windFactor: 0.15,
      });
    }

    const sparkCount = Math.round(8 + radius * 0.15);
    for (let i = 0; i < sparkCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 160 + Math.random() * 260;
      const life = 0.25 + Math.random() * 0.35;
      this.particles.push({
        kind: 'spark',
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 60,
        size: 2.2,
        life,
        maxLife: life,
        color: customColor || '#ffe875',
        gravity: 260,
        windFactor: 0.1,
      });
    }
  }

  spawnTrail(x, y, color = 'rgba(235, 240, 250, 0.65)', size = 4) {
    const life = 0.32 + Math.random() * 0.2;
    this.particles.push({
      kind: 'smoke',
      x,
      y,
      vx: (Math.random() - 0.5) * 14,
      vy: -12 - Math.random() * 14,
      size,
      life,
      maxLife: life,
      color,
      gravity: -15,
      windFactor: 0.65,
    });
  }

  spawnSplash(x, y, isLava = false) {
    const count = 22;
    for (let i = 0; i < count; i++) {
      const angle = -Math.PI * 0.9 + Math.random() * Math.PI * 0.8;
      const speed = 110 + Math.random() * 220;
      const life = 0.45 + Math.random() * 0.45;
      this.particles.push({
        kind: 'debris',
        x: x + (Math.random() - 0.5) * 18,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 3 + Math.random() * 3.5,
        life,
        maxLife: life,
        color: isLava ? (Math.random() < 0.5 ? '#ff9f1a' : '#ff4d1a') : Math.random() < 0.4 ? '#e6fbff' : '#3ec7f5',
        gravity: 460,
        windFactor: 0.25,
      });
    }
    if (!isLava) {
      this.fxSprites.push({
        sheet: 'items',
        key: 'splash',
        x,
        y: y - 10,
        vx: 0,
        vy: -32,
        size: 30,
        startSize: 30,
        endSize: 48,
        life: 0.45,
        maxLife: 0.45,
        rot: 0,
        spin: 0,
      });
    }
    this.addPopup(x, y - 24, isLava ? 'SIZZLE!' : 'SPLASH!', isLava ? '#ff9f1a' : '#70e4ff', 18, 0.9);
  }

  spawnAngel(x, y) {
    this.fxSprites.push({
      sheet: 'items',
      key: 'angel',
      x,
      y: y - 12,
      vx: 0,
      vy: -42,
      size: 28,
      startSize: 26,
      endSize: 32,
      life: 1.35,
      maxLife: 1.35,
      rot: 0,
      spin: 0,
    });
  }

  spawnGasCloud(x, y) {
    this.fxSprites.push({
      sheet: 'items',
      key: 'gas',
      x,
      y: y - 8,
      vx: 0,
      vy: -18,
      size: 38,
      startSize: 30,
      endSize: 64,
      life: 0.9,
      maxLife: 0.9,
      rot: 0,
      spin: 0.6,
    });
    for (let i = 0; i < 12; i++) {
      const a = Math.random() * Math.PI * 2;
      const spd = 24 + Math.random() * 65;
      const life = 0.7 + Math.random() * 0.6;
      this.particles.push({
        kind: 'fire',
        x,
        y,
        vx: Math.cos(a) * spd,
        vy: Math.sin(a) * spd - 20,
        size: 5 + Math.random() * 6,
        life,
        maxLife: life,
        color: Math.random() < 0.5 ? '#7bed9f' : '#2ed573',
        gravity: -18,
        windFactor: 0.6,
      });
    }
  }

  spawnIceBurst(x, y) {
    this.fxSprites.push({
      sheet: 'items',
      key: 'ice',
      x,
      y: y - 6,
      vx: 0,
      vy: -14,
      size: 36,
      startSize: 28,
      endSize: 52,
      life: 0.65,
      maxLife: 0.65,
      rot: 0,
      spin: 1.2,
    });
    for (let i = 0; i < 14; i++) {
      const a = Math.random() * Math.PI * 2;
      const spd = 70 + Math.random() * 140;
      const life = 0.45 + Math.random() * 0.35;
      this.particles.push({
        kind: 'debris',
        x,
        y,
        vx: Math.cos(a) * spd,
        vy: Math.sin(a) * spd - 35,
        size: 3.5 + Math.random() * 3,
        life,
        maxLife: life,
        color: Math.random() < 0.5 ? '#dff9fb' : '#74b9ff',
        gravity: 280,
        windFactor: 0.2,
      });
    }
  }

  spawnSonicWave(x, y, angle) {
    this.fxSprites.push({
      sheet: 'items',
      key: 'sonic',
      x: x + Math.cos(angle) * 28,
      y: y + Math.sin(angle) * 28,
      vx: Math.cos(angle) * 160,
      vy: Math.sin(angle) * 160,
      size: 34,
      startSize: 26,
      endSize: 64,
      life: 0.45,
      maxLife: 0.45,
      rot: angle,
      spin: 0,
    });
  }

  spawnTeleport(x, y) {
    this.shockwaves.push({
      x,
      y,
      r: 3,
      maxR: 38,
      alpha: 0.95,
      color: '#48dbfb',
    });
    this.fxSprites.push({
      sheet: 'items',
      key: 'portal',
      x,
      y,
      vx: 0,
      vy: 0,
      size: 40,
      startSize: 46,
      endSize: 16,
      life: 0.4,
      maxLife: 0.4,
      rot: 0,
      spin: 6,
    });
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2;
      this.particles.push({
        kind: 'spark',
        x,
        y,
        vx: Math.cos(a) * 120,
        vy: Math.sin(a) * 120,
        size: 3,
        life: 0.35,
        maxLife: 0.35,
        color: '#a3fff8',
        gravity: 0,
        windFactor: 0,
      });
    }
  }

  addPopup(x, y, text, color = '#ffffff', size = 16, duration = 1.1) {
    this.popups.push({
      x,
      y,
      vy: -36,
      text,
      color,
      size,
      life: duration,
      maxLife: duration,
    });
  }

  update(dt, wind = 0) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= dt;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }
      p.vx += wind * p.windFactor * dt;
      p.vy += p.gravity * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      if (p.kind === 'smoke') {
        p.size += 12 * dt;
      }
    }

    for (let i = this.shockwaves.length - 1; i >= 0; i--) {
      const s = this.shockwaves[i];
      s.r += (s.maxR - s.r) * Math.min(1, dt * 13);
      s.alpha -= dt * 2.5;
      if (s.alpha <= 0.02) {
        this.shockwaves.splice(i, 1);
      }
    }

    for (let i = this.popups.length - 1; i >= 0; i--) {
      const pop = this.popups[i];
      pop.life -= dt;
      pop.y += pop.vy * dt;
      pop.vy *= 0.96;
      if (pop.life <= 0) {
        this.popups.splice(i, 1);
      }
    }

    for (let i = this.fxSprites.length - 1; i >= 0; i--) {
      const fx = this.fxSprites[i];
      fx.life -= dt;
      if (fx.life <= 0) {
        this.fxSprites.splice(i, 1);
        continue;
      }
      const prog = 1 - fx.life / fx.maxLife;
      fx.x += fx.vx * dt;
      fx.y += fx.vy * dt;
      fx.rot += fx.spin * dt;
      fx.size = fx.startSize + (fx.endSize - fx.startSize) * prog;
    }
  }
}
