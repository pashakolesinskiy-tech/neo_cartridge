import { PHASES, TEAM_PALETTES, WORLD_H, WORLD_W } from './constants.js';
import { SPRITE_RECTS, sprites } from './sprites.js';
import { WEAPON_MAP } from './weapons.js';

export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.time = 0;
  }

  render(game, dt = 0) {
    this.time += dt;
    const ctx = this.ctx;
    const dpr = window.devicePixelRatio || 1;
    const cssW = this.canvas.clientWidth || window.innerWidth;
    const cssH = this.canvas.clientHeight || window.innerHeight;
    const targetW = Math.round(cssW * dpr);
    const targetH = Math.round(cssH * dpr);

    if (this.canvas.width !== targetW || this.canvas.height !== targetH) {
      this.canvas.width = targetW;
      this.canvas.height = targetH;
      game.camera.resize(cssW, cssH);
    }

    ctx.save();
    ctx.scale(dpr, dpr);

    const theme = game.terrain.theme;
    this._drawSkyAndParallax(ctx, cssW, cssH, theme, game.camera, game.wind);

    // World space transform
    ctx.save();
    ctx.translate(cssW * 0.5 + game.camera.shakeX, cssH * 0.5 + game.camera.shakeY);
    ctx.scale(game.camera.zoom, game.camera.zoom);
    ctx.translate(-game.camera.x, -game.camera.y);

    // Back water layer
    this._drawWaterLayer(ctx, game.waterY, theme, true);

    // Destructible terrain canvas
    if (game.terrain.canvas) {
      ctx.drawImage(game.terrain.canvas, 0, 0);
    }

    // World objects
    for (const g of game.graves) {
      if (g.alive) this._drawGrave(ctx, g);
    }
    for (const m of game.mines) {
      if (m.alive) this._drawMine(ctx, m);
    }
    for (const mag of game.magnets || []) {
      if (mag.alive) this._drawMagnet(ctx, mag);
    }
    for (const b of game.barrels) {
      if (b.alive) this._drawBarrel(ctx, b);
    }
    for (const c of game.crates) {
      if (c.alive) this._drawCrate(ctx, c);
    }

    // Worms + Ninja Rope
    const activeWorm = game.getActiveWorm();
    if (game.phase === PHASES.ROPE && game.ropeState && activeWorm?.alive) {
      this._drawRope(ctx, game.ropeState, activeWorm);
    }
    for (const w of game.worms) {
      if (!w.alive && !w.dying) continue;
      this._drawWorm(ctx, w, w === activeWorm, game);
    }

    // Walkers (Sheep, Super Sheep, Mad Cows)
    for (const wk of game.walkers || []) {
      if (wk.alive) this._drawWalker(ctx, wk);
    }

    // Active airplane (airstrike / napalm)
    if (game.airstrikePlane) {
      this._drawAirplane(ctx, game.airstrikePlane);
    }

    // Projectiles
    for (const p of game.projectiles) {
      if (p.alive) this._drawProjectile(ctx, p);
    }

    // Tracer beams (shotgun / uzi muzzle flashes)
    for (const tr of game.tracers) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, tr.life / tr.maxLife);
      ctx.strokeStyle = tr.color;
      ctx.lineWidth = tr.width;
      ctx.beginPath();
      ctx.moveTo(tr.x0, tr.y0);
      ctx.lineTo(tr.x1, tr.y1);
      ctx.stroke();
      ctx.restore();
    }

    // Targeting previews (girder, airstrike, teleport, homing lock)
    this._drawTargetingOverlay(ctx, game, activeWorm);

    // Particles & Shockwaves
    this._drawParticles(ctx, game.particles);

    // Foreground translucent water
    this._drawWaterLayer(ctx, game.waterY, theme, false);

    // Overhead worm HUD tags & floating popups
    for (const w of game.worms) {
      if (!w.alive) continue;
      this._drawWormBadge(ctx, w, w === activeWorm);
    }
    this._drawPopups(ctx, game.particles);

    ctx.restore();
    ctx.restore();
  }

  _drawSkyAndParallax(ctx, w, h, theme, camera, wind) {
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, theme.skyTop);
    grad.addColorStop(0.58, theme.skyMid);
    grad.addColorStop(1, theme.skyBottom);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Soft clouds drifting gently with wind (single continuous path per cloud)
    ctx.save();
    ctx.fillStyle = theme.cloudColor;
    const windShift = this.time * (8 + wind * 0.22);
    for (let i = 0; i < 8; i++) {
      const cx = ((i * 290 + windShift - camera.x * 0.12) % (w + 320) + (w + 320)) % (w + 320) - 160;
      const cy = 65 + (i % 4) * 52;
      const s = 0.8 + (i % 3) * 0.3;
      ctx.beginPath();
      ctx.moveTo(cx - 48 * s, cy + 16 * s);
      ctx.bezierCurveTo(cx - 68 * s, cy + 16 * s, cx - 68 * s, cy - 10 * s, cx - 36 * s, cy - 10 * s);
      ctx.bezierCurveTo(cx - 28 * s, cy - 30 * s, cx + 18 * s, cy - 32 * s, cx + 28 * s, cy - 12 * s);
      ctx.bezierCurveTo(cx + 62 * s, cy - 14 * s, cx + 68 * s, cy + 16 * s, cx + 46 * s, cy + 16 * s);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();

    // Parallax mountain silhouettes
    const drawRidge = (color, parallax, baseY, amp, freq) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(0, h);
      const offset = camera.x * parallax;
      for (let sx = 0; sx <= w + 40; sx += 40) {
        const wx = sx + offset;
        const y =
          h * baseY -
          Math.abs(Math.sin(wx * freq) * amp + Math.cos(wx * freq * 2.3) * (amp * 0.45));
        ctx.lineTo(sx, y);
      }
      ctx.lineTo(w, h);
      ctx.closePath();
      ctx.fill();
    };

    drawRidge(theme.mountainBack, 0.16, 0.88, 95, 0.0042);
    drawRidge(theme.mountainFront, 0.28, 0.93, 62, 0.0068);
  }

  _drawWaterLayer(ctx, waterY, theme, backLayer) {
    const startX = -300;
    const endX = WORLD_W + 300;
    const bottomY = WORLD_H + 350;
    const amp = backLayer ? 4.5 : 5.5;
    const speed = backLayer ? 2.1 : 3.2;
    const phase = backLayer ? 1.7 : 0;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(startX, bottomY);
    for (let x = startX; x <= endX; x += 24) {
      const y = waterY + (backLayer ? -3 : 2) + Math.sin(x * 0.032 + this.time * speed + phase) * amp;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(endX, bottomY);
    ctx.closePath();

    if (backLayer) {
      ctx.fillStyle = theme.waterDeep;
      ctx.fill();
    } else {
      const grad = ctx.createLinearGradient(0, waterY - 8, 0, waterY + 140);
      grad.addColorStop(0, theme.waterTop);
      grad.addColorStop(1, theme.waterDeep);
      ctx.fillStyle = grad;
      ctx.fill();

      // Foam / glowing lava rim
      ctx.strokeStyle = theme.waterFoam;
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      for (let x = startX; x <= endX; x += 20) {
        const y = waterY + 2 + Math.sin(x * 0.032 + this.time * speed + phase) * amp;
        if (x === startX) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    ctx.restore();
  }

  _drawWorm(ctx, w, isActive, game) {
    const palette = TEAM_PALETTES[w.teamIndex] || TEAM_PALETTES[0];
    const dir = w.facing >= 0 ? 1 : -1;
    const bob = w.grounded ? Math.sin(w.walkCycle) * 1.4 : 0;

    ctx.save();
    ctx.translate(w.x, w.y);

    if (w.dying) {
      ctx.translate((Math.random() - 0.5) * 3, (Math.random() - 0.5) * 2);
    }

    // Soft ground shadow + subtle team ring
    if (w.grounded) {
      ctx.fillStyle = 'rgba(0,0,0,0.34)';
      ctx.beginPath();
      ctx.ellipse(0, 9.5, 11, 3.6, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.strokeStyle = palette.color;
    ctx.lineWidth = 1.6;
    ctx.globalAlpha = 0.72;
    ctx.beginPath();
    ctx.ellipse(0, 9.5, 11.5, 3.8, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Jetpack pack behind worm if active
    if (isActive && game.phase === PHASES.JETPACK) {
      if (!sprites.draw(ctx, 'items', 'jetpack', -dir * 8, -2, 16, 22, 0.5, 0.5)) {
        ctx.fillStyle = '#95a5a6';
        ctx.strokeStyle = '#1e272e';
        ctx.lineWidth = 1.5;
        ctx.fillRect(-dir * 10 - 3, -4, 6, 12);
        ctx.strokeRect(-dir * 10 - 3, -4, 6, 12);
      }
      if (game.jetpackThrusting) {
        ctx.fillStyle = Math.random() < 0.5 ? '#ff9f43' : '#ffeaa7';
        ctx.beginPath();
        ctx.moveTo(-dir * 10 - 3, 8);
        ctx.lineTo(-dir * 10 + 3, 8);
        ctx.lineTo(-dir * 10, 17 + Math.random() * 6);
        ctx.closePath();
        ctx.fill();
      }
    }

    // Worm body + tail curve (sprite if loaded, else vector fallback)
    ctx.save();
    ctx.scale(dir, 1);

    const sx = 1 + (w.landSquash || 0) * 0.75;
    const sy = 1 - (w.landSquash || 0) * 0.65;
    if (!w.grounded && w.jumpKind === 'backflip') {
      const t = Math.min(1, (w.airTime || 0) / 1.05);
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      ctx.rotate(-eased * Math.PI * 2);
    } else if (!w.grounded && w.jumpKind === 'jump') {
      const tilt = Math.max(-0.22, Math.min(0.22, w.vy / 700));
      ctx.rotate(tilt);
    }
    ctx.scale(sx, sy);

    let drewWormSprite = false;
    if (sprites.isReady()) {
      let rect = SPRITE_RECTS.worms.wormIdle[Math.floor(this.time * 4.5 + w.id) % 6];
      let anchorX = 0.5;
      let targetW = 36;
      let targetH = 38;
      if (isActive && game.phase === PHASES.ROPE) {
        rect = SPRITE_RECTS.worms.wormRope;
        anchorX = 0.5;
        targetW = 36;
        targetH = 42;
      } else if (w.fireTimer > 0 && (game.selectedWeaponId === 'bazooka' || game.selectedWeaponId === 'homing')) {
        rect = SPRITE_RECTS.worms.wormFire;
        anchorX = 0.36;
        targetW = 46;
        targetH = 42;
      } else if (!w.grounded) {
        rect = SPRITE_RECTS.worms.wormAir;
      } else if (w.landSquash > 0.08) {
        rect = SPRITE_RECTS.worms.wormLand;
      } else if (w.walkTimer > 0) {
        rect = SPRITE_RECTS.worms.wormWalk[Math.floor(w.walkCycle) % 6];
      }
      if (w.hurtTimer > 0) {
        ctx.globalAlpha = Math.sin(this.time * 45) > 0 ? 0.65 : 1;
      }
      drewWormSprite = sprites.draw(ctx, 'worms', rect, 0, 11, targetW, targetH, anchorX, 0.94);
      ctx.globalAlpha = 1;
    }

    if (!drewWormSprite) {
      // Tail segment
      ctx.fillStyle = '#f3a4af';
      ctx.strokeStyle = '#2d1c22';
      ctx.lineWidth = 1.7;
      ctx.beginPath();
      ctx.ellipse(-6, 5.5 + bob * 0.5, 6.2, 4.4, -0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Main torso & head
      ctx.fillStyle = w.hurtTimer > 0 ? '#ffd0d6' : '#ffb8c2';
      ctx.beginPath();
      ctx.ellipse(0.5, 0.5 + bob, 7.2, 9.2, 0.08, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Team headband
      ctx.fillStyle = palette.color;
      ctx.beginPath();
      ctx.roundRect(-6.5, -5.8 + bob, 13.5, 3.6, 1.5);
      ctx.fill();
      ctx.stroke();

      // Headband tails fluttering behind
      const flutter = Math.sin(this.time * 8 + w.id) * 2.2;
      ctx.beginPath();
      ctx.moveTo(-6, -4.5 + bob);
      ctx.lineTo(-12.5, -7 + flutter + bob);
      ctx.lineTo(-11, -3.2 + flutter + bob);
      ctx.closePath();
      ctx.fill();

      // Eyes
      const aimAngle = w.aimPitch;
      const lookX = Math.cos(aimAngle) * 1.4;
      const lookY = Math.sin(aimAngle) * 1.4;
      const blinking = w.blinkTimer < 0;

      if (w.dying) {
        ctx.strokeStyle = '#1d1d24';
        ctx.lineWidth = 1.6;
        for (const ex of [0.8, 5.2]) {
          ctx.beginPath();
          ctx.moveTo(ex - 1.6, -2.5);
          ctx.lineTo(ex + 1.6, 0.7);
          ctx.moveTo(ex + 1.6, -2.5);
          ctx.lineTo(ex - 1.6, 0.7);
          ctx.stroke();
        }
      } else if (blinking) {
        ctx.strokeStyle = '#1d1d24';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-1, -1 + bob);
        ctx.lineTo(2.4, -1 + bob);
        ctx.moveTo(3.4, -1 + bob);
        ctx.lineTo(6.8, -1 + bob);
        ctx.stroke();
      } else {
        const eyeR = w.panicTimer > 0 || !w.grounded ? 2.6 : 2.2;
        for (const ex of [1.1, 5.1]) {
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(ex, -1.2 + bob, eyeR, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#1d1d24';
          ctx.lineWidth = 0.9;
          ctx.stroke();

          ctx.fillStyle = '#111118';
          ctx.beginPath();
          ctx.arc(ex + lookX * 0.7, -1.2 + bob + lookY * 0.7, 1.05, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    ctx.restore(); // unscale dir

    // Pneumatic drill bit beneath worm during drilling
    if (isActive && game.phase === PHASES.DRILL) {
      ctx.save();
      ctx.translate(0, 8 + Math.sin(this.time * 48) * 2);
      ctx.rotate(Math.PI * 0.5);
      if (!sprites.draw(ctx, 'items', 'drill', 0, 0, 26, 16, 0.5, 0.5)) {
        ctx.fillStyle = '#a4b0be';
        ctx.fillRect(-3, -10, 6, 20);
      }
      ctx.restore();
    }

    // Frozen ice block overlay
    if (w.frozenTurns > 0) {
      ctx.save();
      ctx.globalAlpha = 0.72;
      if (!sprites.draw(ctx, 'items', 'ice', 0, 0, 34, 34, 0.5, 0.5)) {
        ctx.fillStyle = 'rgba(116, 224, 255, 0.55)';
        ctx.strokeStyle = '#dff9fb';
        ctx.lineWidth = 2;
        ctx.fillRect(-13, -15, 26, 28);
        ctx.strokeRect(-13, -15, 26, 28);
      }
      ctx.restore();
    }

    // Poisoned status bubbles
    if (w.poisoned && !w.dying) {
      ctx.save();
      ctx.fillStyle = '#2ed573';
      for (let i = 0; i < 3; i++) {
        const phase = (this.time * 2.2 + i * 0.9 + w.id * 0.4) % 1;
        const bx = Math.sin(phase * 6 + i * 2) * 8;
        const by = -6 - phase * 18;
        ctx.globalAlpha = (1 - phase) * 0.85;
        ctx.beginPath();
        ctx.arc(bx, by, 2.2 + phase * 1.4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // Held weapon sprite during active player turn
    if (
      isActive &&
      (game.phase === PHASES.PLAYER_TURN ||
        game.phase === PHASES.CHARGING ||
        game.phase === PHASES.BLOWTORCH)
    ) {
      if (!(w.fireTimer > 0 && (game.selectedWeaponId === 'bazooka' || game.selectedWeaponId === 'homing'))) {
        this._drawHeldWeapon(ctx, w, game.selectedWeaponId);
      }
    }

    // Aim crosshair + charge meter
    if (isActive && (game.phase === PHASES.PLAYER_TURN || game.phase === PHASES.CHARGING)) {
      const weapon = WEAPON_MAP[game.selectedWeaponId];
      if (weapon && (weapon.targetMode === 'aim' || weapon.targetMode === 'instant' || (weapon.id === 'homing' && game.pendingMapTarget))) {
        const angle = w.getAimWorldAngle();
        const rx = Math.cos(angle) * 52;
        const ry = Math.sin(angle) * 52;

        // Dotted sight line
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)';
        ctx.setLineDash([3, 5]);
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(Math.cos(angle) * 16, Math.sin(angle) * 16);
        ctx.lineTo(rx, ry);
        ctx.stroke();
        ctx.restore();

        // Crosshair reticle
        ctx.save();
        ctx.translate(rx, ry);
        ctx.rotate(this.time * 1.4);
        ctx.strokeStyle = '#ff4757';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, 7, 0, Math.PI * 2);
        ctx.stroke();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-10, 0);
        ctx.lineTo(-4, 0);
        ctx.moveTo(4, 0);
        ctx.lineTo(10, 0);
        ctx.moveTo(0, -10);
        ctx.lineTo(0, -4);
        ctx.moveTo(0, 4);
        ctx.lineTo(0, 10);
        ctx.stroke();
        ctx.restore();

        // Power gauge shooting out from worm while charging
        if (game.phase === PHASES.CHARGING) {
          const power = game.chargePower;
          ctx.save();
          ctx.rotate(angle);
          const segments = 14;
          const activeSegs = Math.max(1, Math.ceil(power * segments));
          for (let i = 0; i < activeSegs; i++) {
            const t = i / (segments - 1);
            const r = 255;
            const g = Math.round(230 * (1 - t * 0.85));
            const b = Math.round(60 * (1 - t));
            ctx.fillStyle = `rgb(${r},${g},${b})`;
            ctx.beginPath();
            ctx.arc(16 + i * 4.2, 0, 2.2 + t * 2.8, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }
      }
    }

    ctx.restore();
  }

  _drawHeldWeapon(ctx, w, weaponId) {
    const angle = w.getAimWorldAngle();
    ctx.save();
    ctx.translate(0, -1);
    ctx.rotate(angle);
    if (w.facing < 0) ctx.scale(1, -1);

    if (sprites.isReady()) {
      let handled = true;
      switch (weaponId) {
        case 'bazooka':
          ctx.rotate(0.22);
          sprites.draw(ctx, 'items', 'bazooka', 6, 0, 24, 15, 0.42, 0.54);
          break;
        case 'homing':
          ctx.rotate(0.68);
          sprites.draw(ctx, 'items', 'homing', 8, 0, 22, 16, 0.4, 0.5);
          break;
        case 'shotgun':
          ctx.rotate(0.36);
          sprites.draw(ctx, 'items', 'shotgun', 8, 0, 23, 16, 0.36, 0.5);
          break;
        case 'uzi':
          ctx.rotate(0.14);
          sprites.draw(ctx, 'items', 'uzi', 8, 1, 18, 15, 0.38, 0.45);
          break;
        case 'grenade':
          sprites.draw(ctx, 'items', 'grenadeIcon', 10, 1, 13, 14, 0.5, 0.5);
          break;
        case 'cluster':
          sprites.draw(ctx, 'items', 'clusterBomb', 10, 1, 14, 14, 0.5, 0.5);
          break;
        case 'banana':
          sprites.draw(ctx, 'items', 'bananaPlain', 10, 1, 14, 14, 0.5, 0.5);
          break;
        case 'holy':
          sprites.draw(ctx, 'items', 'cross', 10, 1, 14, 15, 0.5, 0.5);
          break;
        case 'dynamite':
          sprites.draw(ctx, 'items', 'dynamite', 9, 1, 14, 15, 0.5, 0.5);
          break;
        case 'blowtorch':
          sprites.draw(ctx, 'items', 'blowtorch', 11, 0, 26, 16, 0.32, 0.5);
          break;
        case 'handgun':
          ctx.rotate(0.18);
          sprites.draw(ctx, 'items', 'handgun', 8, 1, 16, 15, 0.35, 0.5);
          break;
        case 'mortar':
          ctx.rotate(0.55);
          sprites.draw(ctx, 'items', 'mortar', 8, 0, 22, 18, 0.4, 0.52);
          break;
        case 'fireball':
          sprites.draw(ctx, 'items', 'fireball', 10, 0, 18, 18, 0.45, 0.5);
          break;
        case 'punch':
          sprites.draw(ctx, 'items', 'punch', 11, 0, 17, 17, 0.45, 0.5);
          break;
        case 'drill':
          sprites.draw(ctx, 'items', 'drill', 9, 2, 22, 14, 0.4, 0.5);
          break;
        case 'sonic':
          sprites.draw(ctx, 'items', 'sonic', 10, 0, 18, 18, 0.4, 0.5);
          break;
        case 'balloon':
          sprites.draw(ctx, 'items', 'balloon', 9, -2, 15, 20, 0.5, 0.6);
          break;
        case 'windblower':
          sprites.draw(ctx, 'items', 'windblower', 10, 0, 22, 16, 0.35, 0.5);
          break;
        case 'rope':
          sprites.draw(ctx, 'items', 'rope', 10, 0, 18, 15, 0.4, 0.5);
          break;
        case 'poison':
          sprites.draw(ctx, 'items', 'slime', 9, 1, 14, 14, 0.5, 0.5);
          break;
        case 'icebomb':
          sprites.draw(ctx, 'items', 'ice', 9, 1, 14, 14, 0.5, 0.5);
          break;
        case 'petrol':
          sprites.draw(ctx, 'items', 'petrol', 9, 1, 14, 15, 0.5, 0.5);
          break;
        case 'sheep':
          sprites.draw(ctx, 'items', 'sheep', 10, 2, 17, 15, 0.5, 0.55);
          break;
        case 'supersheep':
          sprites.draw(ctx, 'items', 'supersheep', 10, 2, 18, 15, 0.5, 0.55);
          break;
        case 'cow':
          sprites.draw(ctx, 'items', 'cow', 11, 2, 18, 16, 0.5, 0.55);
          break;
        case 'mine':
          sprites.draw(ctx, 'items', 'mineButton', 9, 2, 15, 13, 0.5, 0.5);
          break;
        case 'napalm':
        case 'meteor':
          sprites.draw(ctx, 'items', 'phone', 8, 1, 14, 13, 0.5, 0.5);
          break;
        default:
          handled = false;
          break;
      }
      if (handled) {
        ctx.restore();
        return;
      }
    }

    switch (weaponId) {
      case 'bazooka':
      case 'homing':
        ctx.fillStyle = weaponId === 'homing' ? '#2e86de' : '#3b7a57';
        ctx.strokeStyle = '#1e272e';
        ctx.lineWidth = 1.3;
        ctx.fillRect(-5, -4, 21, 6.5);
        ctx.strokeRect(-5, -4, 21, 6.5);
        ctx.fillStyle = '#ff4757';
        ctx.fillRect(14, -4.5, 4, 7.5);
        break;
      case 'shotgun':
        ctx.fillStyle = '#8d5524';
        ctx.fillRect(1, -1.5, 10, 4);
        ctx.fillStyle = '#ced6e0';
        ctx.fillRect(6, -3, 14, 2.6);
        break;
      case 'uzi':
        ctx.fillStyle = '#4b5563';
        ctx.fillRect(3, -3.5, 12, 4.5);
        ctx.fillRect(6, 1, 3, 5);
        break;
      case 'bat':
        ctx.fillStyle = '#e0a96d';
        ctx.strokeStyle = '#5c3c1e';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(4, 1);
        ctx.lineTo(19, -3);
        ctx.lineTo(19, 1);
        ctx.lineTo(4, 3);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;
      case 'grenade':
      case 'cluster':
        ctx.fillStyle = weaponId === 'cluster' ? '#d63031' : '#3d7c3f';
        ctx.beginPath();
        ctx.arc(9, 1, 4.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#1e272e';
        ctx.lineWidth = 1.2;
        ctx.stroke();
        break;
      case 'banana':
        ctx.fillStyle = '#ffe135';
        ctx.beginPath();
        ctx.arc(9, 1, 4.8, 0.3, Math.PI + 0.5);
        ctx.fill();
        break;
      case 'holy':
        ctx.fillStyle = '#f9ca24';
        ctx.beginPath();
        ctx.arc(9, 1, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#fff6cc';
        ctx.lineWidth = 1.4;
        ctx.stroke();
        break;
      case 'dynamite':
        ctx.fillStyle = '#ff4757';
        ctx.fillRect(6, -4, 6, 9);
        break;
      case 'blowtorch':
        ctx.fillStyle = '#576574';
        ctx.fillRect(3, -2, 11, 4);
        ctx.fillStyle = Math.random() < 0.5 ? '#ff9f43' : '#ff4757';
        ctx.beginPath();
        ctx.moveTo(14, -2.5);
        ctx.lineTo(24 + Math.random() * 5, 0);
        ctx.lineTo(14, 2.5);
        ctx.closePath();
        ctx.fill();
        break;
      default:
        break;
    }
    ctx.restore();
  }

  _drawWormBadge(ctx, w, isActive) {
    const palette = TEAM_PALETTES[w.teamIndex] || TEAM_PALETTES[0];
    ctx.save();
    ctx.translate(w.x, w.y - 39);

    if (isActive) {
      const arrowBounce = Math.sin(this.time * 6) * 3;
      ctx.fillStyle = '#ffe875';
      ctx.strokeStyle = '#181820';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, -16 + arrowBounce);
      ctx.lineTo(-5.5, -24 + arrowBounce);
      ctx.lineTo(5.5, -24 + arrowBounce);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    ctx.font = '700 10px "Trebuchet MS", system-ui, sans-serif';
    const label = `${w.name}`;
    const hpText = `${Math.max(0, Math.ceil(w.hp))}`;
    const textW = Math.max(46, ctx.measureText(label).width + 14);
    const pillW = textW;
    const pillH = 22;

    ctx.fillStyle = 'rgba(12, 16, 26, 0.84)';
    ctx.strokeStyle = palette.color;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.roundRect(-pillW * 0.5, -pillH * 0.5, pillW, pillH, 5);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = palette.light;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, 0, -4.5);

    // Health bar inside badge
    const barW = pillW - 10;
    const barX = -barW * 0.5;
    const barY = 2.5;
    ctx.fillStyle = 'rgba(255,255,255,0.14)';
    ctx.fillRect(barX, barY, barW, 4);

    const ratio = Math.max(0, Math.min(1, w.displayHp / w.maxHp));
    ctx.fillStyle = palette.color;
    ctx.fillRect(barX, barY, barW * ratio, 4);

    ctx.font = '800 9px "Trebuchet MS", system-ui, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(hpText, 0, 12.5);

    ctx.restore();
  }

  _drawProjectile(ctx, p) {
    ctx.save();
    ctx.translate(p.x, p.y);

    let drewSprite = false;
    if (sprites.isReady()) {
      if (p.type === 'bazooka' || p.type === 'airstrike_bomb' || p.type === 'mortar') {
        ctx.rotate(p.angle);
        drewSprite = sprites.draw(ctx, 'worms', 'rocket', 0, 0, p.type === 'mortar' ? 24 : 22, 15, 0.5, 0.5);
      } else if (p.type === 'homing') {
        ctx.rotate(p.angle + 0.68);
        drewSprite = sprites.draw(ctx, 'items', 'homing', 0, 0, 24, 18, 0.5, 0.5);
      } else if (p.type === 'grenade') {
        ctx.rotate(p.vx * 0.015);
        drewSprite = sprites.draw(ctx, 'worms', 'grenade', 0, 0, 16, 18, 0.5, 0.5);
      } else if (p.type === 'cluster' || p.type === 'cluster_bomblet') {
        ctx.rotate(this.time * 8);
        const s = p.type === 'cluster' ? 16 : 12;
        drewSprite = sprites.draw(ctx, 'items', 'clusterBomb', 0, 0, s, s, 0.5, 0.5);
      } else if (p.type === 'mortar_shrapnel') {
        ctx.rotate(this.time * 10);
        drewSprite = sprites.draw(ctx, 'items', 'shrapnel', 0, 0, 13, 13, 0.5, 0.5);
      } else if (p.type === 'banana' || p.type === 'banana_bomblet') {
        ctx.rotate(this.time * 12);
        const s = p.type === 'banana' ? 19 : 14;
        drewSprite = sprites.draw(ctx, 'worms', 'banana', 0, 0, s, s, 0.5, 0.5);
      } else if (p.type === 'holy') {
        ctx.rotate(p.vx * 0.015);
        drewSprite = sprites.draw(ctx, 'items', 'cross', 0, 0, 18, 20, 0.5, 0.5);
      } else if (p.type === 'dynamite') {
        drewSprite = sprites.draw(ctx, 'items', 'dynamiteClock', 0, 0, 18, 20, 0.5, 0.5);
      } else if (p.type === 'fireball' || p.type === 'napalm_drop' || p.type === 'fire_ember') {
        ctx.rotate(p.angle);
        const s = p.type === 'fireball' ? 20 : p.type === 'napalm_drop' ? 16 : 12;
        drewSprite = sprites.draw(ctx, 'items', 'fireball', 0, 0, s, s, 0.5, 0.5);
      } else if (p.type === 'poison') {
        ctx.rotate(p.vx * 0.015);
        drewSprite = sprites.draw(ctx, 'items', 'slime', 0, 0, 16, 16, 0.5, 0.5);
      } else if (p.type === 'icebomb') {
        ctx.rotate(p.vx * 0.015);
        drewSprite = sprites.draw(ctx, 'items', 'ice', 0, 0, 16, 16, 0.5, 0.5);
      } else if (p.type === 'petrol') {
        ctx.rotate(p.vx * 0.02);
        drewSprite = sprites.draw(ctx, 'items', 'petrol', 0, 0, 17, 19, 0.5, 0.5);
      } else if (p.type === 'meteor') {
        ctx.rotate(p.angle - Math.PI * 0.5);
        drewSprite = sprites.draw(ctx, 'items', 'meteor', 0, 0, 26, 28, 0.5, 0.5);
      } else if (p.type === 'balloon') {
        ctx.rotate(Math.sin(this.time * 4) * 0.12);
        drewSprite = sprites.draw(ctx, 'items', 'balloon', 0, 0, 20, 26, 0.5, 0.5);
      }
    }

    if (drewSprite) {
      ctx.restore();
      if (p.fuse > 0 && (p.fuseable || p.type === 'holy' || p.type === 'dynamite')) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.font = '800 11px "Trebuchet MS", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#000';
        ctx.fillText(`${Math.ceil(p.fuse)}`, 1, -13);
        ctx.fillStyle = p.fuse <= 1.1 ? '#ff5252' : '#ffe875';
        ctx.fillText(`${Math.ceil(p.fuse)}`, 0, -14);
        ctx.restore();
      }
      return;
    }

    if (p.type === 'bazooka' || p.type === 'homing') {
      ctx.rotate(p.angle);
      ctx.fillStyle = p.type === 'homing' ? '#48dbfb' : '#dfe6e9';
      ctx.strokeStyle = '#1e272e';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(8, 0);
      ctx.lineTo(-6, -3.6);
      ctx.lineTo(-6, 3.6);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#ff9f43';
      ctx.beginPath();
      ctx.arc(-7, 0, 2.6 + Math.random(), 0, Math.PI * 2);
      ctx.fill();
    } else if (p.type === 'banana' || p.type === 'banana_bomblet') {
      ctx.rotate(this.time * 12);
      ctx.fillStyle = '#ffe135';
      ctx.strokeStyle = '#785a00';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(0, 0, p.type === 'banana' ? 6.5 : 4.8, 0.2, Math.PI + 0.6);
      ctx.fill();
      ctx.stroke();
    } else if (p.type === 'holy') {
      ctx.rotate(p.vx * 0.02);
      ctx.fillStyle = '#f9ca24';
      ctx.strokeStyle = '#fff6cc';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(0, 0, 7.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, -11);
      ctx.lineTo(0, -5);
      ctx.moveTo(-3, -8.5);
      ctx.lineTo(3, -8.5);
      ctx.stroke();
    } else if (p.type === 'dynamite') {
      ctx.fillStyle = '#ff4757';
      ctx.strokeStyle = '#1e272e';
      ctx.lineWidth = 1.2;
      ctx.fillRect(-5, -7, 10, 14);
      ctx.strokeRect(-5, -7, 10, 14);
      ctx.fillStyle = Math.random() < 0.5 ? '#ffe875' : '#ff9f43';
      ctx.beginPath();
      ctx.arc(0, -9, 2.5, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Grenade / Cluster / Bomblet / Airstrike bomb / Bullet / Special fallback
      const isCluster = p.type === 'cluster' || p.type === 'cluster_bomblet';
      const isBomb = p.type === 'airstrike_bomb' || p.type === 'meteor';
      const isBullet = p.type === 'uzi_bullet' || p.type === 'handgun_bullet';
      const isFire = p.type === 'fireball' || p.type === 'napalm_drop' || p.type === 'fire_ember';
      ctx.fillStyle = isCluster
        ? '#e84118'
        : isFire
          ? '#ff9f43'
          : isBomb
            ? '#576574'
            : isBullet
              ? '#ffe875'
              : '#3d7c3f';
      ctx.strokeStyle = '#1e272e';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(0, 0, isBullet ? 2.6 : isBomb ? 5.5 : 5, 0, Math.PI * 2);
      ctx.fill();
      if (!isBullet) ctx.stroke();
    }

    // Draw fuse countdown label above fuseable projectiles
    if (p.fuse > 0 && (p.fuseable || p.type === 'holy' || p.type === 'dynamite')) {
      ctx.font = '800 11px "Trebuchet MS", system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#000';
      ctx.fillText(`${Math.ceil(p.fuse)}`, 1, -11);
      ctx.fillStyle = p.fuse <= 1.1 ? '#ff5252' : '#ffe875';
      ctx.fillText(`${Math.ceil(p.fuse)}`, 0, -12);
    }

    ctx.restore();
  }

  _drawMine(ctx, m) {
    ctx.save();
    ctx.translate(m.x, m.y);
    const blinkOn = m.triggered ? Math.sin(this.time * 24) > 0 : Math.sin(this.time * 3) > 0.7;

    if (sprites.draw(ctx, 'items', 'mine', 0, 1, 22, 14, 0.5, 0.65)) {
      if (m.triggered && blinkOn) {
        ctx.fillStyle = 'rgba(255, 56, 56, 0.85)';
        ctx.beginPath();
        ctx.arc(0, -4, 3.2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
      return;
    }

    ctx.fillStyle = '#3d4852';
    ctx.strokeStyle = '#181820';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(0, 1, 6, Math.PI, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = blinkOn ? '#ff3838' : '#7a1c1c';
    ctx.beginPath();
    ctx.arc(0, -4, 2.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  _drawBarrel(ctx, b) {
    ctx.save();
    ctx.translate(b.x, b.y);
    if (sprites.draw(ctx, 'items', 'barrel', 0, 0, 22, 24, 0.5, 0.52)) {
      ctx.restore();
      return;
    }
    ctx.fillStyle = '#d63031';
    ctx.strokeStyle = '#181820';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(-7, -10, 14, 20, 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#ffeaa7';
    ctx.fillRect(-6, -2, 12, 4);
    ctx.restore();
  }

  _drawCrate(ctx, c) {
    ctx.save();
    ctx.translate(c.x, c.y);

    if (sprites.isReady()) {
      if (!c.landed) {
        ctx.rotate(Math.sin(c.swayPhase) * 0.14);
        const key = c.kind === 'health' ? 'parachuteCrateRed' : 'parachuteCrateOrange';
        if (sprites.draw(ctx, 'items', key, 0, 2, 34, 40, 0.5, 0.8)) {
          ctx.restore();
          return;
        }
      } else {
        const sheet = c.kind === 'health' ? 'items' : 'worms';
        const key = c.kind === 'health' ? 'crateAlert' : 'crateWood';
        if (sprites.draw(ctx, sheet, key, 0, 1, 22, 22, 0.5, 0.55)) {
          ctx.restore();
          return;
        }
      }
    }

    if (!c.landed) {
      const sway = Math.sin(c.swayPhase) * 0.14;
      ctx.save();
      ctx.rotate(sway);
      // Strings
      ctx.strokeStyle = 'rgba(255,255,255,0.75)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-7, -8);
      ctx.lineTo(-14, -26);
      ctx.moveTo(7, -8);
      ctx.lineTo(14, -26);
      ctx.stroke();
      // Parachute canopy
      ctx.fillStyle = c.kind === 'health' ? '#ff6b81' : '#feca57';
      ctx.strokeStyle = '#1e272e';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(0, -26, 15, Math.PI, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    // Crate box
    ctx.fillStyle = c.kind === 'health' ? '#f5f6fa' : '#b9773b';
    ctx.strokeStyle = '#1e272e';
    ctx.lineWidth = 1.6;
    ctx.fillRect(-9, -9, 18, 18);
    ctx.strokeRect(-9, -9, 18, 18);

    if (c.kind === 'health') {
      ctx.fillStyle = '#ff4757';
      ctx.fillRect(-2, -6, 4, 12);
      ctx.fillRect(-6, -2, 12, 4);
    } else {
      ctx.strokeStyle = '#ffeaa7';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-6, -6);
      ctx.lineTo(6, 6);
      ctx.moveTo(6, -6);
      ctx.lineTo(-6, 6);
      ctx.stroke();
    }
    ctx.restore();
  }

  _drawGrave(ctx, g) {
    const palette = TEAM_PALETTES[g.teamIndex] || TEAM_PALETTES[0];
    ctx.save();
    ctx.translate(g.x, g.y);

    if (sprites.isReady()) {
      ctx.fillStyle = 'rgba(28, 34, 42, 0.85)';
      ctx.strokeStyle = palette.color;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.roundRect(-9, 3, 18, 6, 2);
      ctx.fill();
      ctx.stroke();
      if (sprites.draw(ctx, 'items', 'skull', 0, -4, 19, 20, 0.5, 0.55)) {
        ctx.restore();
        return;
      }
    }

    ctx.fillStyle = '#7f8c8d';
    ctx.strokeStyle = '#1e272e';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, -4, 7, Math.PI, 0);
    ctx.lineTo(7, 9);
    ctx.lineTo(-7, 9);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = palette.color;
    ctx.fillRect(-3.5, -1, 7, 2.2);
    ctx.fillRect(-1.1, -3.5, 2.2, 7.5);
    ctx.restore();
  }

  _drawRope(ctx, rope, activeWorm) {
    ctx.save();
    ctx.strokeStyle = '#d9b382';
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.moveTo(rope.anchorX, rope.anchorY);
    ctx.lineTo(activeWorm.x, activeWorm.y - 4);
    ctx.stroke();

    ctx.fillStyle = '#dfe6e9';
    ctx.strokeStyle = '#1e272e';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(rope.anchorX, rope.anchorY, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  _drawMagnet(ctx, mag) {
    ctx.save();
    ctx.translate(mag.x, mag.y);
    const pulse = (this.time * 1.4) % 1;
    ctx.strokeStyle = `rgba(72, 219, 251, ${(1 - pulse) * 0.45})`;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.arc(0, 0, 18 + pulse * 36, 0, Math.PI * 2);
    ctx.stroke();

    if (!sprites.draw(ctx, 'items', 'magnet', 0, 0, 22, 22, 0.5, 0.55)) {
      ctx.strokeStyle = '#ff4757';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(0, 0, 8, Math.PI, 0);
      ctx.stroke();
    }
    ctx.restore();
  }

  _drawWalker(ctx, wk) {
    ctx.save();
    ctx.translate(wk.x, wk.y);
    const key = wk.kind === 'cow' ? 'cow' : wk.kind === 'supersheep' ? 'supersheep' : 'sheep';

    if (wk.kind === 'supersheep' && wk.flying) {
      ctx.rotate(wk.flyAngle);
      if (Math.cos(wk.flyAngle) < 0) ctx.scale(1, -1);
      if (!sprites.draw(ctx, 'items', 'supersheep', 0, 0, 26, 22, 0.5, 0.5)) {
        ctx.fillStyle = '#ffeaa7';
        ctx.beginPath();
        ctx.ellipse(0, 0, 10, 7, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      ctx.scale(wk.dir, 1);
      if (!sprites.draw(ctx, 'items', key, 0, 0, wk.kind === 'cow' ? 28 : 24, wk.kind === 'cow' ? 25 : 22, 0.5, 0.55)) {
        ctx.fillStyle = wk.kind === 'cow' ? '#8d6e63' : '#f5f6fa';
        ctx.strokeStyle = '#1e272e';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(0, 0, 10, 7, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
    }
    ctx.restore();

    if (wk.fuse > 0 && !wk.flying) {
      ctx.save();
      ctx.translate(wk.x, wk.y);
      ctx.font = '800 10px "Trebuchet MS", system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#000';
      ctx.fillText(`${Math.ceil(wk.fuse)}`, 1, -14);
      ctx.fillStyle = wk.fuse <= 1.2 ? '#ff5252' : '#ffe875';
      ctx.fillText(`${Math.ceil(wk.fuse)}`, 0, -15);
      ctx.restore();
    }
  }

  _drawAirplane(ctx, plane) {
    ctx.save();
    ctx.translate(plane.x, plane.y);
    ctx.scale(plane.dir, 1);
    ctx.rotate(Math.sin(this.time * 10) * 0.03);
    if (sprites.draw(ctx, 'plane', 'plane', 0, -2, 114, 70, 0.5, 0.5)) {
      ctx.restore();
      return;
    }
    ctx.fillStyle = '#74b9ff';
    ctx.strokeStyle = '#1e272e';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(-36, 4);
    ctx.lineTo(-22, -6);
    ctx.lineTo(-10, -6);
    ctx.lineTo(2, -16);
    ctx.lineTo(14, -6);
    ctx.lineTo(36, -2);
    ctx.lineTo(42, 4);
    ctx.lineTo(28, 9);
    ctx.lineTo(-32, 9);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#dff9fb';
    ctx.fillRect(10, -4, 14, 5);
    ctx.restore();
  }

  _drawTargetingOverlay(ctx, game, activeWorm) {
    if (!activeWorm || game.phase !== PHASES.PLAYER_TURN) return;
    if (typeof game.canLocalPlayerControl === 'function' && !game.canLocalPlayerControl()) return;

    const weapon = WEAPON_MAP[game.selectedWeaponId];
    if (!weapon) return;

    if (game.pendingMapTarget && weapon.id === 'homing') {
      const { x, y } = game.pendingMapTarget;
      ctx.save();
      ctx.translate(x, y);
      ctx.strokeStyle = '#ff4757';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, 14 + Math.sin(this.time * 8) * 2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-18, 0);
      ctx.lineTo(18, 0);
      ctx.moveTo(0, -18);
      ctx.lineTo(0, 18);
      ctx.stroke();
      ctx.restore();
    }

    if (weapon.targetMode === 'mapClick' && (!game.pendingMapTarget || weapon.id !== 'homing')) {
      const wx = game.hoverWorldX;
      const wy = game.hoverWorldY;
      ctx.save();
      if (weapon.id === 'airstrike' || weapon.id === 'napalm' || weapon.id === 'meteor') {
        ctx.strokeStyle = weapon.id === 'napalm' ? 'rgba(255, 159, 67, 0.85)' : 'rgba(255, 82, 82, 0.85)';
        ctx.setLineDash([6, 6]);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(wx, 25);
        ctx.lineTo(wx, wy);
        ctx.stroke();
        ctx.setLineDash([]);
        // Direction indicator arrow in sky
        ctx.fillStyle = weapon.id === 'meteor' ? '#ff9f43' : '#74b9ff';
        ctx.font = '800 13px "Trebuchet MS", sans-serif';
        ctx.textAlign = 'center';
        const skyText =
          weapon.id === 'meteor'
            ? 'METEOR SHOWER ↓'
            : `${weapon.id === 'napalm' ? 'NAPALM' : 'PLANE'} ${game.airstrikeDir >= 0 ? '→' : '←'}`;
        ctx.fillText(skyText, wx, Math.max(55, wy - 80));
      }

      ctx.translate(wx, wy);
      ctx.strokeStyle = weapon.id === 'teleport' || weapon.id === 'magnet' ? '#48dbfb' : '#ff5252';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, 14 + Math.sin(this.time * 7) * 2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    if (weapon.targetMode === 'girder') {
      const wx = game.hoverWorldX;
      const wy = game.hoverWorldY;
      ctx.save();
      ctx.translate(wx, wy);
      ctx.rotate(game.girderAngle);
      ctx.fillStyle = 'rgba(127, 143, 166, 0.55)';
      ctx.strokeStyle = '#dff9fb';
      ctx.lineWidth = 2;
      ctx.fillRect(-48, -6, 96, 12);
      ctx.strokeRect(-48, -6, 96, 12);
      ctx.restore();
    }
  }

  _drawParticles(ctx, ps) {
    for (const s of ps.shockwaves) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, s.alpha);
      ctx.strokeStyle = s.color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    for (const p of ps.particles) {
      const alpha = Math.max(0, p.life / p.maxLife);
      ctx.save();
      ctx.globalAlpha = p.kind === 'smoke' ? alpha * 0.55 : alpha;
      if (p.kind === 'smoke' && sprites.isReady()) {
        const s = Math.max(12, p.size * 2.1);
        sprites.draw(ctx, 'worms', 'smoke', p.x, p.y, s, s, 0.5, 0.5);
        ctx.restore();
        continue;
      }
      ctx.fillStyle = p.color;
      if (p.kind === 'debris') {
        ctx.fillRect(p.x - p.size * 0.5, p.y - p.size * 0.5, p.size, p.size);
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    for (const fx of ps.fxSprites) {
      const alpha = Math.min(1, (fx.life / fx.maxLife) * 1.4);
      ctx.save();
      ctx.globalAlpha = Math.max(0, alpha);
      ctx.translate(fx.x, fx.y);
      ctx.rotate(fx.rot);
      sprites.draw(ctx, fx.sheet, fx.key, 0, 0, fx.size, fx.size, 0.5, 0.5);
      ctx.restore();
    }
  }

  _drawPopups(ctx, ps) {
    for (const pop of ps.popups) {
      const alpha = Math.min(1, (pop.life / pop.maxLife) * 1.4);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.font = `900 ${pop.size}px "Trebuchet MS", Impact, sans-serif`;
      ctx.textAlign = 'center';
      ctx.strokeStyle = '#0c101a';
      ctx.lineWidth = 4;
      ctx.strokeText(pop.text, pop.x, pop.y);
      ctx.fillStyle = pop.color;
      ctx.fillText(pop.text, pop.x, pop.y);
      ctx.restore();
    }
  }

  renderMinimap(miniCanvas, game) {
    const ctx = miniCanvas.getContext('2d');
    const w = miniCanvas.width;
    const h = miniCanvas.height;
    const sx = w / WORLD_W;
    const sy = h / WORLD_H;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(10, 16, 28, 0.92)';
    ctx.fillRect(0, 0, w, h);

    // Draw scaled terrain canvas
    if (game.terrain.canvas) {
      ctx.drawImage(game.terrain.canvas, 0, 0, w, h);
    }

    // Water band
    ctx.fillStyle = game.terrain.theme.waterTop;
    const wy = game.waterY * sy;
    ctx.fillRect(0, wy, w, h - wy);

    // Crates & mines
    for (const c of game.crates) {
      if (!c.alive) continue;
      ctx.fillStyle = c.kind === 'health' ? '#ff6b81' : '#feca57';
      ctx.fillRect(c.x * sx - 1.5, c.y * sy - 1.5, 3, 3);
    }

    // Living worms
    const active = game.getActiveWorm();
    for (const worm of game.worms) {
      if (!worm.alive) continue;
      const palette = TEAM_PALETTES[worm.teamIndex] || TEAM_PALETTES[0];
      ctx.fillStyle = palette.color;
      ctx.beginPath();
      ctx.arc(worm.x * sx, worm.y * sy, worm === active ? 3.2 : 2.3, 0, Math.PI * 2);
      ctx.fill();
      if (worm === active) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }
    }

    // Camera viewport rect
    const camLeft = (game.camera.x - (game.camera.viewW * 0.5) / game.camera.zoom) * sx;
    const camTop = (game.camera.y - (game.camera.viewH * 0.5) / game.camera.zoom) * sy;
    const camW = (game.camera.viewW / game.camera.zoom) * sx;
    const camH = (game.camera.viewH / game.camera.zoom) * sy;

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.lineWidth = 1;
    ctx.strokeRect(camLeft, camTop, camW, camH);
  }
}
