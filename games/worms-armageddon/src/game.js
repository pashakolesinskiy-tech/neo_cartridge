import { AIController } from './ai.js';
import { SoundEngine } from './audio.js';
import { Camera } from './camera.js';
import {
  BASE_WATER_Y,
  DT,
  GRAVITY,
  PHASES,
  TEAM_PALETTES,
  WORLD_H,
  WORLD_W,
  WORM_NAMES,
  WORM_RADIUS,
} from './constants.js';
import { Barrel, Crate, Grave, MagnetProp, Mine, Projectile, Walker, Worm, isWormColliding } from './entities.js';
import { ParticleSystem } from './particles.js';
import { Terrain } from './terrain.js';
import { WEAPON_MAP, WEAPONS, createDefaultInventory } from './weapons.js';

function clamp(v, lo, hi) {
  return v < lo ? lo : v > hi ? hi : v;
}

export class GameEngine {
  constructor(options = {}) {
    this.sound = options.sound || new SoundEngine();
    this.camera = new Camera();
    this.particles = new ParticleSystem();
    this.ai = new AIController('normal');

    this.terrain = new Terrain(WORLD_W, WORLD_H, 'meadow', 1337);
    this.phase = PHASES.SETUP;
    this.config = null;

    this.teams = [];
    this.worms = [];
    this.projectiles = [];
    this.mines = [];
    this.barrels = [];
    this.crates = [];
    this.graves = [];
    this.tracers = [];
    this.walkers = [];
    this.magnets = [];
    this.ropeState = null;
    this.cowQueue = null;
    this.airstrikePlane = null;
    this.burstQueue = null;
    this.drillTimer = 0;
    this.drillCarveAccum = 0;

    this.activeTeamIndex = 0;
    this.turnCount = 1;
    this.wind = 0;
    this.waterY = BASE_WATER_Y;
    this.suddenDeathActive = false;

    this.turnTimer = 45;
    this.lastBeepSecond = -1;
    this.retreatTimer = 0;
    this.resolvingTimer = 0;
    this.settleTimer = 0;
    this.transitionTimer = 0;

    this.selectedWeaponId = 'bazooka';
    this.fuseSeconds = 3;
    this.shotsRemaining = 1;
    this.chargePower = 0;
    this.chargeDir = 1;

    this.pendingMapTarget = null;
    this.airstrikeDir = 1;
    this.girderAngle = 0;
    this.hoverWorldX = WORLD_W * 0.5;
    this.hoverWorldY = WORLD_H * 0.4;

    this.jetpackFuel = 100;
    this.jetpackThrusting = false;
    this.blowtorchTimer = 0;
    this.blowtorchCarveAccum = 0;

    this.input = {
      left: false,
      right: false,
      up: false,
      down: false,
    };

    this.bannerText = '';
    this.bannerColor = '#ffffff';
    this.bannerTimer = 0;
    this.winnerTeamIndex = -1;
    this.matchStats = {
      totalTurns: 0,
      topDamageTeam: null,
      biggestHit: { wormName: '-', damage: 0 },
      cratePickups: 0,
    };

    this.onHudUpdate = options.onHudUpdate || null;
    this.onGameOver = options.onGameOver || null;
    this.onNetEvent = options.onNetEvent || null;
    this.netRole = 'local'; // 'local' | 'host' | 'guest'
    this.localTeamIndex = -1;
    this.paused = false;
    this._hudAccum = 0;
    this._accumulator = 0;
  }

  setNetworkMode(role = 'local', localTeamIndex = -1) {
    this.netRole = role;
    this.localTeamIndex = localTeamIndex;
  }

  canLocalPlayerControl() {
    const team = this.teams[this.activeTeamIndex];
    if (!team || team.isAI) return false;
    if (this.netRole === 'host') return this.activeTeamIndex === 0;
    if (this.netRole === 'guest') return this.activeTeamIndex === 1;
    return true;
  }

  _emitNet(msg) {
    if (this.netRole === 'host' && this.onNetEvent) {
      this.onNetEvent(msg);
    }
  }

  _emitFx(fx) {
    this._emitNet({ type: 'fx_event', fx });
  }

  _emitSound(name, arg = null) {
    this._emitFx({ kind: 'sound', name, arg });
  }

  startMatch(config) {
    const seed = config.seed ?? Math.floor(Math.random() * 9999999);
    const theme = config.theme || 'meadow';
    const wormsPerTeam = clamp(Number(config.wormsPerTeam) || 3, 1, 5);
    const startHp = clamp(Number(config.startHp) || 100, 50, 300);
    const turnTime = clamp(Number(config.turnTime) || 45, 15, 90);
    const suddenDeathTurns =
      config.suddenDeathTurns === 0 || config.suddenDeathTurns === 'off'
        ? Infinity
        : Number(config.suddenDeathTurns) || 12;

    this.config = {
      theme,
      seed,
      wormsPerTeam,
      startHp,
      turnTime,
      suddenDeathTurns,
      teams: config.teams || [
        { name: TEAM_PALETTES[0].name, isAI: false, aiDifficulty: 'normal' },
        { name: TEAM_PALETTES[1].name, isAI: true, aiDifficulty: 'normal' },
      ],
    };

    this.terrain = new Terrain(WORLD_W, WORLD_H, theme, seed);
    this.particles.clear();
    this.worms = [];
    this.projectiles = [];
    this.mines = [];
    this.barrels = [];
    this.crates = [];
    this.graves = [];
    this.tracers = [];
    this.walkers = [];
    this.magnets = [];
    this.ropeState = null;
    this.cowQueue = null;
    this.airstrikePlane = null;
    this.burstQueue = null;
    this.drillTimer = 0;
    this.drillCarveAccum = 0;

    this.waterY = BASE_WATER_Y;
    this.suddenDeathActive = false;
    this.turnCount = 1;
    this.winnerTeamIndex = -1;
    this.matchStats = {
      totalTurns: 1,
      biggestHit: { wormName: '-', damage: 0 },
      cratePickups: 0,
    };

    this.teams = this.config.teams.map((t, idx) => ({
      index: idx,
      name: t.name || TEAM_PALETTES[idx].name,
      palette: TEAM_PALETTES[idx],
      isAI: Boolean(t.isAI),
      aiDifficulty: t.aiDifficulty || 'normal',
      inventory: createDefaultInventory(),
      nextWormCursor: 0,
      damageDealt: 0,
      kills: 0,
    }));

    // Spawn worms + mines + barrels
    const totalWorms = this.teams.length * wormsPerTeam;
    const spawns = this.terrain.findSafeSpawns(totalWorms + 7, 130, this.waterY);
    let spawnIdx = 0;
    let wormId = 1;

    for (let wi = 0; wi < wormsPerTeam; wi++) {
      for (let ti = 0; ti < this.teams.length; ti++) {
        const pt = spawns[spawnIdx++];
        const name = WORM_NAMES[(wormId - 1) % WORM_NAMES.length];
        const facing = pt.x < WORLD_W * 0.5 ? 1 : -1;
        this.worms.push(
          new Worm({
            id: wormId++,
            name,
            teamIndex: ti,
            x: pt.x,
            y: pt.y,
            hp: startHp,
            facing,
          })
        );
      }
    }

    for (let m = 0; m < 4 && spawnIdx < spawns.length; m++) {
      const pt = spawns[spawnIdx++];
      this.mines.push(new Mine(pt.x, pt.y + 4));
    }
    for (let b = 0; b < 3 && spawnIdx < spawns.length; b++) {
      const pt = spawns[spawnIdx++];
      this.barrels.push(new Barrel(pt.x, pt.y));
    }

    this.activeTeamIndex = 0;
    this.wind = Math.round((this.terrain.rng() * 2 - 1) * 85);
    this._beginActiveTeamTurn(true);
  }

  getTeamWorms(teamIndex, aliveOnly = true) {
    return this.worms.filter(
      (w) => w.teamIndex === teamIndex && (!aliveOnly || (w.alive && !w.dying))
    );
  }

  getTeamTotalHp(teamIndex) {
    let total = 0;
    for (const w of this.worms) {
      if (w.teamIndex === teamIndex && w.alive) total += Math.max(0, w.hp);
    }
    return total;
  }

  getActiveWorm() {
    const team = this.teams[this.activeTeamIndex];
    if (!team) return null;
    if (team.activeWormId) {
      const w = this.worms.find((wm) => wm.id === team.activeWormId && wm.alive);
      if (w) return w;
    }
    const living = this.getTeamWorms(this.activeTeamIndex, true);
    return living[0] || null;
  }

  _beginActiveTeamTurn(immediateCamera = false) {
    const team = this.teams[this.activeTeamIndex];
    const living = this.getTeamWorms(this.activeTeamIndex, true);
    if (!team || living.length === 0) {
      this._advanceTurn();
      return;
    }

    const chosen = living[team.nextWormCursor % living.length];
    team.nextWormCursor = (team.nextWormCursor + 1) % living.length;
    team.activeWormId = chosen.id;

    this.phase = PHASES.PLAYER_TURN;
    this.turnTimer = this.config.turnTime;
    this.lastBeepSecond = -1;
    this.chargePower = 0;
    this.chargeDir = 1;
    this.pendingMapTarget = null;
    this.burstQueue = null;
    this.cowQueue = null;
    this.ropeState = null;
    this.airstrikePlane = null;

    // Ensure currently selected weapon still has ammo
    if ((team.inventory[this.selectedWeaponId] ?? 0) <= 0) {
      this.selectedWeaponId = 'bazooka';
    }
    const weapon = WEAPON_MAP[this.selectedWeaponId] || WEAPONS[0];
    this.shotsRemaining = weapon.shotsPerTurn || 1;
    this.fuseSeconds = weapon.defaultFuse || 3;

    this.input = { left: false, right: false, up: false, down: false };
    this.camera.clearManualHold();
    this.camera.focus(chosen.x, chosen.y - 20, immediateCamera);

    this.showBanner(`${team.name} — ход: ${chosen.name}`, team.palette.color, 2.2);

    if (team.isAI) {
      this.ai.reset(team.aiDifficulty);
    }
    this.onHudUpdate?.(this);
  }

  showBanner(text, color = '#ffffff', duration = 2.0) {
    this.bannerText = text;
    this.bannerColor = color;
    this.bannerTimer = duration;
  }

  selectWeapon(weaponId) {
    if (this.phase !== PHASES.PLAYER_TURN) return false;
    const team = this.teams[this.activeTeamIndex];
    const weapon = WEAPON_MAP[weaponId];
    if (!team || !weapon) return false;
    const ammo = team.inventory[weaponId] ?? 0;
    if (ammo <= 0) return false;

    this.selectedWeaponId = weaponId;
    this.shotsRemaining = weapon.shotsPerTurn || 1;
    if (weapon.fuseable) {
      this.fuseSeconds = clamp(this.fuseSeconds || weapon.defaultFuse, 1, 5);
    }
    this.pendingMapTarget = null;
    this.chargePower = 0;

    if (weapon.targetMode === 'jetpack') {
      this._activateJetpack();
    } else if (weapon.targetMode === 'blowtorch') {
      this._activateBlowtorch();
    } else if (weapon.targetMode === 'drill') {
      this._activateDrill();
    } else {
      this.sound.playClick();
    }
    this.onHudUpdate?.(this);
    return true;
  }

  setFuseSeconds(sec) {
    const weapon = WEAPON_MAP[this.selectedWeaponId];
    if (weapon && weapon.fuseable) {
      this.fuseSeconds = clamp(Math.round(sec), 1, 5);
      this.sound.playClick();
      this.onHudUpdate?.(this);
    }
  }

  setPendingMapTarget(wx, wy) {
    this.pendingMapTarget = { x: wx, y: wy };
    this.sound.playClick();
    this.onHudUpdate?.(this);
  }

  _consumeAmmo(weaponId) {
    const team = this.teams[this.activeTeamIndex];
    if (!team) return;
    if (Number.isFinite(team.inventory[weaponId])) {
      team.inventory[weaponId] = Math.max(0, team.inventory[weaponId] - 1);
    }
  }

  beginCharge() {
    if (this.phase !== PHASES.PLAYER_TURN) return false;
    const weapon = WEAPON_MAP[this.selectedWeaponId];
    if (!weapon) return false;

    if (weapon.id === 'homing' && !this.pendingMapTarget) {
      this.showBanner('Сначала нажмите на карту, чтобы захватить цель самонаводящейся ракеты!', '#48dbfb', 1.6);
      return false;
    }

    if (!weapon.chargeable) {
      return this.fireWeapon(1);
    }

    this.phase = PHASES.CHARGING;
    this.chargePower = 0.08;
    this.chargeDir = 1;
    return true;
  }

  releaseCharge() {
    if (this.phase !== PHASES.CHARGING) return false;
    const power = clamp(this.chargePower, 0.08, 1);
    this.chargePower = 0;
    return this.fireWeapon(power);
  }

  fireWeapon(power = 0.7) {
    if (this.phase !== PHASES.PLAYER_TURN && this.phase !== PHASES.CHARGING) return false;
    const worm = this.getActiveWorm();
    const team = this.teams[this.activeTeamIndex];
    const weapon = WEAPON_MAP[this.selectedWeaponId];
    if (!worm || !team || !weapon) return false;

    const ammo = team.inventory[weapon.id] ?? 0;
    if (ammo <= 0) return false;

    const angle = worm.getAimWorldAngle();
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);
    const muzzleX = worm.x + cosA * 15;
    const muzzleY = worm.y + sinA * 15 - 2;

    if (weapon.id === 'shotgun') {
      this._fireShotgun(worm, muzzleX, muzzleY, cosA, sinA, weapon);
      this.shotsRemaining--;
      if (this.shotsRemaining <= 0) {
        this._consumeAmmo(weapon.id);
        if (team.isAI) {
          this._enterResolving();
        } else {
          this.phase = PHASES.RETREAT;
          this.retreatTimer = weapon.retreatTime;
        }
      } else {
        this.phase = PHASES.PLAYER_TURN;
      }
      this.onHudUpdate?.(this);
      return true;
    }

    if (weapon.id === 'uzi' || weapon.id === 'handgun') {
      this._consumeAmmo(weapon.id);
      const isHandgun = weapon.id === 'handgun';
      this.burstQueue = {
        remaining: isHandgun ? 6 : 10,
        timer: 0,
        interval: isHandgun ? 0.085 : 0.065,
        wormId: worm.id,
        teamIndex: worm.teamIndex,
        bulletType: isHandgun ? 'handgun_bullet' : 'uzi_bullet',
        damage: weapon.damage,
        blastRadius: weapon.blastRadius,
        knockback: weapon.knockback,
        spread: isHandgun ? 0.045 : 0.11,
      };
      this.phase = PHASES.PROJECTILE_ACTIVE;
      this.onHudUpdate?.(this);
      return true;
    }

    if (weapon.id === 'fireball') {
      this._consumeAmmo(weapon.id);
      this.projectiles.push(
        new Projectile({
          type: 'fireball',
          ownerId: worm.id,
          teamIndex: worm.teamIndex,
          x: muzzleX,
          y: muzzleY,
          vx: cosA * 560,
          vy: sinA * 560,
          radius: 7,
          damage: weapon.damage,
          blastRadius: weapon.blastRadius,
          knockback: weapon.knockback,
          windAffected: false,
          maxLifetime: 2.2,
        })
      );
      this.sound.playLaunch(true);
      this._emitSound('launch', true);
      this.phase = PHASES.PROJECTILE_ACTIVE;
      this.onHudUpdate?.(this);
      return true;
    }

    if (weapon.id === 'sheep' || weapon.id === 'supersheep') {
      this._consumeAmmo(weapon.id);
      this.walkers.push(
        new Walker({
          kind: weapon.id,
          ownerId: worm.id,
          teamIndex: worm.teamIndex,
          x: clamp(worm.x + worm.facing * 14, 18, WORLD_W - 18),
          y: worm.y - 2,
          dir: worm.facing,
          damage: weapon.damage,
          blastRadius: weapon.blastRadius,
          knockback: weapon.knockback,
          fuse: weapon.defaultFuse,
        })
      );
      this.sound.playClick();
      this._emitSound('click');
      this.showBanner(
        weapon.id === 'supersheep' ? 'СУПЕРОВЦА — нажмите Пробел, чтобы взлететь!' : 'ОВЦА — нажмите Пробел, чтобы взорвать!',
        '#ffd32a',
        2.2
      );
      this.phase = PHASES.PROJECTILE_ACTIVE;
      this.onHudUpdate?.(this);
      return true;
    }

    if (weapon.id === 'cow') {
      this._consumeAmmo(weapon.id);
      this.cowQueue = {
        remaining: 3,
        timer: 0,
        wormId: worm.id,
        teamIndex: worm.teamIndex,
        dir: worm.facing,
      };
      this.sound.playClick();
      this._emitSound('click');
      this.showBanner('БЕШЕНЫЕ КОРОВЫ НА ВОЛЕ!', '#ff6b81', 2.0);
      this.phase = PHASES.PROJECTILE_ACTIVE;
      this.onHudUpdate?.(this);
      return true;
    }

    if (weapon.id === 'punch') {
      this._consumeAmmo(weapon.id);
      this.sound.playBatSwing();
      this._emitSound('bat');
      let hitAny = false;
      for (const target of this.worms) {
        if (!target.alive || target.dying || target.id === worm.id) continue;
        if (Math.hypot(target.x - worm.x, target.y - worm.y) <= 44) {
          const launchX = cosA * weapon.knockback;
          const launchY = Math.min(-210, sinA * weapon.knockback - 190);
          const dmg = target.applyDamage(weapon.damage, launchX, launchY);
          this._recordDamage(worm.teamIndex, worm.name, target, dmg);
          this.particles.addPopup(target.x, target.y - 22, `-${dmg}`, '#ff5252', 17, 1.1);
          this._emitFx({ kind: 'popup', x: target.x, y: target.y - 22, text: `-${dmg}`, color: '#ff5252', size: 17, duration: 1.1 });
          hitAny = true;
        }
      }
      this.explode(muzzleX, muzzleY, weapon.blastRadius, 0, 0, {
        attackerTeamIndex: worm.teamIndex,
        attackerWormName: worm.name,
        silentAudio: true,
        label: hitAny ? 'НОКАУТ!' : null,
      });
      if (hitAny) {
        this.sound.playHurt();
        this._emitSound('hurt');
      }
      if (team.isAI) {
        this._enterResolving();
      } else {
        this.phase = PHASES.RETREAT;
        this.retreatTimer = weapon.retreatTime;
      }
      this.onHudUpdate?.(this);
      return true;
    }

    if (weapon.id === 'mine') {
      this._consumeAmmo(weapon.id);
      this.mines.push(new Mine(clamp(worm.x + worm.facing * 12, 16, WORLD_W - 16), worm.y, 2.0));
      this.sound.playClick();
      this._emitSound('click');
      this.phase = PHASES.RETREAT;
      this.retreatTimer = weapon.retreatTime;
      this.showBanner('МИНА ВЗВЕДЕНА ЧЕРЕЗ 2 СЕК. — ОТОЙДИТЕ!', '#ff5252', 1.8);
      this.onHudUpdate?.(this);
      return true;
    }

    if (weapon.id === 'sonic') {
      this._consumeAmmo(weapon.id);
      this.particles.spawnSonicWave(worm.x, worm.y, angle);
      this._emitFx({ kind: 'sonic', x: worm.x, y: worm.y, angle });
      this.sound.playLaunch(false);
      this._emitSound('launch', false);
      for (const target of this.worms) {
        if (!target.alive || target.dying || target.id === worm.id) continue;
        const dx = target.x - worm.x;
        const dy = target.y - worm.y;
        const dist = Math.hypot(dx, dy);
        if (dist <= 135) {
          const dot = (dx * cosA + dy * sinA) / Math.max(1, dist);
          if (dot >= 0.25 || dist <= 40) {
            const ratio = clamp(1 - dist / 150, 0.35, 1);
            const dmg = target.applyDamage(weapon.damage * ratio, cosA * weapon.knockback * ratio, Math.min(-130, sinA * weapon.knockback * ratio - 120));
            this._recordDamage(worm.teamIndex, worm.name, target, dmg);
            this.particles.addPopup(target.x, target.y - 22, `-${dmg}`, '#48dbfb', 16, 1.0);
            this._emitFx({ kind: 'popup', x: target.x, y: target.y - 22, text: `-${dmg}`, color: '#48dbfb', size: 16, duration: 1.0 });
          }
        }
      }
      this.phase = PHASES.RETREAT;
      this.retreatTimer = weapon.retreatTime;
      this.onHudUpdate?.(this);
      return true;
    }

    if (weapon.id === 'windblower') {
      this._consumeAmmo(weapon.id);
      this.wind = worm.facing * 85;
      this.particles.spawnSonicWave(worm.x, worm.y, worm.facing >= 0 ? 0 : Math.PI);
      this._emitFx({ kind: 'sonic', x: worm.x, y: worm.y, angle: worm.facing >= 0 ? 0 : Math.PI });
      this.sound.playLaunch(false);
      this._emitSound('launch', false);
      for (const target of this.worms) {
        if (!target.alive || target.dying || target.id === worm.id) continue;
        if (Math.hypot(target.x - worm.x, target.y - worm.y) <= 145) {
          target.applyDamage(0, worm.facing * weapon.knockback, -140);
        }
      }
      this.showBanner(`ВЕТЕР: ${worm.facing >= 0 ? '85 →' : '← 85'}!`, '#48dbfb', 2.0);
      this.phase = PHASES.RETREAT;
      this.retreatTimer = weapon.retreatTime;
      this.onHudUpdate?.(this);
      return true;
    }

    if (weapon.id === 'rope') {
      let hitX = null;
      let hitY = null;
      let hitDist = 0;
      for (let d = 14; d <= 340; d += 3) {
        const px = worm.x + cosA * d;
        const py = worm.y + sinA * d;
        if (px < 4 || px >= WORLD_W - 4 || py < 4 || py >= WORLD_H - 4) break;
        if (this.terrain.isSolid(px, py)) {
          hitX = px;
          hitY = py;
          hitDist = d;
          break;
        }
      }
      if (hitX === null) {
        this.showBanner('Прицельтесь в твёрдый грунт на расстоянии до 340 пикселей!', '#ff9f43', 1.4);
        return false;
      }
      this._consumeAmmo('rope');
      this.ropeState = {
        anchorX: hitX,
        anchorY: hitY,
        length: clamp(hitDist, 45, 340),
        wormId: worm.id,
      };
      worm.grounded = false;
      worm.maxAirVy = 0;
      this.sound.playClick();
      this._emitSound('click');
      this.phase = PHASES.ROPE;
      this.showBanner('ВЕРЁВКА НИНДЗЯ — ←/→ раскачиваться • ↑/↓ подтягиваться • Пробел отпустить', '#feca57', 2.2);
      this.onHudUpdate?.(this);
      return true;
    }

    if (weapon.id === 'bat') {
      this._consumeAmmo(weapon.id);
      this._swingBat(worm, cosA, sinA, weapon);
      if (team.isAI) {
        this._enterResolving();
      } else {
        this.phase = PHASES.RETREAT;
        this.retreatTimer = weapon.retreatTime;
      }
      this.onHudUpdate?.(this);
      return true;
    }

    if (weapon.id === 'dynamite') {
      this._consumeAmmo(weapon.id);
      this.projectiles.push(
        new Projectile({
          type: 'dynamite',
          ownerId: worm.id,
          teamIndex: worm.teamIndex,
          x: worm.x + worm.facing * 6,
          y: worm.y,
          vx: worm.facing * 24,
          vy: -30,
          radius: 5,
          damage: weapon.damage,
          blastRadius: weapon.blastRadius,
          knockback: weapon.knockback,
          windAffected: false,
          fuseable: false,
          fuse: weapon.defaultFuse,
          restitution: 0.1,
        })
      );
      this.sound.playClick();
      this.phase = PHASES.RETREAT;
      this.retreatTimer = weapon.retreatTime;
      this.showBanner('ДИНАМИТ УСТАНОВЛЕН! БЕГИТЕ!', '#ff5252', 1.8);
      this.onHudUpdate?.(this);
      return true;
    }

    if (weapon.id === 'airstrike' || weapon.id === 'napalm') {
      if (!this.pendingMapTarget) {
        this.showBanner(
          weapon.id === 'napalm' ? 'Укажите точку X на карте для напалмового удара!' : 'Укажите точку X на карте для авиаудара!',
          '#74b9ff',
          1.6
        );
        return false;
      }
      this._consumeAmmo(weapon.id);
      const tx = clamp(this.pendingMapTarget.x, 120, WORLD_W - 120);
      const dir = this.airstrikeDir >= 0 ? 1 : -1;
      const isNapalm = weapon.id === 'napalm';
      const offsets = isNapalm ? [-77, -55, -33, -11, 11, 33, 55, 77] : [-68, -34, 0, 34, 68];
      const dropXs = offsets.map((off) => tx + off * dir);
      this.airstrikePlane = {
        x: dir > 0 ? -90 : WORLD_W + 90,
        y: 72,
        dir,
        speed: 580,
        dropXs,
        nextDropIdx: 0,
        teamIndex: worm.teamIndex,
        ownerId: worm.id,
        payloadType: isNapalm ? 'napalm_drop' : 'airstrike_bomb',
      };
      this.sound.playLaunch(true);
      this._emitSound('launch', true);
      this.phase = PHASES.PROJECTILE_ACTIVE;
      this.onHudUpdate?.(this);
      return true;
    }

    if (weapon.id === 'meteor') {
      if (!this.pendingMapTarget) {
        this.showBanner('Укажите цель на карте для метеоритного удара!', '#ff9f43', 1.6);
        return false;
      }
      this._consumeAmmo(weapon.id);
      const tx = clamp(this.pendingMapTarget.x, 140, WORLD_W - 140);
      [-55, 0, 55].forEach((off, idx) => {
        this.projectiles.push(
          new Projectile({
            type: 'meteor',
            ownerId: worm.id,
            teamIndex: worm.teamIndex,
            x: tx + off - 170 - idx * 35,
            y: -45 - idx * 65,
            vx: 225,
            vy: 330,
            radius: 9,
            damage: weapon.damage,
            blastRadius: weapon.blastRadius,
            knockback: weapon.knockback,
            windAffected: false,
          })
        );
      });
      this.sound.playLaunch(true);
      this._emitSound('launch', true);
      this.phase = PHASES.PROJECTILE_ACTIVE;
      this.onHudUpdate?.(this);
      return true;
    }

    if (weapon.id === 'magnet') {
      if (!this.pendingMapTarget) {
        this.showBanner('Нажмите на свободное место над землёй, чтобы установить магнит!', '#ff6b81', 1.6);
        return false;
      }
      const { x, y } = this.pendingMapTarget;
      if (y > this.waterY - 14 || this.terrain.isSolid(x, y)) {
        this.showBanner('Магнит можно установить только в воздухе над водой!', '#ff5252', 1.4);
        this.pendingMapTarget = null;
        return false;
      }
      this._consumeAmmo(weapon.id);
      this.magnets.push(new MagnetProp(x, y, worm.teamIndex, 4));
      this.sound.playClick();
      this._emitSound('click');
      this.phase = PHASES.RETREAT;
      this.retreatTimer = weapon.retreatTime;
      this.onHudUpdate?.(this);
      return true;
    }

    if (weapon.id === 'teleport') {
      if (!this.pendingMapTarget) return false;
      const { x, y } = this.pendingMapTarget;
      if (y > this.waterY - 14 || isWormColliding(x, y, this.terrain)) {
        this.showBanner('Нельзя телепортироваться внутрь скалы или воды!', '#ff5252', 1.5);
        this.pendingMapTarget = null;
        return false;
      }
      this._consumeAmmo(weapon.id);
      const oldX = worm.x;
      const oldY = worm.y;
      this.particles.spawnTeleport(oldX, oldY);
      worm.x = x;
      worm.y = y;
      worm.vx = 0;
      worm.vy = 0;
      worm.grounded = false;
      worm.maxAirVy = 0;
      this.particles.spawnTeleport(worm.x, worm.y);
      this.sound.playTeleport();
      this._emitFx({ kind: 'teleport', x0: oldX, y0: oldY, x1: worm.x, y1: worm.y });
      this.camera.focus(worm.x, worm.y);
      if (team.isAI) {
        this._enterResolving();
      } else {
        this.phase = PHASES.RETREAT;
        this.retreatTimer = weapon.retreatTime;
      }
      this.onHudUpdate?.(this);
      return true;
    }

    if (weapon.id === 'girder') {
      if (!this.pendingMapTarget) return false;
      this._consumeAmmo(weapon.id);
      this.terrain.placeGirder(this.pendingMapTarget.x, this.pendingMapTarget.y, this.girderAngle, 96, 12);
      this._emitNet({
        type: 'terrain_op',
        op: 'girder',
        x: this.pendingMapTarget.x,
        y: this.pendingMapTarget.y,
        angle: this.girderAngle,
        length: 96,
        thickness: 12,
      });
      this.sound.playClick();
      this._emitSound('click');
      if (team.isAI) {
        this._enterResolving();
      } else {
        this.phase = PHASES.RETREAT;
        this.retreatTimer = weapon.retreatTime;
      }
      this.onHudUpdate?.(this);
      return true;
    }

    // Ballistic projectile weapons (bazooka, homing, grenade, cluster, banana, holy)
    if (weapon.id === 'homing' && !this.pendingMapTarget) {
      this.showBanner('Сначала выберите цель самонаводящейся ракеты на карте!', '#48dbfb', 1.6);
      return false;
    }

    this._consumeAmmo(weapon.id);
    const speed = weapon.speedMin + (weapon.speedMax - weapon.speedMin) * clamp(power, 0.08, 1);
    const fuse = weapon.fuseable ? this.fuseSeconds : weapon.defaultFuse || 0;

    this.projectiles.push(
      new Projectile({
        type: weapon.id,
        ownerId: worm.id,
        teamIndex: worm.teamIndex,
        x: muzzleX,
        y: muzzleY,
        vx: cosA * speed + worm.vx * 0.2,
        vy: sinA * speed + worm.vy * 0.2,
        radius: weapon.id === 'holy' ? 7 : 5,
        damage: weapon.damage,
        blastRadius: weapon.blastRadius,
        knockback: weapon.knockback,
        windAffected: weapon.windAffected,
        fuseable: weapon.fuseable,
        fuse,
        restitution: weapon.restitution ?? 0.34,
        groundFriction: weapon.groundFriction ?? 0.68,
        targetX: this.pendingMapTarget?.x ?? null,
        targetY: this.pendingMapTarget?.y ?? null,
      })
    );

    if (weapon.id === 'bazooka' || weapon.id === 'homing') {
      worm.fireTimer = 0.28;
    }
    this.sound.playLaunch(weapon.id === 'bazooka' || weapon.id === 'homing');
    this._emitSound('launch', weapon.id === 'bazooka' || weapon.id === 'homing');
    this.phase = PHASES.PROJECTILE_ACTIVE;
    this.onHudUpdate?.(this);
    return true;
  }

  _fireShotgun(worm, mx, my, cosA, sinA, weapon) {
    this.sound.playShotgun();
    this._emitSound('shotgun');
    let hitX = mx + cosA * 720;
    let hitY = my + sinA * 720;
    let hit = false;

    for (let d = 4; d <= 720; d += 3) {
      const px = mx + cosA * d;
      const py = my + sinA * d;
      if (px < 0 || px >= WORLD_W || py < 0 || py >= WORLD_H) {
        hitX = px;
        hitY = py;
        break;
      }
      for (const other of this.worms) {
        if (!other.alive || other.id === worm.id) continue;
        if (Math.hypot(px - other.x, py - other.y) <= WORM_RADIUS + 2) {
          hitX = px;
          hitY = py;
          hit = true;
          break;
        }
      }
      if (hit) break;
      if (this.terrain.isSolid(px, py)) {
        hitX = px;
        hitY = py;
        hit = true;
        break;
      }
    }

    const tracer = {
      x0: mx,
      y0: my,
      x1: hitX,
      y1: hitY,
      color: '#fff3a8',
      width: 2.6,
      life: 0.14,
      maxLife: 0.14,
    };
    this.tracers.push(tracer);
    this._emitFx({ kind: 'tracer', ...tracer });

    if (hit) {
      this.explode(hitX, hitY, weapon.blastRadius, weapon.damage, weapon.knockback, {
        attackerTeamIndex: worm.teamIndex,
        attackerWormName: worm.name,
        silentAudio: true,
        dirX: cosA,
        dirY: sinA,
      });
    }
  }

  _swingBat(worm, cosA, sinA, weapon) {
    this.sound.playBatSwing();
    this._emitSound('bat');
    let hitAny = false;
    for (const target of this.worms) {
      if (!target.alive || target.dying || target.id === worm.id) continue;
      if (Math.hypot(target.x - worm.x, target.y - worm.y) <= 38) {
        const launchX = cosA * weapon.knockback;
        const launchY = Math.min(-180, sinA * weapon.knockback - 160);
        const dmg = target.applyDamage(weapon.damage, launchX, launchY);
        this._recordDamage(worm.teamIndex, worm.name, target, dmg);
        this.particles.addPopup(target.x, target.y - 22, `-${dmg}`, '#ff5252', 17, 1.1);
        this._emitFx({ kind: 'popup', x: target.x, y: target.y - 22, text: `-${dmg}`, color: '#ff5252', size: 17, duration: 1.1 });
        hitAny = true;
      }
    }
    if (hitAny) {
      this.particles.addPopup(worm.x, worm.y - 34, 'ХОУМ-РАН!', '#ffe875', 18, 1.1);
      this.sound.playHurt();
      this.camera.shake(7, 0.22);
      this._emitFx({ kind: 'popup', x: worm.x, y: worm.y - 34, text: 'ХОУМ-РАН!', color: '#ffe875', size: 18, duration: 1.1 });
      this._emitFx({ kind: 'shake', intensity: 7, duration: 0.22 });
      this._emitSound('hurt');
    }
  }

  _activateJetpack() {
    const worm = this.getActiveWorm();
    if (!worm) return;
    this._consumeAmmo('jetpack');
    this.phase = PHASES.JETPACK;
    this.jetpackFuel = 100;
    this.jetpackThrusting = false;
    this.sound.playClick();
    this.showBanner('РЕАКТИВНЫЙ РАНЕЦ — стрелки/WASD для полёта • Пробел — остановиться', '#feca57', 2.4);
  }

  stopJetpack() {
    if (this.phase !== PHASES.JETPACK) return;
    this.jetpackThrusting = false;
    this.phase = PHASES.RETREAT;
    this.retreatTimer = 1.6;
    this.onHudUpdate?.(this);
  }

  _activateBlowtorch() {
    const worm = this.getActiveWorm();
    if (!worm) return;
    this._consumeAmmo('blowtorch');
    this.phase = PHASES.BLOWTORCH;
    this.blowtorchTimer = 2.2;
    this.blowtorchCarveAccum = 0;
    this.sound.playClick();
    this.showBanner('ГАЗОВАЯ ГОРЕЛКА — управляйте направлением тоннеля стрелками вверх/вниз!', '#ff9f43', 2.2);
  }

  _activateDrill() {
    const worm = this.getActiveWorm();
    if (!worm) return;
    this._consumeAmmo('drill');
    this.phase = PHASES.DRILL;
    this.drillTimer = 2.0;
    this.drillCarveAccum = 0;
    this.sound.playClick();
    this.showBanner('ПНЕВМАТИЧЕСКИЙ БУР — Пробел останавливает досрочно', '#a4b0be', 2.2);
  }

  stopDrill() {
    if (this.phase !== PHASES.DRILL) return;
    this.phase = PHASES.RETREAT;
    this.retreatTimer = 1.6;
    this.onHudUpdate?.(this);
  }

  stopRope() {
    if (this.phase !== PHASES.ROPE) return;
    this.ropeState = null;
    this.phase = PHASES.RETREAT;
    this.retreatTimer = 1.6;
    this.onHudUpdate?.(this);
  }

  triggerActiveSpecial() {
    if (this.phase !== PHASES.PROJECTILE_ACTIVE) return false;
    const activeWalker = this.walkers.find((wk) => wk.alive && (wk.kind === 'sheep' || wk.kind === 'supersheep'));
    if (!activeWalker) return false;
    if (activeWalker.kind === 'supersheep' && !activeWalker.flying) {
      activeWalker.activateFlight();
      this.sound.playLaunch(false);
      this._emitSound('launch', false);
      this.showBanner('СУПЕРОВЦА ЛЕТИТ! Управление: ←/→', '#ffe875', 1.6);
      return true;
    }
    const idx = this.walkers.indexOf(activeWalker);
    activeWalker.alive = false;
    this._handleWalkerExplosion(activeWalker);
    if (idx !== -1) this.walkers.splice(idx, 1);
    return true;
  }

  _handleWalkerExplosion(wk) {
    const owner = this.worms.find((w) => w.id === wk.ownerId);
    this.explode(wk.x, wk.y, wk.blastRadius, wk.damage, wk.knockback, {
      attackerTeamIndex: wk.teamIndex,
      attackerWormName: owner?.name || wk.kind.toUpperCase(),
      label: wk.kind === 'cow' ? 'МУ-У-ВЗРЫВ!' : 'БЕ-Е-ВЗРЫВ!',
    });
  }

  _recordDamage(attackerTeamIndex, attackerWormName, victim, dmg) {
    if (dmg <= 0) return;
    const team = this.teams[attackerTeamIndex];
    if (team && victim.teamIndex !== attackerTeamIndex) {
      team.damageDealt += dmg;
      if (victim.hp <= 0) team.kills++;
    }
    if (dmg > this.matchStats.biggestHit.damage) {
      this.matchStats.biggestHit = {
        wormName: attackerWormName || victim.name,
        damage: dmg,
      };
    }
  }

  explode(cx, cy, radius, maxDamage, knockback, opts = {}) {
    if (radius > 0) {
      this.terrain.carveCircle(cx, cy, radius, 4);
      this._emitNet({ type: 'terrain_op', op: 'carve', cx, cy, radius, scorchWidth: 4 });
    }
    if (!opts.silentAudio) {
      this.sound.playExplosion(radius);
    }

    this.particles.spawnExplosion(cx, cy, Math.max(14, radius), this.terrain, opts.particleColor || null);
    this.camera.shake(Math.min(18, Math.max(4, radius * 0.24)), 0.34);
    this._emitFx({
      kind: 'explosion',
      cx,
      cy,
      radius,
      particleColor: opts.particleColor || null,
      label: opts.label || null,
      silentAudio: Boolean(opts.silentAudio),
    });

    if (opts.label) {
      this.particles.addPopup(cx, cy - radius * 0.6, opts.label, opts.particleColor || '#ffe875', 22, 1.2);
    } else if (radius >= 45) {
      this.particles.addPopup(cx, cy - radius * 0.5, radius >= 70 ? 'БА-БАХ!' : 'БА-БАХ!', '#ffe875', 19, 0.9);
    }

    const blastReach = Math.max(24, radius * 1.45);
    for (const w of this.worms) {
      if (!w.alive || w.dying) continue;
      const dx = w.x - cx;
      const dy = w.y - cy;
      const dist = Math.hypot(dx, dy);
      if (dist <= blastReach) {
        const ratio = clamp(1 - dist / blastReach, 0.14, 1);
        const dmg = Math.max(1, Math.round(maxDamage * ratio));
        const nx = dist > 1 ? dx / dist : opts.dirX ?? 0;
        const ny = dist > 1 ? dy / dist : opts.dirY ?? -1;
        const ix = nx * knockback * ratio;
        const iy = (ny - 0.42) * knockback * ratio;

        const applied = w.applyDamage(dmg, ix, iy);
        this._recordDamage(opts.attackerTeamIndex ?? -1, opts.attackerWormName, w, applied);
        this.particles.addPopup(w.x, w.y - 24, `-${applied}`, '#ff5252', 15, 1.0);
        this._emitFx({ kind: 'popup', x: w.x, y: w.y - 24, text: `-${applied}`, color: '#ff5252', size: 15, duration: 1.0 });
        this.sound.playHurt();
        this._emitSound('hurt');
      }
    }

    // Trigger mines & damage barrels for chain reactions!
    for (const m of this.mines) {
      if (!m.alive || m.triggered) continue;
      if (Math.hypot(m.x - cx, m.y - cy) <= blastReach + 12) {
        m.triggered = true;
        m.timer = 0.25;
      }
    }

    for (const b of this.barrels) {
      if (!b.alive) continue;
      const dist = Math.hypot(b.x - cx, b.y - cy);
      if (dist <= blastReach + 10) {
        b.hp -= maxDamage * (1 - dist / (blastReach + 15));
        if (b.hp <= 0) {
          b.alive = false;
          this.explode(b.x, b.y, 50, 45, 360, {
            attackerTeamIndex: opts.attackerTeamIndex,
            attackerWormName: opts.attackerWormName,
            label: 'ЦЕПНАЯ РЕАКЦИЯ!',
          });
        }
      }
    }
  }

  _handleProjectileExplosion(proj) {
    const attacker = this.worms.find((w) => w.id === proj.ownerId);
    const attackerName = attacker?.name || 'Blast';

    if (proj.type === 'holy') {
      this.explode(proj.x, proj.y, proj.blastRadius, proj.damage, proj.knockback, {
        attackerTeamIndex: proj.teamIndex,
        attackerWormName: attackerName,
        particleColor: '#ffe875',
        label: 'АЛЛИЛУЙЯ!',
      });
      return;
    }

    if (proj.type === 'poison') {
      this.explode(proj.x, proj.y, proj.blastRadius, proj.damage, proj.knockback, {
        attackerTeamIndex: proj.teamIndex,
        attackerWormName: attackerName,
        particleColor: '#7bed9f',
        label: 'ЯДОВИТО!',
      });
      this.particles.spawnGasCloud(proj.x, proj.y);
      this._emitFx({ kind: 'gas', x: proj.x, y: proj.y });
      for (const w of this.worms) {
        if (!w.alive || w.dying) continue;
        if (Math.hypot(w.x - proj.x, w.y - proj.y) <= 54) {
          w.poisoned = true;
        }
      }
      return;
    }

    if (proj.type === 'icebomb') {
      this.explode(proj.x, proj.y, proj.blastRadius, proj.damage, proj.knockback, {
        attackerTeamIndex: proj.teamIndex,
        attackerWormName: attackerName,
        particleColor: '#74b9ff',
        label: 'ЗАМОРОЖЕН!',
      });
      this.particles.spawnIceBurst(proj.x, proj.y);
      this._emitFx({ kind: 'ice', x: proj.x, y: proj.y });
      for (const w of this.worms) {
        if (!w.alive || w.dying) continue;
        if (Math.hypot(w.x - proj.x, w.y - proj.y) <= 56) {
          w.frozenTurns = Math.max(w.frozenTurns, 1);
        }
      }
      return;
    }

    if (proj.type === 'balloon') {
      this.explode(proj.x, proj.y, proj.blastRadius, proj.damage, proj.knockback, {
        attackerTeamIndex: proj.teamIndex,
        attackerWormName: attackerName,
        particleColor: '#48dbfb',
        label: 'ПЛЮХ!',
      });
      this.particles.spawnSplash(proj.x, proj.y, false);
      this._emitFx({ kind: 'splash', x: proj.x, y: proj.y, isLava: false });
      return;
    }

    this.explode(proj.x, proj.y, proj.blastRadius, proj.damage, proj.knockback, {
      attackerTeamIndex: proj.teamIndex,
      attackerWormName: attackerName,
    });

    if (proj.type === 'cluster' || proj.type === 'banana') {
      const isBanana = proj.type === 'banana';
      const count = 5;
      for (let i = 0; i < count; i++) {
        const spread = -1.1 + (i / (count - 1)) * 2.2;
        const speed = (isBanana ? 230 : 195) + (i % 2) * 55;
        this.projectiles.push(
          new Projectile({
            type: isBanana ? 'banana_bomblet' : 'cluster_bomblet',
            ownerId: proj.ownerId,
            teamIndex: proj.teamIndex,
            x: proj.x,
            y: proj.y - 4,
            vx: Math.sin(spread) * speed,
            vy: -Math.cos(spread * 0.5) * speed * 1.15,
            radius: 4,
            damage: isBanana ? 48 : 24,
            blastRadius: isBanana ? 44 : 28,
            knockback: isBanana ? 360 : 240,
            windAffected: false,
            fuseable: isBanana,
            fuse: isBanana ? 1.55 : 0,
            restitution: isBanana ? 0.52 : 0.35,
            groundFriction: isBanana ? 0.76 : 0.66,
          })
        );
      }
    } else if (proj.type === 'mortar') {
      for (let i = 0; i < 4; i++) {
        const spread = -0.95 + (i / 3) * 1.9;
        const speed = 175 + (i % 2) * 55;
        this.projectiles.push(
          new Projectile({
            type: 'mortar_shrapnel',
            ownerId: proj.ownerId,
            teamIndex: proj.teamIndex,
            x: proj.x,
            y: proj.y - 5,
            vx: Math.sin(spread) * speed,
            vy: -Math.cos(spread * 0.5) * speed * 1.1,
            radius: 3.5,
            damage: 16,
            blastRadius: 22,
            knockback: 210,
            windAffected: false,
            fuseable: true,
            fuse: 1.35,
            restitution: 0.45,
            groundFriction: 0.68,
          })
        );
      }
    } else if (proj.type === 'petrol') {
      for (let i = 0; i < 8; i++) {
        const spread = -1.25 + (i / 7) * 2.5;
        const speed = 115 + (i % 3) * 48;
        this.projectiles.push(
          new Projectile({
            type: 'fire_ember',
            ownerId: proj.ownerId,
            teamIndex: proj.teamIndex,
            x: proj.x,
            y: proj.y - 4,
            vx: Math.sin(spread) * speed,
            vy: -Math.cos(spread * 0.45) * speed,
            radius: 3,
            damage: 9,
            blastRadius: 14,
            knockback: 90,
            windAffected: false,
            fuseable: true,
            fuse: 1.9 + (i % 3) * 0.25,
            restitution: 0.24,
            groundFriction: 0.55,
          })
        );
      }
    }
  }

  update(frameDt) {
    if (this.paused) return;
    if (this.phase === PHASES.SETUP || this.phase === PHASES.GAME_OVER) {
      this.camera.update(frameDt);
      this.particles.update(frameDt, this.wind);
      return;
    }

    if (this.netRole === 'guest') {
      if (this.bannerTimer > 0) {
        this.bannerTimer = Math.max(0, this.bannerTimer - frameDt);
      }
      for (const w of this.worms) {
        w.displayHp += (w.hp - w.displayHp) * Math.min(1, frameDt * 10);
      }
      for (let i = this.tracers.length - 1; i >= 0; i--) {
        this.tracers[i].life -= frameDt;
        if (this.tracers[i].life <= 0) this.tracers.splice(i, 1);
      }
      for (const p of this.projectiles) {
        if ((p.type === 'bazooka' || p.type === 'homing') && Math.random() < 0.5) {
          this.particles.spawnTrail(p.x, p.y, 'rgba(240,245,255,0.55)', 4.2);
        }
      }
      if (this.projectiles.length > 0) {
        this.camera.focus(this.projectiles[0].x, this.projectiles[0].y);
      } else if (this.walkers.length > 0) {
        this.camera.focus(this.walkers[0].x, this.walkers[0].y);
      } else if (this.airstrikePlane) {
        this.camera.focus(this.airstrikePlane.x, 220);
      } else {
        const activeWorm = this.getActiveWorm();
        if (activeWorm) {
          this.camera.focus(activeWorm.x, activeWorm.y - 16);
        }
      }
      this.particles.update(frameDt, this.wind);
      this.camera.update(frameDt);
      return;
    }

    const clamped = Math.min(0.05, frameDt);
    this._accumulator += clamped;
    while (this._accumulator >= DT) {
      this.step(DT);
      this._accumulator -= DT;
    }

    this._hudAccum += frameDt;
    if (this._hudAccum >= 0.08) {
      this._hudAccum = 0;
      this.onHudUpdate?.(this);
    }
  }

  step(dt) {
    if (this.bannerTimer > 0) {
      this.bannerTimer = Math.max(0, this.bannerTimer - dt);
    }

    this._stepWorldEntities(dt);
    this._stepPhaseLogic(dt);
    this.particles.update(dt, this.wind);
    this.camera.update(dt);
  }

  _stepWorldEntities(dt) {
    const theme = this.terrain.theme;
    for (const w of this.worms) {
      w.stepPhysics(dt, this.terrain, this.waterY, {
        onFallDamage: (worm, dmg) => {
          this.particles.addPopup(worm.x, worm.y - 22, `-${dmg} FALL`, '#ffa502', 14, 1.0);
          this.sound.playHurt();
          this._emitFx({ kind: 'popup', x: worm.x, y: worm.y - 22, text: `-${dmg} FALL`, color: '#ffa502', size: 14, duration: 1.0 });
          this._emitSound('hurt');
        },
        onDrown: (worm) => {
          this.particles.spawnSplash(worm.x, this.waterY, theme.isLava);
          this.sound.playSplash();
          this._emitFx({ kind: 'splash', x: worm.x, y: this.waterY, isLava: theme.isLava });
        },
        onFarewell: (worm) => {
          this.graves.push(new Grave(worm.x, worm.y, worm.teamIndex, worm.name));
          this.particles.spawnAngel(worm.x, worm.y);
          this._emitFx({ kind: 'angel', x: worm.x, y: worm.y });
          this.explode(worm.x, worm.y, 26, 16, 180, {
            attackerTeamIndex: -1,
            label: 'ПОКОЙСЯ С МИРОМ',
          });
        },
      });
    }

    // Rapid-fire burst queue (Uzi / Handgun)
    if (this.burstQueue) {
      this.burstQueue.timer -= dt;
      if (this.burstQueue.timer <= 0 && this.burstQueue.remaining > 0) {
        const worm = this.worms.find((w) => w.id === this.burstQueue.wormId);
        if (worm && worm.alive) {
          const baseAngle = worm.getAimWorldAngle();
          const spreadAngle = baseAngle + (Math.random() - 0.5) * this.burstQueue.spread;
          const cosA = Math.cos(spreadAngle);
          const sinA = Math.sin(spreadAngle);
          const mx = worm.x + cosA * 15;
          const my = worm.y + sinA * 15 - 2;

          this.projectiles.push(
            new Projectile({
              type: this.burstQueue.bulletType,
              ownerId: worm.id,
              teamIndex: worm.teamIndex,
              x: mx,
              y: my,
              vx: cosA * 940,
              vy: sinA * 940,
              radius: 2.5,
              damage: this.burstQueue.damage,
              blastRadius: this.burstQueue.blastRadius,
              knockback: this.burstQueue.knockback,
              windAffected: false,
              maxLifetime: 1.1,
            })
          );
          this.sound.playUziShot();
          this._emitSound('uzi');
        }
        this.burstQueue.remaining--;
        this.burstQueue.timer = this.burstQueue.interval;
        if (this.burstQueue.remaining <= 0) {
          this.burstQueue = null;
        }
      }
    }

    // Mad Cows spawn queue
    if (this.cowQueue) {
      this.cowQueue.timer -= dt;
      if (this.cowQueue.timer <= 0 && this.cowQueue.remaining > 0) {
        const worm = this.worms.find((w) => w.id === this.cowQueue.wormId);
        if (worm && worm.alive) {
          this.walkers.push(
            new Walker({
              kind: 'cow',
              ownerId: worm.id,
              teamIndex: worm.teamIndex,
              x: clamp(worm.x + this.cowQueue.dir * 16, 18, WORLD_W - 18),
              y: worm.y - 4,
              dir: this.cowQueue.dir,
              damage: 40,
              blastRadius: 44,
              knockback: 340,
              fuse: 5.5,
            })
          );
          this.sound.playClick();
          this._emitSound('click');
        }
        this.cowQueue.remaining--;
        this.cowQueue.timer = 0.45;
        if (this.cowQueue.remaining <= 0) {
          this.cowQueue = null;
        }
      }
    }

    // Air strike / Napalm airplane
    if (this.airstrikePlane) {
      const plane = this.airstrikePlane;
      plane.x += plane.dir * plane.speed * dt;
      while (plane.nextDropIdx < plane.dropXs.length) {
        const dropX = plane.dropXs[plane.nextDropIdx];
        const passed = plane.dir > 0 ? plane.x >= dropX : plane.x <= dropX;
        if (!passed) break;
        plane.nextDropIdx++;
        const isNapalm = plane.payloadType === 'napalm_drop';
        this.projectiles.push(
          new Projectile({
            type: isNapalm ? 'napalm_drop' : 'airstrike_bomb',
            ownerId: plane.ownerId,
            teamIndex: plane.teamIndex,
            x: dropX,
            y: plane.y + 12,
            vx: plane.dir * (isNapalm ? 115 : 95),
            vy: 45,
            radius: isNapalm ? 4 : 5,
            damage: isNapalm ? 20 : 35,
            blastRadius: isNapalm ? 22 : 38,
            knockback: isNapalm ? 180 : 310,
            windAffected: true,
          })
        );
      }
      if (
        (plane.dir > 0 && plane.x > WORLD_W + 140) ||
        (plane.dir < 0 && plane.x < -140)
      ) {
        this.airstrikePlane = null;
      }
    }

    // Projectiles
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      p.step(dt, this.terrain, this.wind, this.waterY, this.worms, {
        magnets: this.magnets,
        onExplode: (proj) => this._handleProjectileExplosion(proj),
        onBounce: (proj, speed) => {
          this.sound.playBounce(speed);
          this._emitSound('bounce', speed);
        },
        onHolyChoir: () => {
          this.sound.playHallelujah();
          this._emitSound('hallelujah');
        },
        onTrail: (proj) => {
          if (proj.type === 'bazooka' || proj.type === 'homing' || proj.type === 'mortar') {
            this.particles.spawnTrail(proj.x, proj.y, 'rgba(240,245,255,0.6)', 4.5);
          } else if (proj.type === 'fireball' || proj.type === 'meteor' || proj.type === 'napalm_drop' || proj.type === 'fire_ember') {
            this.particles.spawnTrail(proj.x, proj.y, 'rgba(255,165,65,0.72)', proj.type === 'meteor' ? 6 : 3.5);
          } else if (proj.type === 'airstrike_bomb') {
            this.particles.spawnTrail(proj.x, proj.y, 'rgba(255,190,120,0.45)', 3);
          }
        },
        onWaterSplash: (proj) => {
          this.particles.spawnSplash(proj.x, this.waterY, theme.isLava);
          this.sound.playSplash();
          this._emitFx({ kind: 'splash', x: proj.x, y: this.waterY, isLava: theme.isLava });
        },
      });
      if (!p.alive) {
        this.projectiles.splice(i, 1);
      }
    }

    // Walkers (Sheep, Super Sheep, Mad Cows)
    for (let i = this.walkers.length - 1; i >= 0; i--) {
      const wk = this.walkers[i];
      wk.step(dt, this.terrain, this.waterY, this.worms, this.input, {
        onExplode: (walker) => this._handleWalkerExplosion(walker),
        onTrail: (walker) => {
          this.particles.spawnTrail(walker.x, walker.y, 'rgba(255, 226, 110, 0.78)', 4.5);
        },
        onWaterSplash: (walker) => {
          this.particles.spawnSplash(walker.x, this.waterY, theme.isLava);
          this.sound.playSplash();
          this._emitFx({ kind: 'splash', x: walker.x, y: this.waterY, isLava: theme.isLava });
        },
      });
      if (!wk.alive) this.walkers.splice(i, 1);
    }

    // Magnets
    for (let i = this.magnets.length - 1; i >= 0; i--) {
      const mag = this.magnets[i];
      mag.step(dt, this.terrain, this.waterY);
      if (!mag.alive) this.magnets.splice(i, 1);
    }

    // Mines
    for (let i = this.mines.length - 1; i >= 0; i--) {
      const m = this.mines[i];
      m.step(dt, this.terrain, this.waterY, this.worms, {
        onTrigger: () => this.sound.playBeep(false),
        onBeep: () => this.sound.playBeep(true),
        onExplode: (mine) => {
          this.explode(mine.x, mine.y, 42, 36, 300, {
            attackerTeamIndex: -1,
            label: 'МИНА!',
          });
        },
      });
      if (!m.alive) this.mines.splice(i, 1);
    }

    // Barrels
    for (let i = this.barrels.length - 1; i >= 0; i--) {
      const b = this.barrels[i];
      b.step(dt, this.terrain, this.waterY, {
        onSplash: (bar) => {
          this.particles.spawnSplash(bar.x, this.waterY, theme.isLava);
        },
      });
      if (!b.alive) this.barrels.splice(i, 1);
    }

    // Crates
    for (let i = this.crates.length - 1; i >= 0; i--) {
      const c = this.crates[i];
      c.step(dt, this.terrain, this.wind, this.waterY, this.worms, {
        onSplash: (cr) => {
          this.particles.spawnSplash(cr.x, this.waterY, theme.isLava);
        },
        onPickup: (cr, worm) => {
          this.sound.playPickup();
          this._emitSound('pickup');
          this.matchStats.cratePickups++;
          if (cr.kind === 'health') {
            const healed = worm.heal(30);
            this.particles.addPopup(worm.x, worm.y - 26, `+${healed} HP`, '#2ed573', 16, 1.2);
            this._emitFx({ kind: 'popup', x: worm.x, y: worm.y - 26, text: `+${healed} HP`, color: '#2ed573', size: 16, duration: 1.2 });
          } else {
            const team = this.teams[worm.teamIndex];
            const bonusId = cr.payload || 'holy';
            if (team && Number.isFinite(team.inventory[bonusId])) {
              team.inventory[bonusId] += 1;
            }
            const label = WEAPON_MAP[bonusId]?.name || 'Weapon';
            this.particles.addPopup(worm.x, worm.y - 26, `+1 ${label.toUpperCase()}`, '#ffd32a', 15, 1.3);
            this._emitFx({ kind: 'popup', x: worm.x, y: worm.y - 26, text: `+1 ${label.toUpperCase()}`, color: '#ffd32a', size: 15, duration: 1.3 });
          }
          this.onHudUpdate?.(this);
        },
      });
      if (!c.alive) this.crates.splice(i, 1);
    }

    // Graves
    for (let i = this.graves.length - 1; i >= 0; i--) {
      const g = this.graves[i];
      g.step(dt, this.terrain, this.waterY);
      if (!g.alive) this.graves.splice(i, 1);
    }

    // Tracers
    for (let i = this.tracers.length - 1; i >= 0; i--) {
      this.tracers[i].life -= dt;
      if (this.tracers[i].life <= 0) this.tracers.splice(i, 1);
    }
  }

  _stepPhaseLogic(dt) {
    const activeWorm = this.getActiveWorm();
    const activeTeam = this.teams[this.activeTeamIndex];

    if (this.phase === PHASES.PLAYER_TURN) {
      if (!activeWorm || !activeWorm.alive || activeWorm.dying) {
        this._enterResolving();
        return;
      }

      if (activeTeam?.isAI) {
        this.ai.update(dt, this);
      } else {
        this._handleHumanControls(dt, activeWorm);
      }

      this.turnTimer -= dt;
      if (this.turnTimer <= 5.0 && this.turnTimer > 0) {
        const sec = Math.ceil(this.turnTimer);
        if (sec !== this.lastBeepSecond) {
          this.lastBeepSecond = sec;
          this.sound.playBeep(sec === 1);
        }
      }
      if (this.turnTimer <= 0) {
        this.turnTimer = 0;
        this.showBanner("Время вышло!", '#ff7f50', 1.4);
        this._enterResolving();
        return;
      }

      this.camera.focus(activeWorm.x, activeWorm.y - 16);
      return;
    }

    if (this.phase === PHASES.CHARGING) {
      if (!activeWorm || !activeWorm.alive) {
        this._enterResolving();
        return;
      }
      this.chargePower += this.chargeDir * dt * 0.92;
      if (this.chargePower >= 1) {
        this.chargePower = 1;
        this.releaseCharge();
        return;
      }
      if (activeTeam?.isAI) {
        this.ai.update(dt, this);
      }
      return;
    }

    if (this.phase === PHASES.JETPACK) {
      if (!activeWorm || !activeWorm.alive || activeWorm.dying) {
        this._enterResolving();
        return;
      }
      this.jetpackThrusting = false;
      if (this.input.left) {
        activeWorm.facing = -1;
        activeWorm.vx = clamp(activeWorm.vx - 340 * dt, -200, 200);
        this.jetpackFuel -= 12 * dt;
        this.jetpackThrusting = true;
      }
      if (this.input.right) {
        activeWorm.facing = 1;
        activeWorm.vx = clamp(activeWorm.vx + 340 * dt, -200, 200);
        this.jetpackFuel -= 12 * dt;
        this.jetpackThrusting = true;
      }
      if (this.input.up) {
        activeWorm.grounded = false;
        activeWorm.vy = clamp(activeWorm.vy - (GRAVITY + 290) * dt, -240, 260);
        activeWorm.maxAirVy = 0;
        this.jetpackFuel -= 26 * dt;
        this.jetpackThrusting = true;
      }
      if (this.jetpackThrusting && Math.random() < 0.35) {
        this.sound.playJetpack();
      }
      this.camera.focus(activeWorm.x, activeWorm.y - 20);
      if (this.jetpackFuel <= 0) {
        this.jetpackFuel = 0;
        this.stopJetpack();
      }
      return;
    }

    if (this.phase === PHASES.BLOWTORCH) {
      if (!activeWorm || !activeWorm.alive || activeWorm.dying) {
        this._enterResolving();
        return;
      }
      if (this.input.up) activeWorm.adjustAim(-1.8 * dt);
      if (this.input.down) activeWorm.adjustAim(1.8 * dt);

      const angle = activeWorm.getAimWorldAngle();
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);
      activeWorm.grounded = false;
      activeWorm.vx = cosA * 56;
      activeWorm.vy = sinA * 56 - GRAVITY * dt * 0.5;
      activeWorm.maxAirVy = 0;

      this.blowtorchCarveAccum += dt;
      if (this.blowtorchCarveAccum >= 0.055) {
        this.blowtorchCarveAccum = 0;
        const cx = activeWorm.x + cosA * 11;
        const cy = activeWorm.y + sinA * 11;
        this.terrain.carveCircle(cx, cy, 16, 2);
        this._emitNet({ type: 'terrain_op', op: 'carve', cx, cy, radius: 16, scorchWidth: 2 });
        this.particles.spawnTrail(cx + cosA * 8, cy + sinA * 8, 'rgba(255, 165, 60, 0.85)', 5);
        for (const other of this.worms) {
          if (!other.alive || other.dying || other.id === activeWorm.id) continue;
          if (Math.hypot(other.x - cx, other.y - cy) <= 22) {
            const dmg = other.applyDamage(5, cosA * 140, sinA * 120 - 80);
            this._recordDamage(activeWorm.teamIndex, activeWorm.name, other, dmg);
            this.particles.addPopup(other.x, other.y - 20, `-${dmg}`, '#ff9f43', 13, 0.7);
          }
        }
      }

      this.blowtorchTimer -= dt;
      this.camera.focus(activeWorm.x, activeWorm.y - 16);
      if (this.blowtorchTimer <= 0) {
        this.phase = PHASES.RETREAT;
        this.retreatTimer = 1.6;
      }
      return;
    }

    if (this.phase === PHASES.ROPE) {
      if (!activeWorm || !activeWorm.alive || activeWorm.dying || !this.ropeState) {
        this.ropeState = null;
        this._enterResolving();
        return;
      }
      const rope = this.ropeState;
      if (this.input.left) {
        activeWorm.facing = -1;
        activeWorm.vx = clamp(activeWorm.vx - 260 * dt, -260, 260);
      }
      if (this.input.right) {
        activeWorm.facing = 1;
        activeWorm.vx = clamp(activeWorm.vx + 260 * dt, -260, 260);
      }
      if (this.input.up) rope.length = Math.max(36, rope.length - 140 * dt);
      if (this.input.down) rope.length = Math.min(340, rope.length + 140 * dt);

      activeWorm.grounded = false;
      activeWorm.vy += GRAVITY * dt;
      activeWorm.maxAirVy = 0;

      const nx = clamp(activeWorm.x + activeWorm.vx * dt, WORM_RADIUS + 4, WORLD_W - WORM_RADIUS - 4);
      const ny = activeWorm.y + activeWorm.vy * dt;
      if (!isWormColliding(nx, ny, this.terrain)) {
        activeWorm.x = nx;
        activeWorm.y = ny;
      } else {
        activeWorm.vx *= -0.35;
        activeWorm.vy *= -0.35;
      }

      const dx = activeWorm.x - rope.anchorX;
      const dy = activeWorm.y - rope.anchorY;
      const dist = Math.hypot(dx, dy);
      if (dist > rope.length && dist > 0.001) {
        const rx = dx / dist;
        const ry = dy / dist;
        activeWorm.x = rope.anchorX + rx * rope.length;
        activeWorm.y = rope.anchorY + ry * rope.length;
        const vr = activeWorm.vx * rx + activeWorm.vy * ry;
        if (vr > 0) {
          activeWorm.vx -= vr * rx;
          activeWorm.vy -= vr * ry;
        }
        activeWorm.vx *= 0.996;
        activeWorm.vy *= 0.996;
      }

      if (activeWorm.y > this.waterY - 6) {
        this.stopRope();
      }
      this.camera.focus(activeWorm.x, activeWorm.y - 16);
      return;
    }

    if (this.phase === PHASES.DRILL) {
      if (!activeWorm || !activeWorm.alive || activeWorm.dying) {
        this._enterResolving();
        return;
      }
      activeWorm.grounded = false;
      activeWorm.vx = 0;
      activeWorm.vy = 0;
      activeWorm.maxAirVy = 0;

      this.drillCarveAccum += dt;
      if (this.drillCarveAccum >= 0.06) {
        this.drillCarveAccum = 0;
        const cx = activeWorm.x;
        const cy = activeWorm.y + 8;
        this.terrain.carveCircle(cx, cy, 15, 2);
        this._emitNet({ type: 'terrain_op', op: 'carve', cx, cy, radius: 15, scorchWidth: 2 });
        this.particles.spawnTrail(cx, cy + 4, 'rgba(180, 195, 215, 0.85)', 4.5);
        for (const other of this.worms) {
          if (!other.alive || other.dying || other.id === activeWorm.id) continue;
          if (Math.hypot(other.x - cx, other.y - cy) <= 22) {
            const dmg = other.applyDamage(4, 0, -90);
            this._recordDamage(activeWorm.teamIndex, activeWorm.name, other, dmg);
            this.particles.addPopup(other.x, other.y - 20, `-${dmg}`, '#a4b0be', 13, 0.7);
          }
        }
      }
      activeWorm.y += 58 * dt;
      this.drillTimer -= dt;
      this.camera.focus(activeWorm.x, activeWorm.y - 16);
      if (this.drillTimer <= 0 || activeWorm.y > this.waterY - 14) {
        this.stopDrill();
      }
      return;
    }

    if (this.phase === PHASES.RETREAT) {
      if (activeWorm && activeWorm.alive && !activeWorm.dying && !activeTeam?.isAI) {
        if (this.input.left) activeWorm.walk(-1, dt, this.terrain);
        if (this.input.right) activeWorm.walk(1, dt, this.terrain);
        this.camera.focus(activeWorm.x, activeWorm.y - 16);
      }
      this.retreatTimer -= dt;
      if (this.retreatTimer <= 0) {
        if (this.projectiles.length > 0 || this.airstrikePlane || this.walkers.length > 0 || this.cowQueue) {
          this.phase = PHASES.PROJECTILE_ACTIVE;
        } else {
          this._enterResolving();
        }
      }
      return;
    }

    if (this.phase === PHASES.PROJECTILE_ACTIVE) {
      if (this.projectiles.length > 0) {
        const p = this.projectiles[0];
        this.camera.focus(p.x, p.y);
      } else if (this.walkers.length > 0) {
        this.camera.focus(this.walkers[0].x, this.walkers[0].y);
      } else if (this.airstrikePlane) {
        this.camera.focus(this.airstrikePlane.x, 220);
      }

      if (
        this.projectiles.length === 0 &&
        !this.airstrikePlane &&
        !this.burstQueue &&
        !this.cowQueue &&
        this.walkers.length === 0
      ) {
        this._enterResolving();
      }
      return;
    }

    if (this.phase === PHASES.RESOLVING) {
      this.resolvingTimer += dt;
      const anyAirborne = this.worms.some((w) => w.alive && (!w.grounded || w.dying));
      const anyTriggeredMine = this.mines.some((m) => m.alive && m.triggered);
      const busy =
        this.projectiles.length > 0 ||
        this.walkers.length > 0 ||
        anyAirborne ||
        anyTriggeredMine;

      if (busy) {
        this.settleTimer = 0;
      } else {
        this.settleTimer += dt;
      }

      if ((!busy && this.settleTimer >= 0.4) || this.resolvingTimer >= 4.0) {
        this._finishTurnAndCheckVictory();
      }
    }
  }

  _handleHumanControls(dt, worm) {
    if (this.input.left) {
      worm.walk(-1, dt, this.terrain);
    } else if (this.input.right) {
      worm.walk(1, dt, this.terrain);
    }
    if (this.input.up) {
      worm.adjustAim(-1.9 * dt);
    }
    if (this.input.down) {
      worm.adjustAim(1.9 * dt);
    }
  }

  _enterResolving() {
    this.phase = PHASES.RESOLVING;
    this.resolvingTimer = 0;
    this.settleTimer = 0;
    this.ropeState = null;
    this.drillTimer = 0;
    this.input = { left: false, right: false, up: false, down: false };
    this.onHudUpdate?.(this);
  }

  _finishTurnAndCheckVictory() {
    const aliveTeams = this.teams.filter((t) => this.getTeamWorms(t.index, true).length > 0);
    if (aliveTeams.length <= 1) {
      this.phase = PHASES.GAME_OVER;
      this.winnerTeamIndex = aliveTeams.length === 1 ? aliveTeams[0].index : -1;
      this.matchStats.totalTurns = this.turnCount;
      this.sound.playVictory();
      this._emitNet({
        type: 'game_over',
        winnerTeamIndex: this.winnerTeamIndex,
        matchStats: this.matchStats,
        teams: this.teams.map((t) => ({
          index: t.index,
          damageDealt: t.damageDealt,
          kills: t.kills,
        })),
      });
      this.onHudUpdate?.(this);
      this.onGameOver?.(this);
      return;
    }

    this._advanceTurn();
  }

  _advanceTurn() {
    this.turnCount++;
    this.matchStats.totalTurns = this.turnCount;

    // Thaw worms on the team whose turn just completed, and tick poison on all living poisoned worms
    for (const w of this.worms) {
      if (!w.alive || w.dying) continue;
      if (w.teamIndex === this.activeTeamIndex && w.frozenTurns > 0) {
        w.frozenTurns = Math.max(0, w.frozenTurns - 1);
      }
      if (w.poisoned && w.hp > 1) {
        const pdmg = Math.min(5, w.hp - 1);
        w.applyDamage(pdmg, 0, 0);
        this.particles.addPopup(w.x, w.y - 24, `-${pdmg} POISON`, '#7bed9f', 13, 1.0);
        this._emitFx({ kind: 'popup', x: w.x, y: w.y - 24, text: `-${pdmg} POISON`, color: '#7bed9f', size: 13, duration: 1.0 });
      }
    }

    // Expire placed magnets after 4 turns
    for (let i = this.magnets.length - 1; i >= 0; i--) {
      this.magnets[i].turnsLeft--;
      if (this.magnets[i].turnsLeft <= 0) {
        this.magnets.splice(i, 1);
      }
    }

    // Sudden Death rising water!
    if (this.turnCount >= this.config.suddenDeathTurns) {
      if (!this.suddenDeathActive) {
        this.suddenDeathActive = true;
        this.sound.playSiren();
        this._emitSound('siren');
        this.showBanner('ВНЕЗАПНАЯ СМЕРТЬ! ВОДА ПОДНИМАЕТСЯ!', '#ff4757', 2.8);
      }
      this.waterY = Math.max(260, this.waterY - 26);
    }

    // Spawn occasional supply crate (38% chance)
    if (this.crates.length < 3 && Math.random() < 0.38) {
      const cx = 160 + Math.random() * (WORLD_W - 320);
      const isHealth = Math.random() < 0.45;
      const rarePool = ['holy', 'banana', 'cluster', 'airstrike', 'homing', 'dynamite', 'teleport', 'mortar', 'sheep', 'supersheep', 'cow', 'meteor', 'napalm', 'icebomb', 'poison'];
      const payload = isHealth ? null : rarePool[Math.floor(Math.random() * rarePool.length)];
      this.crates.push(new Crate(cx, -30, isHealth ? 'health' : 'weapon', payload));
    }

    // Shift wind dynamically
    const deltaWind = Math.round((Math.random() * 2 - 1) * 45);
    this.wind = clamp(this.wind + deltaWind, -100, 100);

    // Advance to next team with living worms
    for (let step = 1; step <= this.teams.length; step++) {
      const nextIdx = (this.activeTeamIndex + step) % this.teams.length;
      if (this.getTeamWorms(nextIdx, true).length > 0) {
        this.activeTeamIndex = nextIdx;
        break;
      }
    }

    this._beginActiveTeamTurn(false);
  }

  // --- Online Multiplayer Host/Guest Sync Methods ---

  startGuestMatch(config) {
    this.startMatch(config);
    this.setNetworkMode('guest', 1);
  }

  getSnapshot() {
    const r = (n) => Math.round(n * 10) / 10;
    return {
      phase: this.phase,
      activeTeamIndex: this.activeTeamIndex,
      turnCount: this.turnCount,
      wind: this.wind,
      waterY: r(this.waterY),
      suddenDeathActive: this.suddenDeathActive,
      turnTimer: r(this.turnTimer),
      retreatTimer: r(this.retreatTimer),
      blowtorchTimer: r(this.blowtorchTimer),
      selectedWeaponId: this.selectedWeaponId,
      fuseSeconds: this.fuseSeconds,
      shotsRemaining: this.shotsRemaining,
      chargePower: Math.round(this.chargePower * 1000) / 1000,
      jetpackFuel: r(this.jetpackFuel),
      jetpackThrusting: this.jetpackThrusting,
      airstrikeDir: this.airstrikeDir,
      girderAngle: Math.round(this.girderAngle * 1000) / 1000,
      pendingMapTarget: this.pendingMapTarget ? { x: r(this.pendingMapTarget.x), y: r(this.pendingMapTarget.y) } : null,
      hoverWorldX: r(this.hoverWorldX),
      hoverWorldY: r(this.hoverWorldY),
      bannerText: this.bannerText,
      bannerColor: this.bannerColor,
      bannerTimer: r(this.bannerTimer),
      winnerTeamIndex: this.winnerTeamIndex,
      matchStats: this.matchStats,
      teams: this.teams.map((t) => {
        const inv = {};
        for (const [k, v] of Object.entries(t.inventory)) {
          inv[k] = v === Infinity ? -1 : v;
        }
        return {
          index: t.index,
          name: t.name,
          isAI: t.isAI,
          activeWormId: t.activeWormId,
          damageDealt: Math.round(t.damageDealt),
          kills: t.kills,
          inventory: inv,
        };
      }),
      worms: this.worms.map((w) => ({
        id: w.id,
        name: w.name,
        teamIndex: w.teamIndex,
        x: r(w.x),
        y: r(w.y),
        vx: r(w.vx),
        vy: r(w.vy),
        hp: w.hp,
        maxHp: w.maxHp,
        facing: w.facing,
        aimPitch: Math.round(w.aimPitch * 1000) / 1000,
        grounded: w.grounded,
        alive: w.alive,
        dying: w.dying,
        walkCycle: r(w.walkCycle),
        walkTimer: r(w.walkTimer),
        fireTimer: r(w.fireTimer),
        hurtTimer: r(w.hurtTimer),
        panicTimer: r(w.panicTimer),
        jumpKind: w.jumpKind,
        airTime: r(w.airTime),
        landSquash: Math.round(w.landSquash * 100) / 100,
        poisoned: w.poisoned,
        frozenTurns: w.frozenTurns,
      })),
      walkers: this.walkers.map((wk) => ({
        kind: wk.kind,
        x: r(wk.x),
        y: r(wk.y),
        dir: wk.dir,
        fuse: r(wk.fuse),
        flying: wk.flying,
        flyAngle: Math.round(wk.flyAngle * 1000) / 1000,
      })),
      magnets: this.magnets.map((mag) => ({
        x: r(mag.x),
        y: r(mag.y),
        teamIndex: mag.teamIndex,
        turnsLeft: mag.turnsLeft,
      })),
      ropeState: this.ropeState
        ? { anchorX: r(this.ropeState.anchorX), anchorY: r(this.ropeState.anchorY), length: r(this.ropeState.length), wormId: this.ropeState.wormId }
        : null,
      drillTimer: r(this.drillTimer),
      projectiles: this.projectiles.map((p) => ({
        type: p.type,
        x: r(p.x),
        y: r(p.y),
        vx: r(p.vx),
        vy: r(p.vy),
        angle: Math.round(p.angle * 1000) / 1000,
        fuse: r(p.fuse),
        fuseable: p.fuseable,
      })),
      mines: this.mines.map((m) => ({
        x: r(m.x),
        y: r(m.y),
        triggered: m.triggered,
        timer: r(m.timer),
      })),
      barrels: this.barrels.map((b) => ({
        x: r(b.x),
        y: r(b.y),
        hp: r(b.hp),
      })),
      crates: this.crates.map((c) => ({
        x: r(c.x),
        y: r(c.y),
        kind: c.kind,
        payload: c.payload,
        landed: c.landed,
        swayPhase: r(c.swayPhase),
      })),
      graves: this.graves.map((g) => ({
        x: r(g.x),
        y: r(g.y),
        teamIndex: g.teamIndex,
        name: g.name,
      })),
      airstrikePlane: this.airstrikePlane
        ? { x: r(this.airstrikePlane.x), y: r(this.airstrikePlane.y), dir: this.airstrikePlane.dir }
        : null,
    };
  }

  applySnapshot(snap) {
    if (!snap) return;
    const isGuestTurn = snap.activeTeamIndex === 1;
    this.phase = snap.phase;
    this.activeTeamIndex = snap.activeTeamIndex;
    this.turnCount = snap.turnCount;
    this.wind = snap.wind;
    this.waterY = snap.waterY;
    this.suddenDeathActive = snap.suddenDeathActive;
    this.turnTimer = snap.turnTimer;
    this.retreatTimer = snap.retreatTimer;
    this.blowtorchTimer = snap.blowtorchTimer;
    this.selectedWeaponId = snap.selectedWeaponId;
    this.fuseSeconds = snap.fuseSeconds;
    this.shotsRemaining = snap.shotsRemaining;
    this.chargePower = snap.chargePower;
    this.jetpackFuel = snap.jetpackFuel;
    this.jetpackThrusting = snap.jetpackThrusting;
    this.airstrikeDir = snap.airstrikeDir;
    if (!isGuestTurn) {
      this.girderAngle = snap.girderAngle;
      this.hoverWorldX = snap.hoverWorldX;
      this.hoverWorldY = snap.hoverWorldY;
    }
    this.pendingMapTarget = snap.pendingMapTarget || null;
    this.bannerText = snap.bannerText || '';
    this.bannerColor = snap.bannerColor || '#ffffff';
    this.bannerTimer = snap.bannerTimer || 0;
    this.winnerTeamIndex = snap.winnerTeamIndex;
    if (snap.matchStats) this.matchStats = snap.matchStats;

    if (Array.isArray(snap.teams)) {
      for (const st of snap.teams) {
        const t = this.teams[st.index];
        if (!t) continue;
        t.name = st.name;
        t.isAI = st.isAI;
        t.activeWormId = st.activeWormId;
        t.damageDealt = st.damageDealt;
        t.kills = st.kills;
        if (st.inventory) {
          for (const [k, v] of Object.entries(st.inventory)) {
            t.inventory[k] = v === -1 ? Infinity : v;
          }
        }
      }
    }

    if (Array.isArray(snap.worms)) {
      const byId = new Map(this.worms.map((w) => [w.id, w]));
      const nextWorms = [];
      for (const sw of snap.worms) {
        let w = byId.get(sw.id);
        if (!w) {
          w = new Worm({ id: sw.id, name: sw.name, teamIndex: sw.teamIndex, x: sw.x, y: sw.y, hp: sw.maxHp });
        }
        w.name = sw.name;
        w.teamIndex = sw.teamIndex;
        w.x = sw.x;
        w.y = sw.y;
        w.vx = sw.vx;
        w.vy = sw.vy;
        w.hp = sw.hp;
        w.maxHp = sw.maxHp;
        w.facing = sw.facing;
        w.aimPitch = sw.aimPitch;
        w.grounded = sw.grounded;
        w.alive = sw.alive;
        w.dying = sw.dying;
        w.walkCycle = sw.walkCycle;
        w.walkTimer = sw.walkTimer;
        w.fireTimer = sw.fireTimer;
        w.hurtTimer = sw.hurtTimer;
        w.panicTimer = sw.panicTimer;
        w.jumpKind = sw.jumpKind;
        w.airTime = sw.airTime;
        w.landSquash = sw.landSquash;
        w.poisoned = Boolean(sw.poisoned);
        w.frozenTurns = sw.frozenTurns || 0;
        nextWorms.push(w);
      }
      this.worms = nextWorms;
    }

    this.walkers = (snap.walkers || []).map((swk) => {
      const wk = new Walker({
        kind: swk.kind,
        x: swk.x,
        y: swk.y,
        dir: swk.dir,
        fuse: swk.fuse,
      });
      wk.flying = Boolean(swk.flying);
      wk.flyAngle = swk.flyAngle || 0;
      return wk;
    });

    this.magnets = (snap.magnets || []).map((smag) => new MagnetProp(smag.x, smag.y, smag.teamIndex, smag.turnsLeft));
    this.ropeState = snap.ropeState || null;
    if (typeof snap.drillTimer === 'number') this.drillTimer = snap.drillTimer;

    this.projectiles = (snap.projectiles || []).map((sp) => {
      const p = new Projectile({
        type: sp.type,
        x: sp.x,
        y: sp.y,
        vx: sp.vx,
        vy: sp.vy,
        fuse: sp.fuse,
        fuseable: sp.fuseable,
      });
      p.angle = sp.angle;
      return p;
    });

    this.mines = (snap.mines || []).map((sm) => {
      const m = new Mine(sm.x, sm.y);
      m.triggered = sm.triggered;
      m.timer = sm.timer;
      return m;
    });

    this.barrels = (snap.barrels || []).map((sb) => {
      const b = new Barrel(sb.x, sb.y);
      b.hp = sb.hp;
      return b;
    });

    this.crates = (snap.crates || []).map((sc) => {
      const c = new Crate(sc.x, sc.y, sc.kind, sc.payload);
      c.landed = sc.landed;
      c.swayPhase = sc.swayPhase;
      return c;
    });

    this.graves = (snap.graves || []).map((sg) => new Grave(sg.x, sg.y, sg.teamIndex, sg.name));
    this.airstrikePlane = snap.airstrikePlane || null;

    this.onHudUpdate?.(this);
  }

  applyTerrainOp(op) {
    if (!op) return;
    if (op.op === 'carve') {
      this.terrain.carveCircle(op.cx, op.cy, op.radius, op.scorchWidth ?? 4);
    } else if (op.op === 'girder') {
      this.terrain.placeGirder(op.x, op.y, op.angle, op.length ?? 96, op.thickness ?? 12);
    }
  }

  applyFxEvent(fx) {
    if (!fx) return;
    switch (fx.kind) {
      case 'explosion':
        if (!fx.silentAudio) this.sound.playExplosion(fx.radius);
        this.particles.spawnExplosion(fx.cx, fx.cy, Math.max(14, fx.radius), this.terrain, fx.particleColor || null);
        this.camera.shake(Math.min(18, Math.max(4, fx.radius * 0.24)), 0.34);
        if (fx.label) {
          this.particles.addPopup(fx.cx, fx.cy - fx.radius * 0.6, fx.label, fx.particleColor || '#ffe875', 22, 1.2);
        } else if (fx.radius >= 45) {
          this.particles.addPopup(fx.cx, fx.cy - fx.radius * 0.5, fx.radius >= 70 ? 'БА-БАХ!' : 'БА-БАХ!', '#ffe875', 19, 0.9);
        }
        break;
      case 'splash':
        this.particles.spawnSplash(fx.x, fx.y, fx.isLava);
        this.sound.playSplash();
        break;
      case 'teleport':
        this.particles.spawnTeleport(fx.x0, fx.y0);
        this.particles.spawnTeleport(fx.x1, fx.y1);
        this.sound.playTeleport();
        break;
      case 'angel':
        this.particles.spawnAngel(fx.x, fx.y);
        break;
      case 'gas':
        this.particles.spawnGasCloud(fx.x, fx.y);
        break;
      case 'ice':
        this.particles.spawnIceBurst(fx.x, fx.y);
        break;
      case 'sonic':
        this.particles.spawnSonicWave(fx.x, fx.y, fx.angle);
        break;
      case 'popup':
        this.particles.addPopup(fx.x, fx.y, fx.text, fx.color, fx.size, fx.duration);
        break;
      case 'tracer':
        this.tracers.push({
          x0: fx.x0,
          y0: fx.y0,
          x1: fx.x1,
          y1: fx.y1,
          color: fx.color,
          width: fx.width,
          life: fx.life,
          maxLife: fx.maxLife || fx.life,
        });
        break;
      case 'shake':
        this.camera.shake(fx.intensity, fx.duration);
        break;
      case 'sound':
        if (fx.name === 'jump') this.sound.playJump();
        else if (fx.name === 'bounce') this.sound.playBounce(fx.arg);
        else if (fx.name === 'launch') this.sound.playLaunch(fx.arg);
        else if (fx.name === 'shotgun') this.sound.playShotgun();
        else if (fx.name === 'uzi') this.sound.playUziShot();
        else if (fx.name === 'bat') this.sound.playBatSwing();
        else if (fx.name === 'hallelujah') this.sound.playHallelujah();
        else if (fx.name === 'pickup') this.sound.playPickup();
        else if (fx.name === 'hurt') this.sound.playHurt();
        else if (fx.name === 'siren') this.sound.playSiren();
        else if (fx.name === 'click') this.sound.playClick();
        break;
      default:
        break;
    }
  }

  applyRemoteGameOver(payload) {
    if (!payload) return;
    this.phase = PHASES.GAME_OVER;
    this.winnerTeamIndex = payload.winnerTeamIndex;
    if (payload.matchStats) this.matchStats = payload.matchStats;
    if (Array.isArray(payload.teams)) {
      for (const st of payload.teams) {
        const t = this.teams[st.index];
        if (t) {
          t.damageDealt = st.damageDealt;
          t.kills = st.kills;
        }
      }
    }
    this.sound.playVictory();
    this.onHudUpdate?.(this);
    this.onGameOver?.(this);
  }

  applyRemoteInput(inputState) {
    if (this.netRole !== 'host' || this.activeTeamIndex !== 1 || !inputState) return;
    this.input.left = Boolean(inputState.left);
    this.input.right = Boolean(inputState.right);
    this.input.up = Boolean(inputState.up);
    this.input.down = Boolean(inputState.down);
  }

  applyRemoteAim(aim) {
    if (this.netRole !== 'host' || this.activeTeamIndex !== 1 || !aim) return;
    if (this.phase !== PHASES.PLAYER_TURN) return;
    const w = this.getActiveWorm();
    if (!w) return;
    if (typeof aim.wx === 'number' && typeof aim.wy === 'number') {
      this.hoverWorldX = aim.wx;
      this.hoverWorldY = aim.wy;
      const weapon = WEAPON_MAP[this.selectedWeaponId];
      if (weapon && (weapon.targetMode === 'aim' || weapon.targetMode === 'instant' || (weapon.id === 'homing' && this.pendingMapTarget))) {
        w.setAimFromWorldPoint(aim.wx, aim.wy);
      }
    }
  }

  applyRemoteAction(action) {
    if (this.netRole !== 'host' || this.activeTeamIndex !== 1 || !action) return;
    const worm = this.getActiveWorm();
    switch (action.kind) {
      case 'jump':
        if (this.phase === PHASES.PLAYER_TURN || this.phase === PHASES.RETREAT) {
          if (worm?.jump()) {
            this.sound.playJump();
            this._emitSound('jump');
          }
        }
        break;
      case 'backflip':
        if (this.phase === PHASES.PLAYER_TURN || this.phase === PHASES.RETREAT) {
          if (worm?.backflip()) {
            this.sound.playJump();
            this._emitSound('jump');
          }
        }
        break;
      case 'select_weapon':
        this.selectWeapon(action.weaponId);
        break;
      case 'set_fuse':
        this.setFuseSeconds(action.sec);
        break;
      case 'begin_charge':
        if (typeof action.wx === 'number' && typeof action.wy === 'number') {
          worm?.setAimFromWorldPoint(action.wx, action.wy);
        }
        this.beginCharge();
        break;
      case 'release_charge':
        this.releaseCharge();
        break;
      case 'stop_jetpack':
        this.stopJetpack();
        break;
      case 'stop_drill':
        this.stopDrill();
        break;
      case 'stop_rope':
        this.stopRope();
        break;
      case 'trigger_active':
        this.triggerActiveSpecial();
        break;
      case 'rotate_girder':
        if (this.phase === PHASES.PLAYER_TURN) {
          this.girderAngle += Number(action.delta) || 0;
        }
        break;
      case 'airstrike_dir':
        this.airstrikeDir = action.dir >= 0 ? 1 : -1;
        break;
      case 'map_click':
        if (this.phase !== PHASES.PLAYER_TURN) break;
        this.setPendingMapTarget(action.wx, action.wy);
        if (
          this.selectedWeaponId === 'airstrike' ||
          this.selectedWeaponId === 'napalm' ||
          this.selectedWeaponId === 'meteor' ||
          this.selectedWeaponId === 'magnet' ||
          this.selectedWeaponId === 'teleport' ||
          this.selectedWeaponId === 'girder'
        ) {
          if (typeof action.girderAngle === 'number') this.girderAngle = action.girderAngle;
          if (typeof action.airstrikeDir === 'number') this.airstrikeDir = action.airstrikeDir;
          this.fireWeapon();
        } else if (this.selectedWeaponId === 'homing') {
          this.showBanner('Цель захвачена! Наведитесь и удерживайте ЛКМ или Пробел для запуска', '#48dbfb', 1.8);
        }
        break;
      default:
        break;
    }
  }
}
