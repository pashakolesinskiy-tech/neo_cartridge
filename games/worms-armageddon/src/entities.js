import {
  FALL_DAMAGE_SCALE,
  FALL_DAMAGE_VEL,
  GRAVITY,
  MAX_STEP_UP,
  WALK_SPEED,
  WIND_ACCEL_SCALE,
  WORLD_W,
  WORM_RADIUS,
} from './constants.js';

function clamp(v, lo, hi) {
  return v < lo ? lo : v > hi ? hi : v;
}

const WORM_SAMPLE_OFFSETS = [
  [0, 0],
  [0, WORM_RADIUS - 1],
  [0, -(WORM_RADIUS - 2)],
  [WORM_RADIUS - 2, 2],
  [-(WORM_RADIUS - 2), 2],
  [WORM_RADIUS - 3, -5],
  [-(WORM_RADIUS - 3), -5],
  [WORM_RADIUS - 4, 7],
  [-(WORM_RADIUS - 4), 7],
];

export function isWormColliding(x, y, terrain) {
  for (let i = 0; i < WORM_SAMPLE_OFFSETS.length; i++) {
    const [ox, oy] = WORM_SAMPLE_OFFSETS[i];
    if (terrain.isSolid(x + ox, y + oy)) return true;
  }
  return false;
}

export function hasFloorBelow(x, y, terrain, probe = 2.5) {
  return (
    terrain.isSolid(x, y + WORM_RADIUS + probe) ||
    terrain.isSolid(x - 4, y + WORM_RADIUS + probe) ||
    terrain.isSolid(x + 4, y + WORM_RADIUS + probe)
  );
}

export class Worm {
  constructor({ id, name, teamIndex, x, y, hp = 100, facing = 1 }) {
    this.id = id;
    this.name = name;
    this.teamIndex = teamIndex;
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.hp = hp;
    this.maxHp = hp;
    this.displayHp = hp;
    this.facing = facing;
    // Aim pitch relative to horizontal: -PI/2 (up) .. +PI/2 (down), 0 is straight horizontally in facing direction
    this.aimPitch = -0.25;
    this.grounded = false;
    this.alive = true;
    this.dying = false;
    this.deathTimer = 0;
    this.drowning = false;
    this.maxAirVy = 0;
    this.walkCycle = 0;
    this.blinkTimer = 1.5 + Math.random() * 3.5;
    this.hurtTimer = 0;
    this.panicTimer = 0;
    this.lastDamage = 0;
    this.jumpKind = null;
    this.airTime = 0;
    this.landSquash = 0;
    this.jumpCooldown = 0;
    this.walkTimer = 0;
    this.fireTimer = 0;
    this.poisoned = false;
    this.frozenTurns = 0;
  }

  getAimWorldAngle() {
    return this.facing >= 0 ? this.aimPitch : Math.PI - this.aimPitch;
  }

  setAimFromWorldPoint(wx, wy) {
    const dx = wx - this.x;
    const dy = wy - this.y;
    if (Math.hypot(dx, dy) < 2) return;
    this.facing = dx >= 0 ? 1 : -1;
    const horiz = Math.max(0.001, Math.abs(dx));
    this.aimPitch = clamp(Math.atan2(dy, horiz), -Math.PI * 0.48, Math.PI * 0.45);
  }

  adjustAim(deltaPitch) {
    this.aimPitch = clamp(this.aimPitch + deltaPitch, -Math.PI * 0.48, Math.PI * 0.45);
  }

  walk(dir, dt, terrain) {
    if (!this.alive || this.dying || this.frozenTurns > 0) return false;
    const stepDir = dir >= 0 ? 1 : -1;
    if (!this.grounded) {
      // Subtle mid-air nudge without jarring mid-jump facing flip
      if (!this.jumpKind) {
        this.facing = stepDir;
      }
      this.vx += stepDir * 25 * dt;
      this.vx = clamp(this.vx, -110, 110);
      return true;
    }
    this.facing = stepDir;

    const totalMove = this.facing * WALK_SPEED * dt;
    const steps = Math.max(1, Math.ceil(Math.abs(totalMove) / 1.8));
    const stepX = totalMove / steps;
    let moved = false;

    for (let s = 0; s < steps; s++) {
      const nx = clamp(this.x + stepX, WORM_RADIUS + 2, WORLD_W - WORM_RADIUS - 2);
      if (!isWormColliding(nx, this.y, terrain)) {
        this.x = nx;
        moved = true;
        // Snap down gentle slopes
        for (let d = 1; d <= MAX_STEP_UP; d++) {
          if (hasFloorBelow(this.x, this.y, terrain, 1.5)) break;
          if (!isWormColliding(this.x, this.y + 1, terrain)) {
            this.y += 1;
          } else {
            break;
          }
        }
        if (!hasFloorBelow(this.x, this.y, terrain, 3)) {
          this.grounded = false;
        }
      } else {
        let climbed = false;
        for (let up = 1; up <= MAX_STEP_UP; up++) {
          if (!isWormColliding(nx, this.y - up, terrain)) {
            this.x = nx;
            this.y -= up;
            climbed = true;
            moved = true;
            break;
          }
        }
        if (!climbed) break;
      }
    }

    if (moved) {
      this.walkCycle += dt * 11;
      this.walkTimer = 0.14;
    }
    return moved;
  }

  jump() {
    if (!this.alive || this.dying || !this.grounded || this.jumpCooldown > 0 || this.frozenTurns > 0) return false;
    this.grounded = false;
    this.vx = this.facing * 86;
    this.vy = -160;
    this.maxAirVy = 0;
    this.jumpKind = 'jump';
    this.airTime = 0;
    this.landSquash = -0.14;
    return true;
  }

  backflip() {
    if (!this.alive || this.dying || !this.grounded || this.jumpCooldown > 0 || this.frozenTurns > 0) return false;
    this.grounded = false;
    this.vx = -this.facing * 36;
    this.vy = -238;
    this.maxAirVy = 0;
    this.jumpKind = 'backflip';
    this.airTime = 0;
    this.landSquash = -0.16;
    return true;
  }

  applyDamage(amount, impulseX = 0, impulseY = 0) {
    if (!this.alive || this.dying) return 0;
    const dmg = Math.max(0, Math.round(amount));
    this.hp = Math.max(0, this.hp - dmg);
    this.lastDamage = dmg;
    this.hurtTimer = 0.65;
    if (Math.hypot(impulseX, impulseY) > 25) {
      this.vx += impulseX;
      this.vy += impulseY;
      this.grounded = false;
      this.jumpKind = null;
      this.panicTimer = 0.8;
    }
    if (this.hp <= 0 && !this.dying) {
      this.dying = true;
      this.deathTimer = 0.85;
    }
    return dmg;
  }

  heal(amount) {
    if (!this.alive || this.dying) return 0;
    this.poisoned = false;
    const before = this.hp;
    this.hp = Math.min(this.maxHp, this.hp + Math.round(amount));
    return this.hp - before;
  }

  stepPhysics(dt, terrain, waterY, callbacks = {}) {
    if (!this.alive) return;

    this.displayHp += (this.hp - this.displayHp) * Math.min(1, dt * 8);
    if (this.hurtTimer > 0) this.hurtTimer = Math.max(0, this.hurtTimer - dt);
    if (this.panicTimer > 0) this.panicTimer = Math.max(0, this.panicTimer - dt);
    if (this.jumpCooldown > 0) this.jumpCooldown = Math.max(0, this.jumpCooldown - dt);
    if (this.walkTimer > 0) this.walkTimer = Math.max(0, this.walkTimer - dt);
    if (this.fireTimer > 0) this.fireTimer = Math.max(0, this.fireTimer - dt);
    this.landSquash += (0 - this.landSquash) * Math.min(1, dt * 14);
    this.blinkTimer -= dt;
    if (this.blinkTimer < -0.14) {
      this.blinkTimer = 2.0 + Math.random() * 4.0;
    }

    if (this.dying) {
      this.deathTimer -= dt;
    }

    // Check if floor under grounded worm was carved away
    if (this.grounded && !hasFloorBelow(this.x, this.y, terrain, 2.5)) {
      this.grounded = false;
    }

    if (!this.grounded) {
      this.airTime += dt;
      this.vy += GRAVITY * dt;
      if (this.vy > this.maxAirVy) {
        this.maxAirVy = this.vy;
      }

      const dist = Math.hypot(this.vx * dt, this.vy * dt);
      const substeps = Math.max(1, Math.ceil(dist / 2.5));
      const sdt = dt / substeps;

      for (let s = 0; s < substeps; s++) {
        const nx = clamp(this.x + this.vx * sdt, WORM_RADIUS + 2, WORLD_W - WORM_RADIUS - 2);
        const ny = this.y + this.vy * sdt;

        if (!isWormColliding(nx, ny, terrain)) {
          this.x = nx;
          this.y = ny;
        } else {
          // Resolve collision along surface normal
          const n = terrain.getSurfaceNormal(nx, ny, 6);
          const vn = this.vx * n.x + this.vy * n.y;
          const speed = Math.hypot(this.vx, this.vy);

          if (n.y < -0.42 && this.vy >= 0) {
            // Landed on floor
            // Nudge up slightly so we aren't stuck inside terrain
            for (let up = 0; up <= 4; up++) {
              if (!isWormColliding(this.x, this.y - up, terrain)) {
                this.y -= up;
                break;
              }
            }
            let tookFallDamage = false;
            if (this.maxAirVy > FALL_DAMAGE_VEL && !this.dying) {
              const fallDmg = clamp(Math.round((this.maxAirVy - FALL_DAMAGE_VEL) * FALL_DAMAGE_SCALE), 5, 45);
              this.applyDamage(fallDmg, 0, 0);
              callbacks.onFallDamage?.(this, fallDmg);
              tookFallDamage = true;
            }
            const controlledLanding = this.jumpKind !== null && !tookFallDamage;
            if (!controlledLanding && speed > 200 && this.vy > 175) {
              this.vy = -this.vy * 0.22;
              this.vx *= 0.5;
            } else {
              this.vx = 0;
              this.vy = 0;
              this.grounded = true;
              this.maxAirVy = 0;
              this.landSquash = controlledLanding ? 0.22 : 0.2;
              if (this.jumpKind !== null) {
                this.jumpCooldown = 0.16;
              }
              this.jumpKind = null;
              this.airTime = 0;
              break;
            }
          } else if (vn < 0) {
            // Bounce off wall or ceiling
            const bounce = 0.34;
            this.vx -= (1 + bounce) * vn * n.x;
            this.vy -= (1 + bounce) * vn * n.y;
            this.vx *= 0.76;
            // Push slightly along normal to clear overlap
            if (!isWormColliding(this.x + n.x * 1.5, this.y + n.y * 1.5, terrain)) {
              this.x += n.x * 1.5;
              this.y += n.y * 1.5;
            }
            if (Math.hypot(this.vx, this.vy) < 28 && n.y < -0.2) {
              this.vx = 0;
              this.vy = 0;
              this.grounded = true;
              this.maxAirVy = 0;
              this.landSquash = 0.2;
              this.jumpKind = null;
              this.airTime = 0;
              break;
            }
          } else {
            this.vx *= 0.55;
            this.vy *= 0.55;
          }
          this.maxAirVy = Math.max(0, this.vy);
        }

        if (this.y > waterY) {
          this.alive = false;
          this.dying = false;
          this.drowning = true;
          this.hp = 0;
          callbacks.onDrown?.(this);
          return;
        }
      }
    } else {
      // Gentle friction when grounded
      this.vx = 0;
      this.vy = 0;
      this.maxAirVy = 0;
      if (this.y > waterY) {
        this.alive = false;
        this.dying = false;
        this.drowning = true;
        this.hp = 0;
        callbacks.onDrown?.(this);
        return;
      }
    }

    if (this.dying && this.deathTimer <= 0) {
      this.alive = false;
      this.dying = false;
      callbacks.onFarewell?.(this);
    }
  }
}

export class Projectile {
  constructor(opts) {
    this.type = opts.type;
    this.ownerId = opts.ownerId ?? -1;
    this.teamIndex = opts.teamIndex ?? 0;
    this.x = opts.x;
    this.y = opts.y;
    this.vx = opts.vx;
    this.vy = opts.vy;
    this.radius = opts.radius ?? 4;
    this.damage = opts.damage ?? 45;
    this.blastRadius = opts.blastRadius ?? 48;
    this.knockback = opts.knockback ?? 350;
    this.windAffected = Boolean(opts.windAffected);
    this.fuseable = Boolean(opts.fuseable);
    this.fuse = opts.fuse ?? 0;
    this.restitution = opts.restitution ?? 0.34;
    this.groundFriction = opts.groundFriction ?? 0.68;
    this.targetX = opts.targetX ?? null;
    this.targetY = opts.targetY ?? null;
    this.age = 0;
    this.maxLifetime = opts.maxLifetime ?? 15;
    this.trailAccum = 0;
    this.holyChoirPlayed = false;
    this.alive = true;
    this.angle = Math.atan2(this.vy, this.vx);
  }

  step(dt, terrain, wind, waterY, worms, callbacks = {}) {
    if (!this.alive) return;
    this.age += dt;
    if (this.age >= this.maxLifetime) {
      this.alive = false;
      if (this.fuseable || this.type === 'holy' || this.type === 'dynamite') {
        callbacks.onExplode?.(this);
      }
      return;
    }

    if (this.fuse > 0) {
      this.fuse -= dt;
      if (this.type === 'holy' && !this.holyChoirPlayed && this.fuse <= 1.15) {
        this.holyChoirPlayed = true;
        callbacks.onHolyChoir?.(this);
      }
      if (this.fuse <= 0) {
        this.alive = false;
        callbacks.onExplode?.(this);
        return;
      }
    }

    // Apply physics forces
    if (this.type === 'homing' && this.age > 0.3 && this.targetX !== null && this.targetY !== null) {
      const dx = this.targetX - this.x;
      const dy = this.targetY - this.y;
      const desiredAngle = Math.atan2(dy, dx);
      const speed = Math.max(320, Math.hypot(this.vx, this.vy));
      let curAngle = Math.atan2(this.vy, this.vx);
      let diff = desiredAngle - curAngle;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      const maxTurn = 4.6 * dt;
      curAngle += clamp(diff, -maxTurn, maxTurn);
      const targetSpeed = Math.min(540, speed + 140 * dt);
      this.vx = Math.cos(curAngle) * targetSpeed;
      this.vy = Math.sin(curAngle) * targetSpeed;
    } else if (this.type !== 'uzi_bullet' && this.type !== 'handgun_bullet' && this.type !== 'fireball') {
      if (this.windAffected) {
        this.vx += wind * WIND_ACCEL_SCALE * dt;
      }
      if (
        callbacks.magnets &&
        (this.type === 'bazooka' ||
          this.type === 'grenade' ||
          this.type === 'cluster' ||
          this.type === 'mortar' ||
          this.type === 'mortar_shrapnel' ||
          this.type === 'airstrike_bomb')
      ) {
        for (const mag of callbacks.magnets) {
          if (!mag.alive) continue;
          const dx = mag.x - this.x;
          const dy = mag.y - this.y;
          const d = Math.hypot(dx, dy);
          if (d > 6 && d < 205) {
            const pull = 390 * (1 - d / 205);
            this.vx += (dx / d) * pull * dt;
            this.vy += (dy / d) * pull * dt;
          }
        }
      }
      this.vy += GRAVITY * dt;
    }

    const dist = Math.hypot(this.vx * dt, this.vy * dt);
    const substeps = Math.max(1, Math.ceil(dist / 3));
    const sdt = dt / substeps;
    const isBouncy =
      this.type === 'grenade' ||
      this.type === 'cluster' ||
      this.type === 'banana' ||
      this.type === 'banana_bomblet' ||
      this.type === 'holy' ||
      this.type === 'dynamite' ||
      this.type === 'mortar_shrapnel' ||
      this.type === 'fire_ember';

    for (let s = 0; s < substeps; s++) {
      const nx = this.x + this.vx * sdt;
      const ny = this.y + this.vy * sdt;

      if (nx < -120 || nx > WORLD_W + 120) {
        this.alive = false;
        return;
      }
      if (ny > waterY) {
        this.alive = false;
        callbacks.onWaterSplash?.(this);
        return;
      }

      // Worm impact check for impact projectiles & burning embers
      if (!isBouncy || this.type === 'fire_ember') {
        for (let i = 0; i < worms.length; i++) {
          const w = worms[i];
          if (!w.alive) continue;
          if (w.id === this.ownerId && this.age < 0.18) continue;
          if (Math.hypot(nx - w.x, ny - w.y) <= WORM_RADIUS + this.radius) {
            this.x = nx;
            this.y = ny;
            this.alive = false;
            callbacks.onExplode?.(this);
            return;
          }
        }
      }

      // Terrain check
      if (terrain.isSolid(nx, ny)) {
        if (!isBouncy) {
          this.x = nx;
          this.y = ny;
          this.alive = false;
          callbacks.onExplode?.(this);
          return;
        }
        const n = terrain.getSurfaceNormal(nx, ny, 5);
        const vn = this.vx * n.x + this.vy * n.y;
        const speed = Math.hypot(this.vx, this.vy);
        if (this.type === 'dynamite') {
          this.vx *= 0.2;
          this.vy = 0;
        } else if (vn < 0) {
          const tx = this.vx - vn * n.x;
          const ty = this.vy - vn * n.y;
          let rebound = -vn * this.restitution;
          if (rebound < 36) rebound = 0;
          this.vx = tx * this.groundFriction + n.x * rebound;
          this.vy = ty * this.groundFriction + n.y * rebound;
          if (Math.abs(vn) > 55) {
            callbacks.onBounce?.(this, speed);
          }
          if (Math.hypot(this.vx, this.vy) < 32 && n.y < -0.45) {
            this.vx = 0;
            this.vy = 0;
          }
        } else {
          this.vx *= 0.45;
          this.vy *= 0.45;
        }
        break;
      } else {
        this.x = nx;
        this.y = ny;
      }
    }

    if (Math.hypot(this.vx, this.vy) > 12) {
      this.angle = Math.atan2(this.vy, this.vx);
    }

    this.trailAccum += dt;
    if (this.trailAccum >= 0.025) {
      this.trailAccum = 0;
      callbacks.onTrail?.(this);
    }
  }
}

export class Mine {
  constructor(x, y, armDelay = 0) {
    this.x = x;
    this.y = y;
    this.vy = 0;
    this.armDelay = armDelay;
    this.triggered = false;
    this.timer = 2.4;
    this.beepTimer = 0;
    this.alive = true;
  }

  step(dt, terrain, waterY, worms, callbacks = {}) {
    if (!this.alive) return;
    if (this.armDelay > 0) this.armDelay = Math.max(0, this.armDelay - dt);

    if (!terrain.isSolid(this.x, this.y + 6)) {
      this.vy += GRAVITY * dt;
      const ny = this.y + this.vy * dt;
      if (terrain.isSolid(this.x, ny + 5)) {
        this.vy = 0;
      } else {
        this.y = ny;
      }
    } else {
      this.vy = 0;
    }

    if (this.y > waterY) {
      this.alive = false;
      return;
    }

    if (!this.triggered) {
      if (this.armDelay > 0) return;
      for (const w of worms) {
        if (!w.alive || w.dying) continue;
        if (Math.hypot(w.x - this.x, w.y - this.y) <= 34) {
          this.triggered = true;
          callbacks.onTrigger?.(this);
          break;
        }
      }
    } else {
      this.timer -= dt;
      this.beepTimer -= dt;
      if (this.beepTimer <= 0) {
        this.beepTimer = Math.max(0.14, this.timer * 0.25);
        callbacks.onBeep?.(this);
      }
      if (this.timer <= 0) {
        this.alive = false;
        callbacks.onExplode?.(this);
      }
    }
  }
}

export class Barrel {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vy = 0;
    this.hp = 20;
    this.alive = true;
  }

  step(dt, terrain, waterY, callbacks = {}) {
    if (!this.alive) return;
    if (!terrain.isSolid(this.x, this.y + 11)) {
      this.vy += GRAVITY * dt;
      const ny = this.y + this.vy * dt;
      if (terrain.isSolid(this.x, ny + 10)) {
        this.vy = 0;
      } else {
        this.y = ny;
      }
    } else {
      this.vy = 0;
    }

    if (this.y > waterY) {
      this.alive = false;
      callbacks.onSplash?.(this);
    }
  }
}

export class Crate {
  constructor(x, y, kind = 'weapon', payload = null) {
    this.x = x;
    this.y = y;
    this.kind = kind; // 'health' | 'weapon'
    this.payload = payload;
    this.landed = false;
    this.swayPhase = Math.random() * Math.PI * 2;
    this.alive = true;
  }

  step(dt, terrain, wind, waterY, worms, callbacks = {}) {
    if (!this.alive) return;
    this.swayPhase += dt * 3.2;

    if (!this.landed) {
      this.x = clamp(this.x + wind * 0.28 * dt, 40, WORLD_W - 40);
      this.y += 50 * dt;
      if (terrain.isSolid(this.x, this.y + 11)) {
        this.landed = true;
      }
    } else if (!terrain.isSolid(this.x, this.y + 12)) {
      this.y += 140 * dt;
    }

    if (this.y > waterY) {
      this.alive = false;
      callbacks.onSplash?.(this);
      return;
    }

    for (const w of worms) {
      if (!w.alive || w.dying) continue;
      if (Math.hypot(w.x - this.x, w.y - this.y) <= 24) {
        this.alive = false;
        callbacks.onPickup?.(this, w);
        return;
      }
    }
  }
}

export class Grave {
  constructor(x, y, teamIndex, name) {
    this.x = x;
    this.y = y;
    this.teamIndex = teamIndex;
    this.name = name;
    this.vy = 0;
    this.alive = true;
  }

  step(dt, terrain, waterY) {
    if (!this.alive) return;
    if (!terrain.isSolid(this.x, this.y + 10)) {
      this.vy += GRAVITY * dt;
      const ny = this.y + this.vy * dt;
      if (terrain.isSolid(this.x, ny + 9)) {
        this.vy = 0;
      } else {
        this.y = ny;
      }
    } else {
      this.vy = 0;
    }
    if (this.y > waterY + 20) {
      this.alive = false;
    }
  }
}

export class Walker {
  constructor(opts) {
    this.kind = opts.kind || 'sheep'; // 'sheep' | 'supersheep' | 'cow'
    this.ownerId = opts.ownerId ?? -1;
    this.teamIndex = opts.teamIndex ?? 0;
    this.x = opts.x;
    this.y = opts.y;
    this.dir = opts.dir >= 0 ? 1 : -1;
    this.vx = this.dir * (this.kind === 'cow' ? 140 : 95);
    this.vy = -80;
    this.fuse = opts.fuse ?? (this.kind === 'cow' ? 5.5 : this.kind === 'supersheep' ? 7.0 : 6.0);
    this.damage = opts.damage ?? 75;
    this.blastRadius = opts.blastRadius ?? 70;
    this.knockback = opts.knockback ?? 460;
    this.flying = false;
    this.flyAngle = this.dir >= 0 ? -0.45 : -Math.PI + 0.45;
    this.hopTimer = 0.35;
    this.age = 0;
    this.alive = true;
  }

  activateFlight() {
    if (this.kind !== 'supersheep' || this.flying) return false;
    this.flying = true;
    this.flyAngle = this.dir >= 0 ? -0.55 : -Math.PI + 0.55;
    return true;
  }

  step(dt, terrain, waterY, worms, input = {}, callbacks = {}) {
    if (!this.alive) return;
    this.age += dt;
    this.fuse -= dt;
    if (this.fuse <= 0) {
      this.alive = false;
      callbacks.onExplode?.(this);
      return;
    }

    if (this.flying) {
      if (input.left) this.flyAngle -= 3.8 * dt;
      if (input.right) this.flyAngle += 3.8 * dt;
      const speed = 270;
      const vx = Math.cos(this.flyAngle) * speed;
      const vy = Math.sin(this.flyAngle) * speed;
      const steps = Math.max(1, Math.ceil((speed * dt) / 3));
      const sdt = dt / steps;
      for (let s = 0; s < steps; s++) {
        this.x += vx * sdt;
        this.y += vy * sdt;
        if (this.x < -80 || this.x > WORLD_W + 80 || this.y < -200) {
          this.alive = false;
          return;
        }
        if (this.y > waterY) {
          this.alive = false;
          callbacks.onWaterSplash?.(this);
          return;
        }
        if (terrain.isSolid(this.x, this.y)) {
          this.alive = false;
          callbacks.onExplode?.(this);
          return;
        }
        for (const w of worms) {
          if (!w.alive) continue;
          if (w.id === this.ownerId && this.age < 0.25) continue;
          if (Math.hypot(this.x - w.x, this.y - w.y) <= WORM_RADIUS + 8) {
            this.alive = false;
            callbacks.onExplode?.(this);
            return;
          }
        }
      }
      if (Math.random() < 0.5) callbacks.onTrail?.(this);
      return;
    }

    // Grounded walking / hopping AI for sheep, supersheep, and cows
    const walkSpeed = this.kind === 'cow' ? 142 : 98;
    const grounded = terrain.isSolid(this.x, this.y + 10) || terrain.isSolid(this.x, this.y + 12);

    if (grounded) {
      this.hopTimer -= dt;
      if (this.hopTimer <= 0) {
        this.vy = this.kind === 'cow' ? -110 : -155;
        this.hopTimer = this.kind === 'cow' ? 0.55 : 0.42;
      } else {
        this.vy = 0;
      }
      const stepX = this.dir * walkSpeed * dt;
      const nx = clamp(this.x + stepX, 14, WORLD_W - 14);
      let blocked = false;
      if (!terrain.isSolid(nx, this.y)) {
        this.x = nx;
      } else {
        let climbed = false;
        for (let up = 1; up <= 11; up++) {
          if (!terrain.isSolid(nx, this.y - up)) {
            this.x = nx;
            this.y -= up;
            climbed = true;
            break;
          }
        }
        if (!climbed) blocked = true;
      }
      if (blocked || nx <= 16 || nx >= WORLD_W - 16) {
        if (this.kind === 'cow') {
          this.alive = false;
          callbacks.onExplode?.(this);
          return;
        }
        this.dir *= -1;
      }
    } else {
      this.vy += GRAVITY * dt;
      const nx = clamp(this.x + this.dir * walkSpeed * 0.75 * dt, 10, WORLD_W - 10);
      const ny = this.y + this.vy * dt;
      if (terrain.isSolid(nx, ny + 8) && this.vy > 0) {
        this.vy = 0;
        this.x = nx;
      } else if (terrain.isSolid(nx, ny)) {
        this.dir *= -1;
      } else {
        this.x = nx;
        this.y = ny;
      }
    }

    if (this.y > waterY) {
      this.alive = false;
      callbacks.onWaterSplash?.(this);
      return;
    }

    if (this.kind === 'cow' && this.age > 0.25) {
      for (const w of worms) {
        if (!w.alive) continue;
        if (w.id === this.ownerId && this.age < 0.6) continue;
        if (Math.hypot(this.x - w.x, this.y - w.y) <= WORM_RADIUS + 10) {
          this.alive = false;
          callbacks.onExplode?.(this);
          return;
        }
      }
    }
  }
}

export class MagnetProp {
  constructor(x, y, teamIndex = 0, turnsLeft = 4) {
    this.x = x;
    this.y = y;
    this.vy = 0;
    this.teamIndex = teamIndex;
    this.turnsLeft = turnsLeft;
    this.alive = true;
  }

  step(dt, terrain, waterY) {
    if (!this.alive) return;
    if (!terrain.isSolid(this.x, this.y + 10)) {
      this.vy += GRAVITY * dt;
      const ny = this.y + this.vy * dt;
      if (terrain.isSolid(this.x, ny + 9)) {
        this.vy = 0;
      } else {
        this.y = ny;
      }
    } else {
      this.vy = 0;
    }
    if (this.y > waterY) {
      this.alive = false;
    }
  }
}
