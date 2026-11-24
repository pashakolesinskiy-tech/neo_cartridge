/**
 * NEO-CARTRIDGE // Live Gameplay Previews Engine
 * Оптимизированная 60 FPS отрисовка превью-анимаций для активных карт и Hero-баннера.
 */

const WORMS_RECTS = {
  wormBazooka: [41, 567, 180, 172],
  wormFire: [287, 533, 218, 206],
  wormIdle: [61, 43, 153, 185],
  rocket: [320, 849, 137, 89],
  explosion: [1033, 788, 221, 193],
  crateWood: [808, 827, 159, 136]
};

const Previews = {
  isRunning: false,
  animationId: null,
  canvases: {},
  contexts: {},
  states: {},
  heroCanvas: null,
  heroCtx: null,
  sheets: {},
  _order: ['stick_fighting', 'pixel_drift', 'chrono_blade', 'mecha_siege', 'worms_armageddon', 'cosmo_junk'],

  init() {
    const sheetMap = {
      stick: 'games/stick_fighting_assets/fighter_vortex.png',
      stickVfx: 'games/stick_fighting_assets/vfx_props.png',
      drift: 'games/sprites/pixel_drift_sheet.png',
      chrono: 'games/sprites/chrono_blade_sheet.png',
      mecha: 'games/sprites/mecha_siege_sheet.png',
      worms: 'games/worms-armageddon/assets/worms-sheet.png',
      cosmo: 'games/sprites/cosmo_junk_sheet.png'
    };
    Object.keys(sheetMap).forEach((k) => {
      const img = new Image();
      img.decoding = 'async';
      img.src = sheetMap[k];
      this.sheets[k] = img;
    });

    this._order.forEach((gameId, idx) => {
      const canvas = document.getElementById(`preview-canvas-${idx}`);
      if (canvas) {
        this.canvases[gameId] = canvas;
        this.contexts[gameId] = canvas.getContext('2d');
        this.initGameState(gameId);
      }
    });

    this.heroCanvas = document.getElementById('hero-inspector-canvas');
    if (this.heroCanvas) {
      this.heroCtx = this.heroCanvas.getContext('2d');
    }

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pause();
      } else if (window.App && !App.isPoweredOn && !App.isBooting) {
        this.resume();
      }
    });

    this.start();
  },

  isSheetReady(key) {
    const img = this.sheets[key];
    return !!(img && img.complete && img.naturalWidth > 0);
  },

  drawCell(ctx, key, col, row, x, y, w, h, rot = 0, flipX = false, alpha = 1) {
    if (!this.isSheetReady(key)) return false;
    const img = this.sheets[key];
    const cw = img.naturalWidth / 6;
    const ch = img.naturalHeight / 4;
    ctx.save();
    ctx.translate(x, y);
    if (rot) ctx.rotate(rot);
    if (flipX) ctx.scale(-1, 1);
    if (alpha !== 1) ctx.globalAlpha *= alpha;
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(img, col * cw, row * ch, cw, ch, -w * 0.5, -h * 0.5, w, h);
    ctx.restore();
    return true;
  },

  drawSpriteRect(ctx, key, rect, x, y, maxW, maxH, rot = 0, flipX = false, alpha = 1) {
    if (!this.isSheetReady(key) || !rect) return false;
    const img = this.sheets[key];
    const [sx, sy, sw, sh] = rect;
    const scale = Math.min(maxW / sw, maxH / sh);
    const dw = sw * scale;
    const dh = sh * scale;
    ctx.save();
    ctx.translate(x, y);
    if (rot) ctx.rotate(rot);
    if (flipX) ctx.scale(-1, 1);
    if (alpha !== 1) ctx.globalAlpha *= alpha;
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(img, sx, sy, sw, sh, -dw * 0.5, -dh * 0.5, dw, dh);
    ctx.restore();
    return true;
  },

  crossed(prevCycle, curCycle, target) {
    return (prevCycle < target && curCycle >= target) || (prevCycle > curCycle && (target >= 0 && curCycle >= target));
  },

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    let lastTime = performance.now();

    const loop = (currentTime) => {
      if (!this.isRunning) return;
      const dt = Math.min(32, currentTime - lastTime);
      lastTime = currentTime;

      const modalOpen = !!document.querySelector('.console-modal.open');
      if (!document.hidden && !modalOpen) {
        this.updateAndRender(dt);
      }
      this.animationId = requestAnimationFrame(loop);
    };

    this.animationId = requestAnimationFrame(loop);
  },

  pause() {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  },

  resume() {
    if (!this.isRunning && !document.hidden) {
      this.start();
    }
  },

  initGameState(gameId) {
    if (gameId === 'stick_fighting') {
      this.states.stick_fighting = { tick: 0, prevTick: 0, p1Hp: 100, p2Hp: 100, sparks: [], combo: 0 };
    } else if (gameId === 'pixel_drift') {
      this.states.pixel_drift = { tick: 0, particles: [], skidmarks: [] };
    } else if (gameId === 'chrono_blade') {
      this.states.chrono_blade = { tick: 0, prevTick: 0, bulletTime: false, sparks: [] };
    } else if (gameId === 'mecha_siege') {
      this.states.mecha_siege = { tick: 0, teslaCharge: 0 };
    } else if (gameId === 'worms_armageddon') {
      this.states.worms_armageddon = { tick: 0, prevTick: 0, smoke: [], particles: [] };
    } else if (gameId === 'cosmo_junk') {
      const stars = [];
      for (let i = 0; i < 48; i++) {
        stars.push({
          x: (i * 37 + 11) % 160,
          y: (i * 53 + 7) % 130,
          z: 0.35 + ((i * 17) % 10) / 10,
          s: i % 7 === 0 ? 2 : 1
        });
      }
      const debris = [];
      for (let i = 0; i < 5; i++) {
        debris.push({
          x: 18 + ((i * 47) % 130),
          y: 12 + ((i * 31) % 78),
          r: 4 + (i % 3) * 2,
          spin: i * 0.9,
          vy: 0.12 + (i % 4) * 0.07
        });
      }
      this.states.cosmo_junk = { tick: 0, stars, debris };
    }
  },

  updateAndRender(dt) {
    const activeIdx = window.App ? App.deckIndex : 0;
    this._order.forEach((gameId, idx) => {
      if (Math.abs(idx - activeIdx) > 2) return;
      const ctx = this.contexts[gameId];
      if (!ctx) return;
      const w = 160;
      const h = 130;

      if (gameId === 'stick_fighting') this.renderStickFighting(ctx, w, h, dt);
      else if (gameId === 'pixel_drift') this.renderPixelDrift(ctx, w, h, dt);
      else if (gameId === 'chrono_blade') this.renderChronoBlade(ctx, w, h, dt);
      else if (gameId === 'mecha_siege') this.renderMechaSiege(ctx, w, h, dt);
      else if (gameId === 'worms_armageddon') this.renderWormsArmageddon(ctx, w, h, frameDt);
      else if (gameId === 'cosmo_junk') this.renderCosmoJunk(ctx, w, h, dt);
    });

    if (this.heroCtx && this.heroCanvas) {
      this.renderHeroBanner(this.heroCtx, this.heroCanvas.width, this.heroCanvas.height);
    }
  },

  renderHeroBanner(ctx, w, h) {
    const active = (window.App && App.currentCartridge) || 'stick_fighting';
    const t = performance.now() * 0.0025;
    ctx.clearRect(0, 0, w, h);

    const palettes = {
      stick_fighting: ['#1f0710', '#0b1326', '#ff3b5c'],
      pixel_drift: ['#041a24', '#0e1328', '#06b6d4'],
      chrono_blade: ['#17072b', '#081526', '#a855f7'],
      mecha_siege: ['#221305', '#101420', '#f59e0b'],
      worms_armageddon: ['#052115', '#0b1829', '#10b981'],
      cosmo_junk: ['#06132b', '#130b29', '#3b82f6']
    };
    const pal = palettes[active] || palettes.stick_fighting;
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, pal[0]);
    grad.addColorStop(1, pal[1]);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = 'rgba(255,255,255,0.045)';
    ctx.lineWidth = 1;
    const gxOff = (t * 18) % 24;
    for (let x = -gxOff; x < w; x += 24) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 0; y < h; y += 24) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    const glow = ctx.createRadialGradient(w * 0.74, h * 0.55, 6, w * 0.74, h * 0.55, 110);
    glow.addColorStop(0, pal[2] + '55');
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);

    const bob = Math.sin(t * 2.2) * 3;
    if (active === 'stick_fighting') {
      this.drawCell(ctx, 'stickVfx', 1, 2, w * 0.56, h * 0.54, 48, 48, 0, false, 0.85);
      this.drawCell(ctx, 'stick', Math.floor(t * 3) % 4, 2, w * 0.70, h * 0.54 + bob, 78, 78, 0, false, 1);
      this.drawCell(ctx, 'stick', 4, 2, w * 0.87, h * 0.52 - bob, 76, 76, 0, true, 1);
    } else if (active === 'pixel_drift') {
      this.drawCell(ctx, 'drift', 0, 1, w * 0.55, h * 0.62, 52, 52, 0, false, 0.9);
      this.drawCell(ctx, 'drift', 2, 0, w * 0.73, h * 0.54 + bob, 86, 86, -0.08, false, 1);
      this.drawCell(ctx, 'drift', 4, 0, w * 0.89, h * 0.60 - bob, 78, 78, -0.12, false, 0.95);
    } else if (active === 'chrono_blade') {
      this.drawCell(ctx, 'chrono', 3, 0, w * 0.64, h * 0.54 + bob, 80, 80, 0, false, 1);
      this.drawCell(ctx, 'chrono', 0, 3, w * 0.75, h * 0.52 + bob, 66, 66, 0, false, 0.95);
      this.drawCell(ctx, 'chrono', 2, 2, w * 0.88, h * 0.54 - bob, 82, 82, 0, true, 1);
    } else if (active === 'mecha_siege') {
      this.drawCell(ctx, 'mecha', 3, 0, w * 0.58, h * 0.54, 68, 68, t * 0.35, false, 0.95);
      this.drawCell(ctx, 'mecha', 0, 0, w * 0.73, h * 0.54 + bob, 68, 68, 0, false, 1);
      this.drawCell(ctx, 'mecha', 2, 2, w * 0.89, h * 0.54 - bob, 80, 80, Math.PI, false, 1);
    } else if (active === 'worms_armageddon') {
      this.drawSpriteRect(ctx, 'worms', WORMS_RECTS.wormBazooka, w * 0.66, h * 0.54 + bob, 74, 74, 0, false, 1);
      this.drawSpriteRect(ctx, 'worms', WORMS_RECTS.wormIdle, w * 0.86, h * 0.54 - bob, 70, 70, 0, true, 1);
    } else if (active === 'cosmo_junk') {
      this.drawCell(ctx, 'cosmo', 4, 0, w * 0.56, h * 0.54, 70, 70, 0, false, 0.9);
      this.drawCell(ctx, 'cosmo', 1, 0, w * 0.73, h * 0.53 + bob, 86, 86, 0, false, 1);
      this.drawCell(ctx, 'cosmo', 2, 0, w * 0.90, h * 0.55 - bob, 68, 68, 0, false, 1);
    }
  },

  renderStickFighting(ctx, w, h, dt) {
    const s = this.states.stick_fighting;
    const prevCycle = Math.floor(s.tick) % 200;
    s.tick += dt * 0.06;
    const cycle = Math.floor(s.tick) % 200;

    ctx.fillStyle = '#060a12';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#0d1527';
    ctx.fillRect(15, 20, 12, 70);
    ctx.fillRect(133, 20, 12, 70);
    ctx.fillStyle = 'rgba(0, 243, 255, 0.08)';
    ctx.beginPath();
    ctx.arc(80, 45, 30, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#161e30';
    ctx.fillRect(0, 92, w, h - 92);
    ctx.fillStyle = '#00f3ff';
    ctx.fillRect(0, 92, w, 2);

    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(10, 8, 55, 6);
    ctx.fillRect(95, 8, 55, 6);
    ctx.fillStyle = '#00f3ff';
    ctx.fillRect(11, 9, (s.p1Hp / 100) * 53, 4);
    ctx.fillStyle = '#ff0055';
    ctx.fillRect(96, 9, (s.p2Hp / 100) * 53, 4);

    let p1Pose = 'idle';
    let p2Pose = 'idle';
    let p1X = 45;
    let p2X = 110;

    if (cycle < 40) {
      p1X = 45 + (cycle / 40) * 25;
      p1Pose = 'walk';
    } else if (cycle < 60) {
      p1X = 70;
      p1Pose = 'punch';
      p2Pose = 'flinch';
      if (this.crossed(prevCycle, cycle, 41)) {
        s.p2Hp = Math.max(20, s.p2Hp - 12);
        this.addSparks(s.sparks, 95, 78, '#ffcc00');
        s.combo = 2;
      }
    } else if (cycle < 95) {
      p1X = 72;
      p1Pose = 'kick';
      p2Pose = 'flinch';
      if (this.crossed(prevCycle, cycle, 62)) {
        s.p2Hp = Math.max(10, s.p2Hp - 18);
        this.addSparks(s.sparks, 98, 72, '#00f3ff');
        s.combo = 3;
      }
    } else if (cycle < 135) {
      p1X = 68;
      p2X = 100;
      p1Pose = 'block';
      p2Pose = 'punch';
      if (this.crossed(prevCycle, cycle, 100)) {
        this.addSparks(s.sparks, 82, 80, '#00f3ff');
      }
    } else if (cycle < 170) {
      p1X = 70;
      p1Pose = 'sweep';
      p2Pose = 'fall';
      p2X = 112;
      if (this.crossed(prevCycle, cycle, 138)) {
        this.addSparks(s.sparks, 100, 90, '#ff0055');
      }
    } else {
      s.p1Hp = 100;
      s.p2Hp = 100;
      s.combo = 0;
    }

    if (this.isSheetReady('stick')) {
      const p1Col = p1Pose === 'punch' ? 0 : p1Pose === 'kick' ? 2 : p1Pose === 'sweep' ? 3 : p1Pose === 'block' ? 5 : (Math.floor(s.tick * 0.3) % 4);
      const p1Row = (p1Pose === 'punch' || p1Pose === 'kick' || p1Pose === 'sweep' || p1Pose === 'block') ? 2 : 1;
      const p2Col = p2Pose === 'punch' ? 1 : p2Pose === 'flinch' ? 0 : p2Pose === 'fall' ? 2 : 0;
      const p2Row = p2Pose === 'punch' ? 2 : (p2Pose === 'flinch' || p2Pose === 'fall') ? 3 : 0;
      this.drawCell(ctx, 'stick', p1Col, p1Row, p1X, 72, 46, 46, 0, false, 1);
      this.drawCell(ctx, 'stick', p2Col, p2Row, p2X, 72, 46, 46, 0, true, 1);
    }

    this.renderSparks(ctx, s.sparks);
    if (s.combo > 0 && cycle >= 41 && cycle < 120) {
      ctx.fillStyle = '#ffcc00';
      ctx.font = '8px monospace';
      ctx.fillText(`${s.combo}x COMBO!`, 65, 35);
    }
  },

  renderPixelDrift(ctx, w, h, dt) {
    const s = this.states.pixel_drift;
    s.tick += dt * 0.05;

    ctx.fillStyle = '#061214';
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 36;
    ctx.beginPath();
    ctx.ellipse(80, 65, 52, 36, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(80, 65, 70, 54, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(80, 65, 34, 18, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 6]);
    ctx.beginPath();
    ctx.ellipse(80, 65, 52, 36, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    const t = s.tick * 0.45;
    const roadX = 80 + Math.cos(t) * 52;
    const roadY = 65 + Math.sin(t) * 36;
    const tangent = Math.atan2(Math.cos(t) * 36, -Math.sin(t) * 52) + Math.PI;
    const driftAngle = tangent + 0.55;

    if (s.skidmarks.length === 0 || Math.hypot(s.skidmarks[s.skidmarks.length - 1].x - roadX, s.skidmarks[s.skidmarks.length - 1].y - roadY) > 4) {
      s.skidmarks.push({ x: roadX, y: roadY, alpha: 0.6 });
      if (s.skidmarks.length > 22) s.skidmarks.shift();
    }

    s.skidmarks.forEach((sm) => {
      ctx.fillStyle = `rgba(15, 23, 42, ${sm.alpha})`;
      ctx.fillRect(sm.x - 2, sm.y - 2, 4, 4);
      sm.alpha *= 0.96;
    });

    if (Math.random() < 0.55) {
      s.particles.push({
        x: roadX - Math.cos(driftAngle) * 6 + (Math.random() - 0.5) * 4,
        y: roadY - Math.sin(driftAngle) * 6 + (Math.random() - 0.5) * 4,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: 2 + Math.random() * 2.5,
        alpha: 0.8
      });
    }

    for (let i = s.particles.length - 1; i >= 0; i--) {
      const p = s.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.radius += 0.15;
      p.alpha -= 0.035;
      if (p.alpha <= 0) {
        s.particles.splice(i, 1);
        continue;
      }
      ctx.fillStyle = `rgba(200, 230, 245, ${p.alpha})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    if (this.isSheetReady('drift')) {
      this.drawCell(ctx, 'drift', 2, 0, roadX, roadY, 34, 34, driftAngle, false, 1);
      const t2 = t - 1.35;
      const r2X = 80 + Math.cos(t2) * 52;
      const r2Y = 65 + Math.sin(t2) * 36;
      const tan2 = Math.atan2(Math.cos(t2) * 36, -Math.sin(t2) * 52) + Math.PI + 0.4;
      this.drawCell(ctx, 'drift', 4, 0, r2X, r2Y, 32, 32, tan2, false, 1);
    }

    ctx.fillStyle = '#38bdf8';
    ctx.font = '8px monospace';
    ctx.fillText(`DRIFT +${Math.floor(s.tick * 15) % 800 + 200}`, 10, 18);
  },

  renderChronoBlade(ctx, w, h, dt) {
    const s = this.states.chrono_blade;
    const prevCycle = Math.floor(s.tick) % 180;
    s.tick += dt * 0.055;
    const cycle = Math.floor(s.tick) % 180;

    s.bulletTime = cycle > 55 && cycle < 115;

    ctx.fillStyle = s.bulletTime ? '#130424' : '#0a0512';
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = s.bulletTime ? 'rgba(168, 85, 247, 0.4)' : 'rgba(168, 85, 247, 0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, 92);
    ctx.lineTo(w, 92);
    ctx.stroke();

    const gridOffset = (s.tick * (s.bulletTime ? 1.5 : 5)) % 16;
    for (let gx = -gridOffset; gx < w; gx += 16) {
      ctx.beginPath();
      ctx.moveTo(gx, 92);
      ctx.lineTo(gx - 12, h);
      ctx.stroke();
    }

    const droneAlive = cycle < 105;
    const droneX = 125;
    const droneY = 68 + Math.sin(s.tick * 0.1) * 4;

    let ninjaX = 35;
    let pose = 'run';
    if (cycle >= 75 && cycle < 105) {
      ninjaX = 35 + (cycle - 75) * 3;
      pose = 'slash';
      if (this.crossed(prevCycle, cycle, 85)) this.addSparks(s.sparks, 80, 80, '#a855f7');
      if (this.crossed(prevCycle, cycle, 104)) this.addSparks(s.sparks, droneX, droneY, '#f43f5e');
    } else if (cycle >= 105) {
      ninjaX = 115;
      pose = 'sheath';
    }

    if (this.isSheetReady('chrono')) {
      if (droneAlive) {
        this.drawCell(ctx, 'chrono', cycle >= 30 && cycle < 65 ? 1 : 0, 1, droneX, droneY, 36, 36, 0, true, 1);
        if (cycle >= 30 && cycle < 85) {
          const bulletProgress = (cycle - 30) / 55;
          const bx = droneX - bulletProgress * 70;
          const by = droneY + (90 - droneY) * bulletProgress * 0.5;
          this.drawCell(ctx, 'chrono', 2, 3, bx, by, 18, 18, Math.PI, false, 1);
        }
      } else {
        this.drawCell(ctx, 'chrono', 5, 1, droneX, droneY + 6, 36, 36, 0, false, 1);
      }
      const nCol = pose === 'slash' ? 3 : pose === 'sheath' ? 0 : (Math.floor(s.tick * 0.4) % 2 === 0 ? 1 : 2);
      this.drawCell(ctx, 'chrono', nCol, 0, ninjaX, 73, 44, 44, 0, false, 1);
      if (pose === 'slash') {
        this.drawCell(ctx, 'chrono', 0, 3, ninjaX + 16, 70, 38, 38, 0, false, 0.95);
      }
      this.renderSparks(ctx, s.sparks);
      if (s.bulletTime) {
        ctx.fillStyle = '#a855f7';
        ctx.font = '8px monospace';
        ctx.fillText('BULLET-TIME', 8, 18);
      }
    }
  },

  renderMechaSiege(ctx, w, h, dt) {
    const s = this.states.mecha_siege;
    s.tick += dt * 0.055;

    ctx.fillStyle = '#100c06';
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = '#1e1408';
    ctx.beginPath();
    ctx.moveTo(w, 55);
    ctx.lineTo(w, 95);
    ctx.lineTo(35, 95);
    ctx.lineTo(35, 55);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#3d260c';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#1a1d26';
    ctx.fillRect(0, 35, 34, 75);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 35, 34, 75);

    const teslaX = 18;
    const teslaY = 50;
    const gatlingX = 18;
    const gatlingY = 85;
    const cycle = Math.floor(s.tick) % 140;
    const walkerX = 150 - cycle * 0.85;
    const walkerAlive = cycle < 110;

    if (this.isSheetReady('mecha')) {
      this.drawCell(ctx, 'mecha', 3, 0, teslaX, teslaY, 30, 30, 0, false, 1);
      const walkerY = 72;
      const angleToWalker = Math.atan2(walkerY - gatlingY, walkerX - gatlingX);
      this.drawCell(ctx, 'mecha', 0, 0, gatlingX, gatlingY, 30, 30, walkerAlive ? angleToWalker : 0, false, 1);
      if (walkerAlive) {
        this.drawCell(ctx, 'mecha', 1, 1, walkerX, walkerY, 38, 38, Math.PI, false, 1);
        if (Math.floor(s.tick) % 4 === 0) {
          this.drawCell(ctx, 'mecha', 4, 3, gatlingX + 14, gatlingY, 18, 18, angleToWalker, false, 0.95);
        }
        if (cycle > 45 && cycle < 75) {
          ctx.strokeStyle = '#00f3ff';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(teslaX, teslaY);
          ctx.lineTo((teslaX + walkerX) * 0.5, (teslaY + walkerY) * 0.5 + (Math.random() - 0.5) * 10);
          ctx.lineTo(walkerX, walkerY);
          ctx.stroke();
        }
      } else {
        this.drawCell(ctx, 'mecha', 0, 3, walkerX, 72, 40, 40, 0, false, Math.max(0, 1 - (cycle - 110) / 30));
      }
      ctx.fillStyle = '#f59e0b';
      ctx.font = '8px monospace';
      ctx.fillText('WAVE 04 // 60FPS', 10, 18);
    }
  },

  renderWormsArmageddon(ctx, w, h, dt) {
    const s = this.states.worms_armageddon;
    const prevCycle = Math.floor(s.tick) % 240;
    s.tick += dt * 0.05;
    const cycle = Math.floor(s.tick) % 240;

    const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
    skyGrad.addColorStop(0, '#0a1628');
    skyGrad.addColorStop(0.6, '#1e293b');
    skyGrad.addColorStop(1, '#0f172a');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
    const c1x = (s.tick * 0.4) % (w + 40) - 20;
    const c2x = (s.tick * 0.25 + 90) % (w + 40) - 20;
    ctx.beginPath();
    ctx.arc(c1x, 22, 10, 0, Math.PI * 2);
    ctx.arc(c1x + 10, 18, 12, 0, Math.PI * 2);
    ctx.arc(c1x + 20, 22, 9, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(c2x, 34, 8, 0, Math.PI * 2);
    ctx.arc(c2x + 8, 30, 10, 0, Math.PI * 2);
    ctx.arc(c2x + 16, 34, 7, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.moveTo(0, h);
    ctx.lineTo(0, 88);
    ctx.bezierCurveTo(20, 84, 40, 80, 68, 92);
    ctx.lineTo(72, h);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, 88);
    ctx.bezierCurveTo(20, 84, 40, 80, 68, 92);
    ctx.stroke();

    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.moveTo(76, h);
    ctx.bezierCurveTo(90, 88, 115, 78, 160, 84);
    ctx.lineTo(160, h);
    ctx.closePath();
    ctx.fill();

    if (cycle >= 120 && cycle < 235) {
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(118, 83, 14, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(76, 94);
    ctx.bezierCurveTo(90, 88, 115, 78, 160, 84);
    ctx.stroke();
    ctx.restore();

    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.moveTo(0, h);
    for (let x = 0; x <= w; x += 10) {
      const wy = 114 + Math.sin((x + s.tick * 3) * 0.08) * 3;
      ctx.lineTo(x, wy);
    }
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fill();

    const w1x = 38;
    let w1y = 75;
    let w1Rot = 0;
    if (cycle >= 180 && cycle < 240) {
      const flipProg = (cycle - 180) / 60;
      w1y -= Math.sin(flipProg * Math.PI) * 14;
      w1Rot = flipProg * Math.PI * 2;
    }

    if (this.isSheetReady('worms')) {
      this.drawSpriteRect(ctx, 'worms', cycle >= 55 && cycle <= 70 ? WORMS_RECTS.wormFire : WORMS_RECTS.wormBazooka, w1x, w1y, 34, 34, w1Rot, false, 1);
    }

    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(w1x - 12, w1y - 22, 24, 7);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(w1x - 11, w1y - 21, 22, 5);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 5px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('100', w1x, w1y - 17);

    let w2x = 122;
    let w2y = 73;
    let w2Hp = 100;
    let w2Shake = 0;
    if (cycle >= 120 && cycle < 180) {
      const hitProg = (cycle - 120) / 60;
      w2x += Math.sin(hitProg * Math.PI) * 6;
      w2y -= Math.sin(hitProg * Math.PI) * 10;
      w2Shake = (Math.random() - 0.5) * 4;
      w2Hp = 55;
    } else if (cycle >= 180) {
      w2Hp = 55;
    }

    if (this.isSheetReady('worms')) {
      this.drawSpriteRect(ctx, 'worms', WORMS_RECTS.wormIdle, w2x + w2Shake, w2y, 32, 32, 0, true, 1);
    }

    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(w2x - 12, w2y - 20, 24, 7);
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(w2x - 11, w2y - 19, (w2Hp / 100) * 22, 5);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`${w2Hp}`, w2x, w2y - 15);

    if (cycle >= 60 && cycle < 120) {
      const t = (cycle - 60) / 60;
      const rx = 44 + t * 74;
      const ry = 77 - Math.sin(t * Math.PI) * 48 + t * 4;
      const dx = 74;
      const dy = -Math.cos(t * Math.PI) * 48 * Math.PI + 4;
      this.drawSpriteRect(ctx, 'worms', WORMS_RECTS.rocket, rx, ry, 18, 12, Math.atan2(dy, dx), false, 1);
      if (Math.random() < 0.55) s.smoke.push({ x: rx - 3, y: ry, r: 2, alpha: 0.75 });
    }

    for (let i = s.smoke.length - 1; i >= 0; i--) {
      const sm = s.smoke[i];
      sm.r += 0.15;
      sm.alpha -= 0.03;
      if (sm.alpha <= 0) { s.smoke.splice(i, 1); continue; }
      ctx.fillStyle = `rgba(226, 232, 240, ${sm.alpha})`;
      ctx.beginPath();
      ctx.arc(sm.x, sm.y, sm.r, 0, Math.PI * 2);
      ctx.fill();
    }

    if (cycle >= 120 && cycle < 155) {
      const expProg = (cycle - 120) / 35;
      const size = 28 + Math.sin(expProg * Math.PI) * 20;
      this.drawSpriteRect(ctx, 'worms', WORMS_RECTS.explosion, 118, 78, size, size, 0, false, 1 - expProg * 0.4);
      if (this.crossed(prevCycle, cycle, 121)) {
        for (let k = 0; k < 10; k++) {
          const a = -Math.PI * 0.1 - Math.random() * Math.PI * 0.8;
          const spd = 1.5 + Math.random() * 3;
          s.particles.push({ x: 118, y: 80, vx: Math.cos(a) * spd, vy: Math.sin(a) * spd, life: 1.0, color: Math.random() > 0.5 ? '#78350f' : '#f59e0b' });
        }
      }
    }

    for (let i = s.particles.length - 1; i >= 0; i--) {
      const p = s.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.12;
      p.life -= 0.035;
      if (p.life <= 0) { s.particles.splice(i, 1); continue; }
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.life;
      ctx.fillRect(p.x - 1, p.y - 1, 2, 2);
      ctx.globalAlpha = 1.0;
    }

    if (cycle >= 122 && cycle < 170) {
      const dtProg = (cycle - 122) / 48;
      ctx.fillStyle = '#fef08a';
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 1.5;
      ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'center';
      const ty = 66 - dtProg * 14;
      ctx.strokeText('-45!', 124, ty);
      ctx.fillText('-45!', 124, ty);
    }

    ctx.fillStyle = 'rgba(15, 23, 42, 0.78)';
    ctx.beginPath();
    ctx.roundRect(5, 5, 42, 13, 3);
    ctx.fill();
    ctx.fillStyle = '#22c55e';
    ctx.font = 'bold 6px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('BAZOOKA', 8, 14);

    ctx.fillStyle = 'rgba(15, 23, 42, 0.78)';
    ctx.beginPath();
    ctx.roundRect(110, 5, 45, 13, 3);
    ctx.fill();
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 6px monospace';
    ctx.textAlign = 'right';
    ctx.fillText('WIND ->', 151, 14);
  },

  renderCosmoJunk(ctx, w, h, dt) {
    const s = this.states.cosmo_junk;
    s.tick += dt * 0.05;
    const t = s.tick;
    const k = Math.min(2.5, dt / 16);

    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, '#050b1c');
    sky.addColorStop(0.55, '#0a1c3c');
    sky.addColorStop(1, '#040814');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    s.stars.forEach((st) => {
      st.y += st.z * 0.9 * k;
      if (st.y > h) {
        st.y = -2;
        st.x = (st.x * 1.73 + 19) % w;
      }
      ctx.fillStyle = st.s === 2 ? 'rgba(191, 230, 255, 0.95)' : 'rgba(125, 211, 252, 0.5)';
      ctx.fillRect(st.x, st.y, st.s, st.s);
    });

    if (this.isSheetReady('cosmo')) {
      s.debris.forEach((d, idx) => {
        d.y += d.vy * k;
        d.spin += 0.02 * k;
        if (d.y - d.r > h) {
          d.y = -d.r - 4;
          d.x = 12 + Math.random() * (w - 24);
        }
        this.drawCell(ctx, 'cosmo', idx % 3, 1, d.x, d.y, d.r * 3.2, d.r * 3.2, d.spin, false, 1);
      });
      const shipX2 = 42 + Math.sin(t * 0.5) * 8;
      const shipY2 = 72 + Math.cos(t * 0.9) * 10;
      this.drawCell(ctx, 'cosmo', 1, 0, shipX2, shipY2, 56, 56, 0, false, 1);
      const pirX = 122 + Math.cos(t * 0.7) * 10;
      const pirY = 54 + Math.sin(t * 1.1) * 12;
      this.drawCell(ctx, 'cosmo', 2, 0, pirX, pirY, 42, 42, 0, true, 1);
      const bx = (t * 45) % 70;
      this.drawCell(ctx, 'cosmo', 5, 0, pirX - bx, pirY, 18, 18, 0, true, 0.95);
    }

    const blink = Math.sin(t * 3) > -0.2;
    ctx.fillStyle = 'rgba(6, 14, 28, 0.72)';
    ctx.beginPath();
    ctx.roundRect(5, 5, 54, 13, 3);
    ctx.fill();
    if (blink) {
      ctx.fillStyle = '#3bff8f';
      ctx.fillRect(8, 9, 4, 4);
    }
    ctx.fillStyle = '#7dd3fc';
    ctx.font = 'bold 6px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('ONLINE', 15, 14);

    ctx.fillStyle = 'rgba(6, 14, 28, 0.72)';
    ctx.beginPath();
    ctx.roundRect(108, 5, 47, 13, 3);
    ctx.fill();
    ctx.fillStyle = '#93c5fd';
    ctx.font = 'bold 6px monospace';
    ctx.textAlign = 'right';
    ctx.fillText('ROOM 6F2A', 151, 14);
  },

  addSparks(arr, x, y, color, count = 5) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 2.5;
      arr.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, color, life: 1.0 });
    }
  },

  renderSparks(ctx, arr) {
    for (let i = arr.length - 1; i >= 0; i--) {
      const p = arr[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.05;
      if (p.life <= 0) {
        arr.splice(i, 1);
        continue;
      }
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.life;
      ctx.fillRect(p.x - 1, p.y - 1, 2.5, 2.5);
      ctx.globalAlpha = 1.0;
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  Previews.init();
});
