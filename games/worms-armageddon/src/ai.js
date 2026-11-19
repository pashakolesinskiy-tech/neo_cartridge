import { GRAVITY, PHASES, WIND_ACCEL_SCALE, WORLD_W, WORM_RADIUS } from './constants.js';
import { WEAPON_MAP } from './weapons.js';

function clamp(v, lo, hi) {
  return v < lo ? lo : v > hi ? hi : v;
}

export class AIController {
  constructor(difficulty = 'normal') {
    this.difficulty = difficulty;
    this.stage = 'IDLE'; // IDLE | THINKING | MOVING | AIMING | CHARGING | FOLLOWUP | DONE
    this.stageTimer = 0;
    this.plan = null;
    this.moveDir = 0;
  }

  reset(difficulty = this.difficulty) {
    this.difficulty = difficulty;
    this.stage = 'THINKING';
    this.stageTimer = 0.4;
    this.plan = null;
    this.moveDir = 0;
  }

  static checkLineOfSight(terrain, x0, y0, x1, y1, step = 4) {
    const dx = x1 - x0;
    const dy = y1 - y0;
    const dist = Math.hypot(dx, dy);
    if (dist < 1) return true;
    const steps = Math.ceil(dist / step);
    for (let i = 2; i < steps; i++) {
      const t = i / steps;
      const sx = x0 + dx * t;
      const sy = y0 + dy * t;
      if (terrain.isSolid(sx, sy)) return false;
    }
    return true;
  }

  static solveBallisticShot(shooter, target, terrain, wind, weapon, allWorms = []) {
    const dx = target.x - shooter.x;
    const preferredFacing = dx >= 0 ? 1 : -1;
    const speedMin = weapon.speedMin ?? 210;
    const speedMax = weapon.speedMax ?? 760;

    let best = null;
    let bestScore = Infinity;

    const pitchAngles = [-1.22, -0.98, -0.76, -0.56, -0.38, -0.2, -0.04, 0.14];
    const powers = [0.22, 0.36, 0.5, 0.64, 0.78, 0.92];
    const facings = [preferredFacing, -preferredFacing];

    for (const facing of facings) {
      // Only test reverse facing with high arcs in case overhanging roof blocks direct shot
      const angles = facing === preferredFacing ? pitchAngles : [-1.25, -1.05];
      for (const pitch of angles) {
        const worldAngle = facing >= 0 ? pitch : Math.PI - pitch;
        const cosA = Math.cos(worldAngle);
        const sinA = Math.sin(worldAngle);
        const startX = shooter.x + cosA * 15;
        const startY = shooter.y + sinA * 15 - 2;

        for (const power of powers) {
          const speed = speedMin + (speedMax - speedMin) * power;
          let x = startX;
          let y = startY;
          let vx = cosA * speed;
          let vy = sinA * speed;
          let minDist = Math.hypot(x - target.x, y - target.y);
          let impactX = x;
          let impactY = y;
          let hitFriendlyFirst = false;

          const dtSim = 0.04;
          const maxSteps = 105; // 4.2s
          let hitStep = maxSteps;
          for (let s = 0; s < maxSteps; s++) {
            if (weapon.windAffected) {
              vx += wind * WIND_ACCEL_SCALE * dtSim;
            }
            vy += GRAVITY * dtSim;
            x += vx * dtSim;
            y += vy * dtSim;

            if (x < -40 || x > WORLD_W + 40 || y > 880) {
              hitStep = s;
              break;
            }

            const d = Math.hypot(x - target.x, y - target.y);
            if (d < minDist) minDist = d;

            if (s > 3) {
              for (let wi = 0; wi < allWorms.length; wi++) {
                const w = allWorms[wi];
                if (!w.alive || w.id === shooter.id) continue;
                if (Math.hypot(x - w.x, y - w.y) <= WORM_RADIUS + 6) {
                  if (w.teamIndex === shooter.teamIndex) {
                    hitFriendlyFirst = true;
                  }
                  impactX = x;
                  impactY = y;
                  hitStep = s;
                  s = maxSteps;
                  break;
                }
              }
            }

            if (s < maxSteps && terrain.isSolid(x, y)) {
              impactX = x;
              impactY = y;
              hitStep = s;
              break;
            }
          }

          const impactDist = Math.hypot(impactX - target.x, impactY - target.y);
          const selfDist = Math.hypot(impactX - shooter.x, impactY - shooter.y);
          let score = Math.min(impactDist, minDist * 1.15);
          if (hitFriendlyFirst) score += 260;
          if (selfDist < (weapon.blastRadius || 45) * 0.95) score += 220;

          if (score < bestScore) {
            bestScore = score;
            best = {
              weaponId: weapon.id,
              facing,
              pitch,
              power,
              flightTime: (hitStep + 1) * dtSim,
              missDist: impactDist,
              score,
            };
          }
        }
      }
    }

    return best;
  }

  _chooseTarget(shooter, worms, waterY) {
    const enemies = worms.filter((w) => w.alive && !w.dying && w.teamIndex !== shooter.teamIndex);
    if (enemies.length === 0) return null;

    let best = enemies[0];
    let bestWeight = -Infinity;
    for (const e of enemies) {
      const dist = Math.hypot(e.x - shooter.x, e.y - shooter.y);
      const nearWaterBonus = e.y > waterY - 85 ? 45 : 0;
      const lowHpBonus = (100 - Math.min(100, e.hp)) * 0.8;
      const weight = 300 - dist * 0.25 + nearWaterBonus + lowHpBonus;
      if (weight > bestWeight) {
        bestWeight = weight;
        best = e;
      }
    }
    return best;
  }

  _computePlan(engine, shooter) {
    const team = engine.teams[shooter.teamIndex];
    const inv = team.inventory;
    const target = this._chooseTarget(shooter, engine.worms, engine.waterY);
    if (!target) {
      return { weaponId: 'bazooka', facing: 1, pitch: -0.4, power: 0.5, mode: 'ballistic' };
    }

    const dx = target.x - shooter.x;
    const dy = target.y - shooter.y;
    const dist = Math.hypot(dx, dy);
    const facing = dx >= 0 ? 1 : -1;

    // 1. Melee Baseball Bat / Dragon Punch if super close!
    if (dist <= 34 && inv.bat > 0) {
      return {
        weaponId: 'bat',
        facing,
        pitch: -0.45,
        power: 1,
        mode: 'instant',
      };
    }
    if (dist <= 36 && inv.punch > 0) {
      return {
        weaponId: 'punch',
        facing,
        pitch: -0.4,
        power: 1,
        mode: 'instant',
      };
    }

    // 2. Hitscan Shotgun or Straight Fireball if clear line of sight and reasonable range
    const hasLOS =
      dist <= 460 &&
      AIController.checkLineOfSight(engine.terrain, shooter.x, shooter.y - 2, target.x, target.y - 2);
    if (dist <= 440 && inv.shotgun > 0 && hasLOS) {
      const horiz = Math.max(1, Math.abs(dx));
      const pitch = clamp(Math.atan2(dy, horiz), -Math.PI * 0.45, Math.PI * 0.42);
      return {
        weaponId: 'shotgun',
        facing,
        pitch,
        power: 1,
        mode: 'instant',
      };
    }
    if (inv.fireball > 0 && hasLOS && Math.random() < 0.45) {
      const horiz = Math.max(1, Math.abs(dx));
      const pitch = clamp(Math.atan2(dy, horiz), -Math.PI * 0.45, Math.PI * 0.42);
      return {
        weaponId: 'fireball',
        facing,
        pitch,
        power: 0.85,
        mode: 'instant',
      };
    }

    // 3. Ballistic options: Bazooka, Mortar, Frag Grenade, Cluster Bomb
    const candidates = [];
    if (inv.bazooka > 0) {
      const b = AIController.solveBallisticShot(
        shooter,
        target,
        engine.terrain,
        engine.wind,
        WEAPON_MAP.bazooka,
        engine.worms
      );
      if (b) candidates.push(b);
    }
    if (inv.mortar > 0 && Math.random() < 0.5) {
      const m = AIController.solveBallisticShot(
        shooter,
        target,
        engine.terrain,
        engine.wind,
        WEAPON_MAP.mortar,
        engine.worms
      );
      if (m) candidates.push(m);
    }
    if (inv.grenade > 0) {
      const g = AIController.solveBallisticShot(
        shooter,
        target,
        engine.terrain,
        engine.wind,
        WEAPON_MAP.grenade,
        engine.worms
      );
      if (g) candidates.push(g);
    }
    if (inv.cluster > 0 && Math.random() < 0.55) {
      const c = AIController.solveBallisticShot(
        shooter,
        target,
        engine.terrain,
        engine.wind,
        WEAPON_MAP.cluster,
        engine.worms
      );
      if (c) candidates.push(c);
    }

    candidates.sort((a, b) => a.score - b.score);
    const bestBallistic = candidates[0];

    // 4. Air Strike if ballistic shot is blocked and target has open sky
    if ((!bestBallistic || bestBallistic.missDist > 75) && inv.airstrike > 0) {
      const skyBlocked = engine.terrain.findGroundY(target.x, 20) < target.y - 25;
      if (!skyBlocked) {
        return {
          weaponId: 'airstrike',
          facing,
          pitch: -0.25,
          power: 1,
          targetX: target.x,
          targetY: target.y,
          mode: 'airstrike',
        };
      }
    }

    if (bestBallistic) {
      return {
        ...bestBallistic,
        mode: 'ballistic',
      };
    }

    return {
      weaponId: 'bazooka',
      facing,
      pitch: -0.45,
      power: 0.55,
      mode: 'ballistic',
    };
  }

  _applyJitter(plan) {
    const jitterByDiff = {
      easy: { angle: 0.16, power: 0.14 },
      normal: { angle: 0.065, power: 0.065 },
      hard: { angle: 0.02, power: 0.022 },
    };
    const j = jitterByDiff[this.difficulty] || jitterByDiff.normal;
    return {
      ...plan,
      pitch: clamp(plan.pitch + (Math.random() * 2 - 1) * j.angle, -Math.PI * 0.48, Math.PI * 0.42),
      power: clamp(plan.power + (Math.random() * 2 - 1) * j.power, 0.16, 0.98),
    };
  }

  _prepareAimStage(engine, shooter, rawPlan) {
    this.plan = this._applyJitter(rawPlan);
    engine.selectWeapon(this.plan.weaponId);
    const weapon = WEAPON_MAP[this.plan.weaponId];
    if (weapon?.fuseable) {
      const targetFuse = clamp(Math.ceil((this.plan.flightTime || 1.2) + 0.45), 1, 5);
      engine.setFuseSeconds(targetFuse);
    }
    shooter.facing = this.plan.facing;
    this.stage = 'AIMING';
    this.stageTimer = 0.5;
  }

  update(dt, engine) {
    const shooter = engine.getActiveWorm();
    if (!shooter || !shooter.alive || shooter.dying) return;

    // Emergency timeout safety: fire immediately if turn timer <= 4s
    if (engine.turnTimer <= 4.0 && this.stage !== 'CHARGING' && this.stage !== 'DONE') {
      if (!this.plan) {
        this.plan = this._applyJitter(this._computePlan(engine, shooter));
      }
      engine.selectWeapon(this.plan.weaponId);
      shooter.facing = this.plan.facing;
      shooter.aimPitch = this.plan.pitch;
      this._executePlanNow(engine, this.plan);
      this.stage = 'DONE';
      if (engine.phase === PHASES.PLAYER_TURN) {
        engine._enterResolving();
      }
      return;
    }

    if (this.stage === 'THINKING') {
      this.stageTimer -= dt;
      if (this.stageTimer <= 0) {
        const rawPlan = this._computePlan(engine, shooter);
        // Occasionally reposition slightly if ballistic shot was poor
        if (rawPlan.mode === 'ballistic' && rawPlan.missDist > 90 && Math.random() < 0.6) {
          this.moveDir = rawPlan.facing;
          this.stage = 'MOVING';
          this.stageTimer = 0.55;
        } else {
          this._prepareAimStage(engine, shooter, rawPlan);
        }
      }
      return;
    }

    if (this.stage === 'MOVING') {
      this.stageTimer -= dt;
      shooter.walk(this.moveDir, dt, engine.terrain);
      if (this.stageTimer <= 0) {
        this._prepareAimStage(engine, shooter, this._computePlan(engine, shooter));
      }
      return;
    }

    if (this.stage === 'AIMING') {
      this.stageTimer -= dt;
      shooter.facing = this.plan.facing;
      const diff = this.plan.pitch - shooter.aimPitch;
      shooter.aimPitch += diff * Math.min(1, dt * 8);

      if (this.stageTimer <= 0) {
        shooter.aimPitch = this.plan.pitch;
        if (this.plan.mode === 'ballistic') {
          engine.beginCharge();
          this.stage = 'CHARGING';
        } else {
          this._executePlanNow(engine, this.plan);
          if (engine.phase === PHASES.PLAYER_TURN && engine.shotsRemaining > 0) {
            this.stage = 'FOLLOWUP';
            this.stageTimer = 0.45;
          } else {
            this.stage = 'DONE';
          }
        }
      }
      return;
    }

    if (this.stage === 'FOLLOWUP') {
      this.stageTimer -= dt;
      if (this.stageTimer <= 0) {
        const target = this._chooseTarget(shooter, engine.worms, engine.waterY);
        if (target) {
          shooter.setAimFromWorldPoint(target.x, target.y);
        }
        engine.fireWeapon();
        if (engine.phase === PHASES.PLAYER_TURN && engine.shotsRemaining > 0) {
          this.stage = 'FOLLOWUP';
          this.stageTimer = 0.45;
        } else {
          this.stage = 'DONE';
        }
      }
      return;
    }

    if (this.stage === 'CHARGING') {
      if (engine.chargePower >= this.plan.power) {
        engine.releaseCharge();
        this.stage = 'DONE';
      }
      return;
    }

    if (this.stage === 'DONE' && engine.phase === PHASES.PLAYER_TURN) {
      engine._enterResolving();
    }
  }

  _executePlanNow(engine, plan) {
    if (plan.mode === 'airstrike') {
      engine.setPendingMapTarget(plan.targetX, plan.targetY);
      engine.fireWeapon();
    } else if (plan.mode === 'instant') {
      engine.fireWeapon();
    } else {
      engine.fireWeapon(plan.power);
    }
  }
}
