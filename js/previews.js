/**
 * NEO-CARTRIDGE // Live Gameplay Previews Engine
 * Renders procedural 60 FPS 16-bit gameplay loops for each cartridge in the slider
 */

const Previews = {
  isRunning: false,
  animationId: null,
  canvases: {},
  contexts: {},
  states: {},
  heroCanvas: null,
  heroCtx: null,
  sheets: {},

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
      img.src = sheetMap[k];
      this.sheets[k] = img;
    });

    ['stick_fighting', 'pixel_drift', 'chrono_blade', 'mecha_siege', 'worms_armageddon', 'cosmo_junk'].forEach((gameId, idx) => {
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

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    let lastTime = performance.now();

    const loop = (currentTime) => {
      if (!this.isRunning) return;
      const dt = Math.min(32, currentTime - lastTime);
      lastTime = currentTime;

      this.updateAndRender(dt);
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
    if (!this.isRunning) {
      this.start();
    }
  },

  initGameState(gameId) {
    if (gameId === 'stick_fighting') {
      this.states.stick_fighting = {
        tick: 0,
        p1: { x: 45, y: 88, state: 'idle', hp: 100 },
        p2: { x: 105, y: 88, state: 'idle', hp: 100 },
        sparks: [],
        combo: 0
      };
    } else if (gameId === 'pixel_drift') {
      this.states.pixel_drift = {
        tick: 0,
        carX: 80,
        carY: 65,
        angle: 0,
        speed: 3.2,
        driftScore: 240,
        particles: [],
        skidmarks: []
      };
    } else if (gameId === 'chrono_blade') {
      this.states.chrono_blade = {
        tick: 0,
        ninjaX: 42,
        ninjaY: 88,
        droneX: 130,
        droneY: 65,
        droneHp: 100,
        bullet: null,
        bulletTime: false,
        slashArc: 0,
        sparks: [],
        afterimages: []
      };
    } else if (gameId === 'mecha_siege') {
      this.states.mecha_siege = {
        tick: 0,
        walkerX: 145,
        walkerHp: 100,
        teslaCharge: 0,
        teslaZap: null,
        gatlingAngle: 0,
        bullets: [],
        particles: [],
        baseHp: 100
      };
    } else if (gameId === 'worms_armageddon') {
      this.states.worms_armageddon = {
        tick: 0,
        w1Hp: 100,
        w2Hp: 100,
        smoke: [],
        particles: []
      };
    } else if (gameId === 'cosmo_junk') {
      const stars = [];
      for (let i = 0; i < 52; i++) {
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
      this.states.cosmo_junk = {
        tick: 0,
        stars: stars,
        debris: debris,
        shipX: 80,
        bullets: [],
        particles: [],
        shotTimer: 0
      };
    }
  },

  updateAndRender(dt) {
    const games = ['stick_fighting', 'pixel_drift', 'chrono_blade', 'mecha_siege', 'worms_armageddon', 'cosmo_junk'];
    games.forEach((gameId) => {
      const ctx = this.contexts[gameId];
      if (!ctx) return;
      const w = 160;
      const h = 130;

      if (gameId === 'stick_fighting') this.renderStickFighting(ctx, w, h, dt);
      else if (gameId === 'pixel_drift') this.renderPixelDrift(ctx, w, h, dt);
      else if (gameId === 'chrono_blade') this.renderChronoBlade(ctx, w, h, dt);
      else if (gameId === 'mecha_siege') this.renderMechaSiege(ctx, w, h, dt);
      else if (gameId === 'worms_armageddon') this.renderWormsArmageddon(ctx, w, h, dt);
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

    // Sleek dark radial backdrop
    const grad = ctx.createLinearGradient(0, 0, w, h);
    const palettes = {
      stick_fighting: ['#1f0710', '#0b1326', '#ff3b5c'],
      pixel_drift: ['#041a24', '#0e1328', '#06b6d4'],
      chrono_blade: ['#17072b', '#081526', '#a855f7'],
      mecha_siege: ['#221305', '#101420', '#f59e0b'],
      worms_armageddon: ['#052115', '#0b1829', '#10b981'],
      cosmo_junk: ['#06132b', '#130b29', '#3b82f6']
    };
    const pal = palettes[active] || palettes.stick_fighting;
    grad.addColorStop(0, pal[0]);
    grad.addColorStop(1, pal[1]);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Subtle animated grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.045)';
    ctx.lineWidth = 1;
    const gxOff = (t * 18) % 24;
    for (let x = -gxOff; x < w; x += 24) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 0; y < h; y += 24) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    // Glowing floor horizon
    const glow = ctx.createRadialGradient(w * 0.72, h * 0.55, 6, w * 0.72, h * 0.55, 110);
    glow.addColorStop(0, pal[2] + '55');
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);

    const bob = Math.sin(t * 2.2) * 3;
    if (active === 'stick_fighting') {
      this.drawCell(ctx, 'stickVfx', 1, 2, w * 0.52, h * 0.52, 54, 54, 0, false, 0.85);
      this.drawCell(ctx, 'stick', Math.floor(t * 3) % 4, 2, w * 0.68, h * 0.56 + bob, 86, 86, 0, false, 1);
      this.drawCell(ctx, 'stick', 4, 2, w * 0.86, h * 0.54 - bob, 84, 84, 0, true, 1);
    } else if (active === 'pixel_drift') {
      this.drawCell(ctx, 'drift', 0, 1, w * 0.50, h * 0.65, 58, 58, 0, false, 0.9);
      this.drawCell(ctx, 'drift', 2, 1, w * 0.61, h * 0.55 + bob, 40, 40, 0, false, 0.95);
      this.drawCell(ctx, 'drift', 2, 0, w * 0.73, h * 0.55 + bob, 92, 92, -0.08, false, 1);
      this.drawCell(ctx, 'drift', 4, 0, w * 0.89, h * 0.62 - bob, 82, 82, -0.12, false, 0.95);
    } else if (active === 'chrono_blade') {
      this.drawCell(ctx, 'chrono', 3, 0, w * 0.62, h * 0.56 + bob, 86, 86, 0, false, 1);
      this.drawCell(ctx, 'chrono', 0, 3, w * 0.74, h * 0.54 + bob, 72, 72, 0, false, 0.95);
      this.drawCell(ctx, 'chrono', 0, 2, w * 0.88, h * 0.56 - bob, 88, 88, 0, true, 1);
    } else if (active === 'mecha_siege') {
      this.drawCell(ctx, 'mecha', 5, 0, w * 0.54, h * 0.56, 74, 74, t * 0.4, false, 0.95);
      this.drawCell(ctx, 'mecha', 0, 0, w * 0.70, h * 0.56 + bob, 74, 74, 0, false, 1);
      this.drawCell(ctx, 'mecha', 2, 2, w * 0.88, h * 0.56 - bob, 86, 86, Math.PI, false, 1);
    } else if (active === 'worms_armageddon') {
      this.drawCell(ctx, 'worms', 0, 0, w * 0.65, h * 0.56 + bob, 78, 78, 0, false, 1);
      this.drawCell(ctx, 'worms', 2, 1, w * 0.85, h * 0.56 - bob, 78, 78, 0, true, 1);
    } else if (active === 'cosmo_junk') {
      this.drawCell(ctx, 'cosmo', 4, 0, w * 0.53, h * 0.55, 76, 76, 0, false, 0.9);
      this.drawCell(ctx, 'cosmo', 1, 0, w * 0.72, h * 0.54 + bob, 92, 92, 0, false, 1);
      this.drawCell(ctx, 'cosmo', 2, 0, w * 0.90, h * 0.56 - bob, 72, 72, 0, false, 1);
    }
  },

  // =========================================================================
  // 1. STICK FIGHTING GAMEPLAY LOOP
  // =========================================================================
  renderStickFighting(ctx, w, h, dt) {
    const s = this.states.stick_fighting;
    s.tick += dt * 0.06;

    // Background Arena
    ctx.fillStyle = '#060a12';
    ctx.fillRect(0, 0, w, h);

    // Distant dojo pillars / neon glow
    ctx.fillStyle = '#0d1527';
    ctx.fillRect(15, 20, 12, 70);
    ctx.fillRect(133, 20, 12, 70);
    ctx.fillStyle = 'rgba(0, 243, 255, 0.08)';
    ctx.beginPath();
    ctx.arc(80, 45, 30, 0, Math.PI * 2);
    ctx.fill();

    // Floor Platform
    ctx.fillStyle = '#161e30';
    ctx.fillRect(0, 92, w, h - 92);
    ctx.fillStyle = '#00f3ff';
    ctx.fillRect(0, 92, w, 2);

    // Mini Healthbars
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(10, 8, 55, 6);
    ctx.fillRect(95, 8, 55, 6);
    ctx.fillStyle = '#00f3ff';
    ctx.fillRect(11, 9, (s.p1.hp / 100) * 53, 4);
    ctx.fillStyle = '#ff0055';
    ctx.fillRect(96, 9, (s.p2.hp / 100) * 53, 4);

    // Combat Loop Cycle (0 .. 200)
    const cycle = Math.floor(s.tick) % 200;

    let p1Pose = 'idle';
    let p2Pose = 'idle';
    let p1X = 45;
    let p2X = 110;

    if (cycle < 40) {
      // P1 approaches
      p1X = 45 + (cycle / 40) * 25;
      p1Pose = (Math.floor(cycle / 5) % 2 === 0) ? 'walk1' : 'walk2';
    } else if (cycle < 60) {
      // P1 Punch combo
      p1X = 70;
      p1Pose = 'punch';
      p2Pose = 'flinch';
      if (cycle === 41) {
        s.p2.hp = Math.max(20, s.p2.hp - 12);
        this.addSparks(s.sparks, 95, 78, '#ffcc00');
        s.combo = 2;
      }
    } else if (cycle < 95) {
      // P1 High Kick
      p1X = 72;
      p1Pose = 'kick';
      p2Pose = 'flinch';
      if (cycle === 62) {
        s.p2.hp = Math.max(10, s.p2.hp - 18);
        this.addSparks(s.sparks, 98, 72, '#00f3ff');
        s.combo = 3;
      }
    } else if (cycle < 135) {
      // P2 Counter attack!
      p1X = 68;
      p2X = 100;
      p1Pose = 'block';
      p2Pose = 'punch';
      if (cycle === 100) {
        this.addSparks(s.sparks, 82, 80, '#00f3ff');
      }
    } else if (cycle < 170) {
      // P1 Sweep kick & Knockdown
      p1Pose = 'sweep';
      p2Pose = 'fall';
      p2X = 112;
      if (cycle === 138) {
        this.addSparks(s.sparks, 100, 90, '#ff0055');
      }
    } else {
      // Reset
      p1X = 45;
      p2X = 110;
      s.p1.hp = 100;
      s.p2.hp = 100;
      s.combo = 0;
    }

    // Draw P1 (Cyan Fighter) & P2 (Red Fighter) with Worms-style sprites if ready
    if (this.isSheetReady('stick')) {
      const p1Col = p1Pose === 'punch' ? 0 : p1Pose === 'kick' ? 2 : p1Pose === 'sweep' ? 3 : p1Pose === 'block' ? 5 : (Math.floor(s.tick * 0.3) % 4);
      const p1Row = (p1Pose === 'punch' || p1Pose === 'kick' || p1Pose === 'sweep' || p1Pose === 'block') ? 2 : 1;
      const p2Col = p2Pose === 'punch' ? 1 : p2Pose === 'flinch' ? 0 : p2Pose === 'fall' ? 2 : 0;
      const p2Row = p2Pose === 'punch' ? 2 : (p2Pose === 'flinch' || p2Pose === 'fall') ? 3 : 0;
      this.drawCell(ctx, 'stick', p1Col, p1Row, p1X, 72, 46, 46, 0, false, 1);
      this.drawCell(ctx, 'stick', p2Col, p2Row, p2X, 72, 46, 46, 0, true, 1);
    }

    // Render Sparks
    this.renderSparks(ctx, s.sparks);

    // Combo text
    if (s.combo > 0 && cycle >= 41 && cycle < 120) {
      ctx.fillStyle = '#ffcc00';
      ctx.font = '8px monospace';
      ctx.fillText(`${s.combo}x COMBO!`, 65, 35);
    }
  },

  // =========================================================================
  // 2. PIXEL DRIFT GAMEPLAY LOOP
  // =========================================================================
  renderPixelDrift(ctx, w, h, dt) {
    const s = this.states.pixel_drift;
    s.tick += dt * 0.05;

    // Grass / background
    ctx.fillStyle = '#061214';
    ctx.fillRect(0, 0, w, h);

    // Track path: oval racetrack
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 36;
    ctx.beginPath();
    ctx.ellipse(80, 65, 52, 36, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Track Neon Borders
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(80, 65, 70, 54, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(80, 65, 34, 18, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Road dashed centerline
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 6]);
    ctx.beginPath();
    ctx.ellipse(80, 65, 52, 36, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Car position on oval
    const t = s.tick * 0.45;
    const roadX = 80 + Math.cos(t) * 52;
    const roadY = 65 + Math.sin(t) * 36;

    // Tangent angle
    const tangent = Math.atan2(Math.cos(t) * 36, -Math.sin(t) * 52) + Math.PI;
    // Drift angle offset
    const driftAngle = tangent + 0.55;

    // Add skidmarks
    if (Math.floor(s.tick) % 2 === 0) {
      s.skidmarks.push({ x: roadX, y: roadY, alpha: 0.6 });
      if (s.skidmarks.length > 25) s.skidmarks.shift();
    }

    // Render skidmarks
    s.skidmarks.forEach(sm => {
      ctx.fillStyle = `rgba(15, 23, 42, ${sm.alpha})`;
      ctx.fillRect(sm.x - 2, sm.y - 2, 4, 4);
      sm.alpha *= 0.96;
    });

    // Add tire smoke particles
    if (Math.random() < 0.6) {
      s.particles.push({
        x: roadX - Math.cos(driftAngle) * 6 + (Math.random() - 0.5) * 4,
        y: roadY - Math.sin(driftAngle) * 6 + (Math.random() - 0.5) * 4,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: 2 + Math.random() * 2.5,
        alpha: 0.8
      });
    }

    // Update & draw smoke particles
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

    // Draw Drift Car (Worms-style sprite)
    if (this.isSheetReady('drift')) {
      this.drawCell(ctx, 'drift', 2, 0, roadX, roadY, 34, 34, driftAngle, false, 1);
      const t2 = t - 1.35;
      const r2X = 80 + Math.cos(t2) * 52;
      const r2Y = 65 + Math.sin(t2) * 36;
      const tan2 = Math.atan2(Math.cos(t2) * 36, -Math.sin(t2) * 52) + Math.PI + 0.4;
      this.drawCell(ctx, 'drift', 4, 0, r2X, r2Y, 32, 32, tan2, false, 1);
    }

    // HUD: Drift Score
    ctx.fillStyle = '#38bdf8';
    ctx.font = '8px monospace';
    ctx.fillText(`DRIFT +${Math.floor(s.tick * 15) % 800 + 200}`, 10, 18);
  },

  // =========================================================================
  // 3. CHRONO BLADE GAMEPLAY LOOP
  // =========================================================================
  renderChronoBlade(ctx, w, h, dt) {
    const s = this.states.chrono_blade;
    s.tick += dt * 0.055;

    // Cyber background
    ctx.fillStyle = s.bulletTime ? '#130424' : '#0a0512';
    ctx.fillRect(0, 0, w, h);

    // Scrolling floor grid
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

    const cycle = Math.floor(s.tick) % 180;

    // Bullet-Time toggle
    if (cycle > 55 && cycle < 115) {
      s.bulletTime = true;
    } else {
      s.bulletTime = false;
    }

    // Drone enemy
    const droneAlive = cycle < 105;
    const droneX = 125;
    const droneY = 68 + Math.sin(s.tick * 0.1) * 4;

    // Ninja actions (computed before chrono sprite render)
    let ninjaX = 35;
    let pose = 'run';
    if (cycle >= 75 && cycle < 105) {
      ninjaX = 35 + (cycle - 75) * 3;
      pose = 'slash';
      if (cycle === 85) {
        this.addSparks(s.sparks, 80, 80, '#a855f7');
      }
      if (cycle === 104) {
        this.addSparks(s.sparks, droneX, droneY, '#f43f5e');
      }
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

  // =========================================================================
  // 4. MECHA SIEGE GAMEPLAY LOOP (Match user image!)
  // =========================================================================
  renderMechaSiege(ctx, w, h, dt) {
    const s = this.states.mecha_siege;
    s.tick += dt * 0.055;

    // Wasteland terrain
    ctx.fillStyle = '#100c06';
    ctx.fillRect(0, 0, w, h);

    // Dirt road path from right to left
    ctx.fillStyle = '#1e1408';
    ctx.beginPath();
    ctx.moveTo(w, 55);
    ctx.lineTo(w, 95);
    ctx.lineTo(35, 95);
    ctx.lineTo(35, 55);
    ctx.closePath();
    ctx.fill();

    // Road borders
    ctx.strokeStyle = '#3d260c';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Base bunker on left
    ctx.fillStyle = '#1a1d26';
    ctx.fillRect(0, 35, 34, 75);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 35, 34, 75);

    // --- 1. Tesla Coil Turret on Base (Top) ---
    const teslaX = 18;
    const teslaY = 50;
    // Turret Base
    ctx.fillStyle = '#262d3d';
    ctx.beginPath();
    ctx.arc(teslaX, teslaY, 7, 0, Math.PI * 2);
    ctx.fill();
    // Glowing Blue Tesla Coil
    s.teslaCharge = (s.teslaCharge + 0.08) % 1;
    ctx.fillStyle = '#06b6d4';
    ctx.beginPath();
    ctx.arc(teslaX, teslaY, 4 + Math.sin(s.tick * 0.3) * 1, 0, Math.PI * 2);
    ctx.fill();

    // --- 2. Gatling Turret on Base (Bottom) ---
    const gatlingX = 18;
    const gatlingY = 85;
    ctx.fillStyle = '#262d3d';
    ctx.beginPath();
    ctx.arc(gatlingX, gatlingY, 7, 0, Math.PI * 2);
    ctx.fill();

    // --- 3. Mech Walker (Matches the Robot Icon from User's Screenshot!) ---
    const cycle = Math.floor(s.tick) % 140;
    let walkerX = 150 - cycle * 0.85;
    let walkerAlive = cycle < 110;

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

  // =========================================================================
  // 5. WORMS ARMAGEDDON GAMEPLAY LOOP
  // =========================================================================
  renderWormsArmageddon(ctx, w, h, dt) {
    const s = this.states.worms_armageddon;
    s.tick += dt * 0.05;

    // 1. Sky Gradient (Atmospheric Twilight Blue)
    const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
    skyGrad.addColorStop(0, '#0a1628');
    skyGrad.addColorStop(0.6, '#1e293b');
    skyGrad.addColorStop(1, '#0f172a');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, h);

    // Drifting Fluffy Pixel Clouds
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

    // Loop cycle: 240 frames total
    const cycle = Math.floor(s.tick) % 240;

    // 2. Destructible Rolling Hills (Two Islets with Water in Between)
    // Left Island (Worm 1)
    ctx.save();
    ctx.fillStyle = '#78350f'; // Rich earth brown
    ctx.beginPath();
    ctx.moveTo(0, h);
    ctx.lineTo(0, 88);
    ctx.bezierCurveTo(20, 84, 40, 80, 68, 92);
    ctx.lineTo(72, h);
    ctx.closePath();
    ctx.fill();

    // Grass Top on Left Island
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, 88);
    ctx.bezierCurveTo(20, 84, 40, 80, 68, 92);
    ctx.stroke();

    // Right Island (Worm 2)
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.moveTo(76, h);
    ctx.bezierCurveTo(90, 88, 115, 78, 160, 84);
    ctx.lineTo(160, h);
    ctx.closePath();
    ctx.fill();

    // If in explosion/crater phase (cycle > 120), carve visible crater
    if (cycle >= 120 && cycle < 235) {
      ctx.fillStyle = '#1e293b'; // Crater cavity
      ctx.beginPath();
      ctx.arc(118, 83, 14, 0, Math.PI * 2);
      ctx.fill();
    }

    // Grass Top on Right Island
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(76, 94);
    ctx.bezierCurveTo(90, 88, 115, 78, 160, 84);
    ctx.stroke();
    ctx.restore();

    // 3. Water at Bottom with Sinusoidal Waves
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

    // Water foam crest
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let x = 0; x <= w; x += 10) {
      const wy = 114 + Math.sin((x + s.tick * 3) * 0.08) * 3;
      if (x === 0) ctx.moveTo(x, wy); else ctx.lineTo(x, wy);
    }
    ctx.stroke();

    // 4. Worm 1 (Red Team, Left)
    let w1x = 38;
    let w1y = 80;
    let w1Backflip = 0;

    if (cycle >= 180 && cycle < 240) {
      // Victory backflip
      const flipProg = (cycle - 180) / 60;
      w1y -= Math.sin(flipProg * Math.PI) * 14;
      w1Backflip = flipProg * Math.PI * 2;
    }

    ctx.save();
    ctx.translate(w1x, w1y);
    ctx.rotate(w1Backflip);

    // Cute pink body (curved bean)
    ctx.fillStyle = '#fb7185';
    ctx.beginPath();
    ctx.ellipse(0, 0, 6, 8, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#be123c';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Red bandana
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(-5, -6, 10, 3);
    // Bandana ribbon knot
    ctx.beginPath();
    ctx.moveTo(-5, -5);
    ctx.lineTo(-8, -3);
    ctx.lineTo(-5, -4);
    ctx.fill();

    // Eyes (cute cartoon)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(2, -4, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(3, -4, 1.2, 0, Math.PI * 2);
    ctx.fill();

    // Bazooka on shoulder (aiming at ~ -35 deg)
    const aimAngle = -0.55 + Math.sin(s.tick * 0.08) * 0.1;
    ctx.save();
    ctx.translate(2, -1);
    ctx.rotate(aimAngle);

    // Bazooka tube
    ctx.fillStyle = '#166534';
    ctx.fillRect(-2, -2.5, 12, 5);
    ctx.fillStyle = '#15803d';
    ctx.fillRect(-2, -2.5, 12, 2);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(8, -3, 2, 6);

    // Muzzle flash when firing (cycle ~ 60)
    if (cycle >= 60 && cycle <= 66) {
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(12, 0, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#f97316';
      ctx.beginPath();
      ctx.arc(14, 0, 3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    ctx.restore();

    // Red Worm Health Pill Tag
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(w1x - 12, w1y - 20, 24, 7);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(w1x - 11, w1y - 19, 22, 5);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 5px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('100', w1x, w1y - 15);

    // Speech bubble on victory
    if (cycle >= 190 && cycle < 235) {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(w1x - 14, w1y - 34, 28, 11, 3);
      ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 6px sans-serif';
      ctx.fillText('YES! ✌️', w1x, w1y - 26);
    }

    // 5. Worm 2 (Blue Team, Right)
    let w2x = 122;
    let w2y = 78;
    let w2Hp = 100;
    let w2Shake = 0;

    if (cycle >= 120 && cycle < 180) {
      // Knockback from rocket impact
      const hitProg = (cycle - 120) / 60;
      w2x += Math.sin(hitProg * Math.PI) * 6;
      w2y -= Math.sin(hitProg * Math.PI) * 10;
      w2Shake = (Math.random() - 0.5) * 4;
      w2Hp = 55;
    } else if (cycle >= 180) {
      w2Hp = 55;
    }

    ctx.save();
    ctx.translate(w2x + w2Shake, w2y);
    ctx.scale(-1, 1); // Flip facing left

    // Blue worm body
    ctx.fillStyle = '#fb7185';
    ctx.beginPath();
    ctx.ellipse(0, 0, 6, 8, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#be123c';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Blue helmet
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.arc(0, -5, 6, Math.PI, 0);
    ctx.fill();

    // Eye
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(2, -3, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(2.8, -3, 1.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // Blue Worm Health Tag
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(w2x - 12, w2y - 18, 24, 7);
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(w2x - 11, w2y - 17, (w2Hp / 100) * 22, 5);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 5px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${w2Hp}`, w2x, w2y - 13);

    // Dizzy stars over Worm 2
    if (cycle >= 125 && cycle < 180) {
      ctx.fillStyle = '#facc15';
      const starAngle = s.tick * 0.2;
      ctx.fillText('★', w2x + Math.cos(starAngle) * 8, w2y - 22 + Math.sin(starAngle) * 3);
      ctx.fillText('★', w2x + Math.cos(starAngle + 3) * 8, w2y - 22 + Math.sin(starAngle + 3) * 3);
    }

    // 6. Projectile & Ballistics (Rocket in flight: cycle 60 .. 120)
    if (cycle >= 60 && cycle < 120) {
      const t = (cycle - 60) / 60;
      const rx = 44 + t * 74;
      const ry = 77 - Math.sin(t * Math.PI) * 48 + t * 4;

      // Rocket body
      ctx.save();
      ctx.translate(rx, ry);
      // Tangent angle
      const dx = 74;
      const dy = -Math.cos(t * Math.PI) * 48 * Math.PI + 4;
      ctx.rotate(Math.atan2(dy, dx));

      // Rocket missile
      ctx.fillStyle = '#ef4444'; // Red warhead
      ctx.beginPath();
      ctx.moveTo(4, 0);
      ctx.lineTo(-2, -2.5);
      ctx.lineTo(-2, 2.5);
      ctx.closePath();
      ctx.fill();

      // Rocket thruster exhaust flame
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.moveTo(-2, -1.5);
      ctx.lineTo(-6, 0);
      ctx.lineTo(-2, 1.5);
      ctx.fill();

      ctx.restore();

      // Smoke puff in state
      if (Math.random() < 0.6) {
        s.smoke.push({ x: rx - 3, y: ry, r: 2, alpha: 0.8 });
      }
    }

    // Render & decay smoke puffs
    for (let i = s.smoke.length - 1; i >= 0; i--) {
      const sm = s.smoke[i];
      sm.r += 0.15;
      sm.alpha -= 0.03;
      if (sm.alpha <= 0) {
        s.smoke.splice(i, 1);
        continue;
      }
      ctx.fillStyle = `rgba(226, 232, 240, ${sm.alpha})`;
      ctx.beginPath();
      ctx.arc(sm.x, sm.y, sm.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // 7. Explosion Impact & Sparks (cycle 120 .. 150)
    if (cycle >= 120 && cycle < 155) {
      const expProg = (cycle - 120) / 35;
      const expR = Math.sin(expProg * Math.PI) * 18;

      // Outer fire shockwave
      ctx.fillStyle = 'rgba(239, 68, 68, 0.4)';
      ctx.beginPath();
      ctx.arc(118, 80, expR * 1.3, 0, Math.PI * 2);
      ctx.fill();

      // Orange explosion fireball
      ctx.fillStyle = '#f97316';
      ctx.beginPath();
      ctx.arc(118, 80, expR, 0, Math.PI * 2);
      ctx.fill();

      // Core white heat
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(118, 80, expR * 0.5, 0, Math.PI * 2);
      ctx.fill();

      // Debris / Dirt flying
      if (cycle === 121) {
        for (let k = 0; k < 12; k++) {
          const a = -Math.PI * 0.1 - Math.random() * Math.PI * 0.8;
          const spd = 1.5 + Math.random() * 3;
          s.particles.push({
            x: 118,
            y: 80,
            vx: Math.cos(a) * spd,
            vy: Math.sin(a) * spd,
            life: 1.0,
            color: Math.random() > 0.5 ? '#78350f' : '#f59e0b'
          });
        }
      }
    }

    // Render Debris Particles
    for (let i = s.particles.length - 1; i >= 0; i--) {
      const p = s.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.12; // Gravity
      p.life -= 0.035;
      if (p.life <= 0) {
        s.particles.splice(i, 1);
        continue;
      }
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.life;
      ctx.fillRect(p.x - 1, p.y - 1, 2, 2);
      ctx.globalAlpha = 1.0;
    }

    // Floating Damage Text "-45!"
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

    // 8. HUD Badges & Wind Indicator
    // Weapon Badge Top-Left
    ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
    ctx.roundRect(5, 5, 42, 13, 3);
    ctx.fill();
    ctx.fillStyle = '#22c55e';
    ctx.font = 'bold 6px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('🚀 BAZOOKA', 8, 14);

    // Wind Meter Top-Right
    ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
    ctx.roundRect(110, 5, 45, 13, 3);
    ctx.fill();
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 6px monospace';
    ctx.textAlign = 'right';
    ctx.fillText('WIND ➔➔', 151, 14);
  },

  // =========================================================================
  // 6. COSMO JUNK — ONLINE SPACE ARENA LOOP
  // =========================================================================
  renderCosmoJunk(ctx, w, h, dt) {
    const s = this.states.cosmo_junk;
    s.tick += dt * 0.05;
    const t = s.tick;
    const k = Math.min(2.5, dt / 16);

    // 1. Deep space backdrop
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, '#050b1c');
    sky.addColorStop(0.55, '#0a1c3c');
    sky.addColorStop(1, '#040814');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    // 2. Nebula glows
    const neb1 = ctx.createRadialGradient(118, 30, 2, 118, 30, 58);
    neb1.addColorStop(0, 'rgba(59, 130, 246, 0.32)');
    neb1.addColorStop(1, 'rgba(59, 130, 246, 0)');
    ctx.fillStyle = neb1;
    ctx.fillRect(0, 0, w, h);

    const neb2 = ctx.createRadialGradient(28, 96, 2, 28, 96, 44);
    neb2.addColorStop(0, 'rgba(168, 85, 247, 0.22)');
    neb2.addColorStop(1, 'rgba(168, 85, 247, 0)');
    ctx.fillStyle = neb2;
    ctx.fillRect(0, 0, w, h);

    // 3. Starfield drift
    s.stars.forEach((st) => {
      st.y += st.z * 0.9 * k;
      if (st.y > h) {
        st.y = -2;
        st.x = (st.x * 1.73 + 19) % w;
      }
      ctx.fillStyle = st.s === 2 ? 'rgba(191, 230, 255, 0.95)' : 'rgba(125, 211, 252, 0.5)';
      ctx.fillRect(st.x, st.y, st.s, st.s);
    });

    // 4. Drifting space junk
    s.debris.forEach((d) => {
      d.y += d.vy * k;
      d.spin += 0.02 * k;
      if (d.y - d.r > h) {
        d.y = -d.r - 4;
        d.x = 12 + Math.random() * (w - 24);
      }
      ctx.save();
      ctx.translate(d.x, d.y);
      ctx.rotate(d.spin);
      ctx.fillStyle = '#334155';
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-d.r, -d.r * 0.6);
      ctx.lineTo(d.r * 0.7, -d.r);
      ctx.lineTo(d.r, d.r * 0.5);
      ctx.lineTo(-d.r * 0.4, d.r);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#475569';
      ctx.fillRect(-1, -1, 3, 3);
      ctx.restore();
    });

    // 4.5. Render Cosmo Junk Worms-style sprite sheet ship, pirate & asteroids
    if (this.isSheetReady('cosmo')) {
      s.debris.forEach((d, idx) => {
        this.drawCell(ctx, 'cosmo', idx % 3, 1, d.x, d.y, d.r * 3.2, d.r * 3.2, d.spin, false, 1);
      });
      const shipX2 = 42 + Math.sin(t * 0.5) * 8;
      const shipY2 = 72 + Math.cos(t * 0.9) * 10;
      this.drawCell(ctx, 'cosmo', 1, 0, shipX2, shipY2, 56, 56, 0, false, 1);
      const pirX = 122 + Math.cos(t * 0.7) * 10;
      const pirY = 54 + Math.sin(t * 1.1) * 12;
      this.drawCell(ctx, 'cosmo', 2, 0, pirX, pirY, 42, 42, 0, false, 1);
      const bx = ((t * 45) % 70);
      this.drawCell(ctx, 'cosmo', 5, 0, pirX - bx, pirY, 18, 18, 0, false, 0.95);
    }

    // HUD
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

  // Helper: add spark particles
  addSparks(arr, x, y, color, count = 5) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 2.5;
      arr.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: color,
        life: 1.0
      });
    }
  },

  // Helper: render and decay sparks
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
