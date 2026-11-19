import test from 'node:test';
import assert from 'node:assert/strict';

import { AIController } from '../src/ai.js';
import { BASE_WATER_Y, DT, PHASES, WORLD_H, WORLD_W } from '../src/constants.js';
import { Projectile, Worm, Crate } from '../src/entities.js';
import { GameEngine } from '../src/game.js';
import { Terrain } from '../src/terrain.js';
import { SPRITE_RECTS } from '../src/sprites.js';
import { WEAPONS, WEAPON_MAP } from '../src/weapons.js';

test('Terrain generates seeded geometry, carves craters, and computes surface normals', () => {
  const t1 = new Terrain(WORLD_W, WORLD_H, 'meadow', 12345);
  const t2 = new Terrain(WORLD_W, WORLD_H, 'meadow', 12345);
  assert.equal(t1.solidCount, t2.solidCount);
  assert.ok(t1.solidCount > 100000);

  const gy = t1.findGroundY(600, 0);
  assert.ok(gy > 100 && gy < BASE_WATER_Y);
  assert.equal(t1.isSolid(600, gy), true);
  assert.equal(t1.isSolid(600, gy - 2), false);

  const normal = t1.getSurfaceNormal(600, gy, 5);
  assert.ok(normal.y < 0, `Expected upward surface normal, got ${JSON.stringify(normal)}`);

  const before = t1.solidCount;
  const removed = t1.carveCircle(600, gy + 12, 36, 4);
  assert.ok(removed > 1000);
  assert.equal(t1.solidCount, before - removed);
  assert.equal(t1.isSolid(600, gy + 12), false);
});

test('Worm walks up slopes, takes fall damage on high drops, and drowns in water', () => {
  const terrain = new Terrain(WORLD_W, WORLD_H, 'meadow', 777);
  const spawns = terrain.findSafeSpawns(2, 180);
  const worm = new Worm({
    id: 1,
    name: 'TestWorm',
    teamIndex: 0,
    x: spawns[0].x,
    y: spawns[0].y,
    hp: 100,
  });

  // Settle onto ground
  for (let i = 0; i < 60; i++) {
    worm.stepPhysics(DT, terrain, BASE_WATER_Y);
  }
  assert.equal(worm.grounded, true);
  const startX = worm.x;
  const moved = worm.walk(1, DT * 10, terrain);
  assert.equal(moved, true);
  assert.ok(worm.x > startX);

  // High fall damage test
  const fallWorm = new Worm({
    id: 2,
    name: 'Faller',
    teamIndex: 0,
    x: 600,
    y: 50,
    hp: 100,
  });
  let fallEvents = 0;
  for (let i = 0; i < 180; i++) {
    fallWorm.stepPhysics(DT, terrain, BASE_WATER_Y, {
      onFallDamage: () => fallEvents++,
    });
    if (fallWorm.grounded || !fallWorm.alive) break;
  }
  assert.ok(fallEvents >= 1 || !fallWorm.alive);
  assert.ok(fallWorm.hp < 100, `Expected fall damage, HP stayed ${fallWorm.hp}`);

  // Drowning test
  const waterWorm = new Worm({
    id: 3,
    name: 'Swimmer',
    teamIndex: 0,
    x: 20,
    y: BASE_WATER_Y - 5,
    hp: 100,
  });
  let drowned = false;
  for (let i = 0; i < 60; i++) {
    waterWorm.stepPhysics(DT, terrain, BASE_WATER_Y, {
      onDrown: () => {
        drowned = true;
      },
    });
  }
  assert.equal(drowned, true);
  assert.equal(waterWorm.alive, false);
  assert.equal(waterWorm.drowning, true);
});

test('Wind deflects Bazooka projectile while Frag Grenade ignores wind', () => {
  const terrain = new Terrain(WORLD_W, WORLD_H, 'meadow', 100);
  // Carve wide open air at y=200
  const wind = 90;
  const bazooka = new Projectile({
    type: 'bazooka',
    x: 300,
    y: 200,
    vx: 200,
    vy: -250,
    windAffected: true,
    fuseable: false,
  });
  const grenade = new Projectile({
    type: 'grenade',
    x: 300,
    y: 200,
    vx: 200,
    vy: -250,
    windAffected: false,
    fuseable: true,
    fuse: 4,
  });

  for (let i = 0; i < 60; i++) {
    bazooka.step(DT, terrain, wind, BASE_WATER_Y, []);
    grenade.step(DT, terrain, wind, BASE_WATER_Y, []);
  }

  assert.ok(
    bazooka.x > grenade.x + 40,
    `Expected wind-affected bazooka (${bazooka.x.toFixed(1)}) ahead of grenade (${grenade.x.toFixed(1)})`
  );
  assert.ok(Math.abs(grenade.vx - 200) < 0.01);
});

test('Explosion deals radial falloff damage, knockback, and carves terrain', () => {
  const engine = new GameEngine();
  engine.startMatch({
    theme: 'meadow',
    seed: 999,
    wormsPerTeam: 2,
    startHp: 100,
    turnTime: 45,
    suddenDeathTurns: 14,
    teams: [
      { name: 'Red', isAI: false },
      { name: 'Blue', isAI: true, aiDifficulty: 'normal' },
    ],
  });

  const target = engine.worms.find((w) => w.teamIndex === 1);
  const startHp = target.hp;
  const startSolid = engine.terrain.solidCount;

  engine.explode(target.x + 6, target.y + 4, 48, 45, 360, {
    attackerTeamIndex: 0,
    attackerWormName: 'Tester',
  });

  assert.ok(target.hp < startHp, 'Worm near blast must take damage');
  assert.ok(Math.hypot(target.vx, target.vy) > 40, 'Worm near blast must receive knockback');
  assert.ok(engine.terrain.solidCount < startSolid, 'Explosion must carve crater');
});

test('AI ballistic solver finds an accurate trajectory under wind', () => {
  const terrain = new Terrain(WORLD_W, WORLD_H, 'meadow', 555);
  const spawns = terrain.findSafeSpawns(2, 220);
  const shooter = new Worm({ id: 1, name: 'Bot', teamIndex: 1, x: spawns[0].x, y: spawns[0].y });
  const target = new Worm({ id: 2, name: 'Target', teamIndex: 0, x: spawns[1].x, y: spawns[1].y });

  const shot = AIController.solveBallisticShot(
    shooter,
    target,
    terrain,
    45,
    WEAPON_MAP.bazooka,
    [shooter, target]
  );

  assert.ok(shot, 'AI solver must return a shot plan');
  assert.ok(shot.missDist < 120, `Expected reasonable miss distance, got ${shot.missDist}`);
});

test('Turn progression advances cleanly and Sudden Death raises water level', () => {
  const engine = new GameEngine();
  engine.startMatch({
    theme: 'desert',
    seed: 222,
    wormsPerTeam: 2,
    startHp: 100,
    turnTime: 30,
    suddenDeathTurns: 3,
    teams: [
      { name: 'Alpha', isAI: false },
      { name: 'Bravo', isAI: false },
    ],
  });

  assert.equal(engine.phase, PHASES.PLAYER_TURN);
  assert.equal(engine.turnCount, 1);
  assert.equal(engine.activeTeamIndex, 0);
  const baseWater = engine.waterY;

  // Simulate turn timer expiration -> resolving -> turn 2
  engine.turnTimer = 0.01;
  for (let i = 0; i < 60; i++) {
    engine.step(DT);
    if (engine.turnCount === 2 && engine.phase === PHASES.PLAYER_TURN) break;
  }
  assert.equal(engine.turnCount, 2);
  assert.equal(engine.activeTeamIndex, 1);
  assert.equal(engine.suddenDeathActive, false);

  // Advance to turn 3 -> Sudden Death triggers!
  engine.turnTimer = 0.01;
  for (let i = 0; i < 60; i++) {
    engine.step(DT);
    if (engine.turnCount === 3 && engine.phase === PHASES.PLAYER_TURN) break;
  }
  assert.equal(engine.turnCount, 3);
  assert.equal(engine.suddenDeathActive, true);
  assert.ok(engine.waterY < baseWater, `Expected water to rise below ${baseWater}, got ${engine.waterY}`);
});

test('Grenade bounce damps velocity cleanly and settles without wild ricochet', () => {
  const terrain = new Terrain(WORLD_W, WORLD_H, 'meadow', 100);
  const gy = terrain.findGroundY(600, 0);
  const grenade = new Projectile({
    type: 'grenade',
    x: 600,
    y: gy - 30,
    vx: 250,
    vy: 430,
    windAffected: false,
    fuseable: true,
    fuse: 5.0,
    restitution: WEAPON_MAP.grenade.restitution,
    groundFriction: WEAPON_MAP.grenade.groundFriction,
  });

  const initialSpeed = Math.hypot(grenade.vx, grenade.vy);
  let bounceCount = 0;
  let speedAfterFirstBounce = null;
  for (let i = 0; i < 120; i++) {
    grenade.step(DT, terrain, 0, BASE_WATER_Y, [], {
      onBounce: () => {
        bounceCount++;
        if (bounceCount === 1) {
          speedAfterFirstBounce = Math.hypot(grenade.vx, grenade.vy);
        }
      },
    });
  }

  assert.ok(bounceCount >= 1 && bounceCount <= 5, `Expected 1-5 bounces, got ${bounceCount}`);
  assert.ok(
    speedAfterFirstBounce !== null && speedAfterFirstBounce < initialSpeed * 0.7,
    `Expected speed after first bounce (${speedAfterFirstBounce?.toFixed(1)}) < 70% of ${initialSpeed.toFixed(1)}`
  );
  const finalSpeed = Math.hypot(grenade.vx, grenade.vy);
  assert.ok(finalSpeed < 60, `Expected grenade to settle, final speed=${finalSpeed.toFixed(1)}`);
});

test('AI Shotgun turn completes promptly and airborne crate does not stall turn', () => {
  const engine = new GameEngine();
  engine.startMatch({
    theme: 'meadow',
    seed: 333,
    wormsPerTeam: 1,
    startHp: 100,
    turnTime: 45,
    suddenDeathTurns: 14,
    teams: [
      { name: 'Red', isAI: false },
      { name: 'Blue', isAI: true, aiDifficulty: 'normal' },
    ],
  });

  // Skip turn 1 to enter AI turn (turn 2)
  engine.turnTimer = 0.01;
  for (let i = 0; i < 180; i++) {
    engine.step(DT);
    if (engine.turnCount === 2 && engine.phase === PHASES.PLAYER_TURN) break;
  }
  assert.equal(engine.turnCount, 2);
  assert.equal(engine.activeTeamIndex, 1);

  // Place both worms in open terrain < 260px apart with clear line of sight
  const aiWorm = engine.worms.find((w) => w.teamIndex === 1);
  const humanWorm = engine.worms.find((w) => w.teamIndex === 0);
  engine.terrain.carveCircle(600, 420, 140, 0);
  engine.terrain.placeGirder(600, 480, 0, 260, 16);
  aiWorm.x = 500;
  aiWorm.y = 460;
  aiWorm.vx = 0;
  aiWorm.vy = 0;
  aiWorm.grounded = true;
  humanWorm.x = 700;
  humanWorm.y = 460;
  humanWorm.vx = 0;
  humanWorm.vy = 0;
  humanWorm.grounded = true;

  // Clear random mines/barrels near the test girder so only the airborne crate is tested
  engine.mines = [];
  engine.barrels = [];
  // Add an airborne parachuting crate high in the sky
  engine.crates.push(new Crate(600, 40, 'health'));

  // Step up to 4.5s (270 ticks) — AI should fire shotgun (both shots) & finish turn without stalling
  let returnedToHuman = false;
  for (let i = 0; i < 270; i++) {
    engine.step(DT);
    if (engine.turnCount === 3 && engine.phase === PHASES.PLAYER_TURN) {
      returnedToHuman = true;
      break;
    }
  }

  assert.equal(returnedToHuman, true, `Expected AI turn to finish in < 4.5s, phase=${engine.phase}, stage=${engine.ai.stage}`);
  assert.equal(engine.activeTeamIndex, 0);
  assert.ok(humanWorm.hp < 100, 'Expected human worm to take shotgun damage');
});

test('Worm forward jump and backflip arcs are compact and land smoothly without fall damage', () => {
  const terrain = new Terrain(WORLD_W, WORLD_H, 'meadow', 100);
  terrain.carveCircle(600, 420, 160, 0);
  terrain.placeGirder(600, 480, 0, 320, 16);

  // Forward jump test
  const jumper = new Worm({ id: 1, name: 'Jumper', teamIndex: 0, x: 560, y: 462, hp: 100, facing: 1 });
  for (let i = 0; i < 30; i++) jumper.stepPhysics(DT, terrain, BASE_WATER_Y);
  assert.equal(jumper.grounded, true);

  const startX = jumper.x;
  const startY = jumper.y;
  let minY = startY;
  assert.equal(jumper.jump(), true);

  for (let i = 0; i < 90; i++) {
    jumper.stepPhysics(DT, terrain, BASE_WATER_Y);
    if (jumper.y < minY) minY = jumper.y;
    if (jumper.grounded) break;
  }
  const jumpApex = startY - minY;
  const jumpSpan = jumper.x - startX;
  assert.equal(jumper.grounded, true);
  assert.equal(jumper.hp, 100);
  assert.ok(jumpApex >= 18 && jumpApex <= 40, `Expected forward jump apex 18-40px, got ${jumpApex.toFixed(1)}`);
  assert.ok(jumpSpan >= 40 && jumpSpan <= 90, `Expected forward jump span 40-90px, got ${jumpSpan.toFixed(1)}`);

  // Backflip test
  const flipper = new Worm({ id: 2, name: 'Flipper', teamIndex: 0, x: 640, y: 462, hp: 100, facing: 1 });
  for (let i = 0; i < 30; i++) flipper.stepPhysics(DT, terrain, BASE_WATER_Y);
  assert.equal(flipper.grounded, true);

  const flipStartX = flipper.x;
  const flipStartY = flipper.y;
  let flipMinY = flipStartY;
  assert.equal(flipper.backflip(), true);

  for (let i = 0; i < 120; i++) {
    flipper.stepPhysics(DT, terrain, BASE_WATER_Y);
    if (flipper.y < flipMinY) flipMinY = flipper.y;
    if (flipper.grounded) break;
  }
  const flipApex = flipStartY - flipMinY;
  const flipBackDist = flipStartX - flipper.x;
  assert.equal(flipper.grounded, true);
  assert.equal(flipper.hp, 100);
  assert.ok(flipApex >= 50 && flipApex <= 80, `Expected backflip apex 50-80px, got ${flipApex.toFixed(1)}`);
  assert.ok(flipBackDist >= 25 && flipBackDist <= 60, `Expected backflip dist 25-60px, got ${flipBackDist.toFixed(1)}`);
});

test('Arsenal exposes all 34 weapons with valid sprite sheet icon mappings', () => {
  assert.equal(WEAPONS.length, 34);
  const seen = new Set();
  let spriteCount = 0;
  for (const w of WEAPONS) {
    assert.ok(w.id && !seen.has(w.id), `Duplicate or missing weapon id: ${w.id}`);
    seen.add(w.id);
    assert.ok(w.spriteIcon || w.iconSvg, `Missing both spriteIcon and iconSvg for ${w.id}`);
    if (w.spriteIcon) {
      spriteCount++;
      assert.ok(
        SPRITE_RECTS[w.spriteIcon.sheet]?.[w.spriteIcon.key],
        `Missing sprite rect ${w.spriteIcon.sheet}.${w.spriteIcon.key} for ${w.id}`
      );
    }
  }
  assert.ok(spriteCount >= 32, `Expected >= 32 sprite-backed weapons, got ${spriteCount}`);
});

test('Mortar splits into 4 shrapnel sub-munitions and Sheep detonates on manual trigger', () => {
  const engine = new GameEngine();
  engine.startMatch({
    theme: 'meadow',
    seed: 707,
    wormsPerTeam: 1,
    startHp: 100,
    turnTime: 45,
    suddenDeathTurns: 14,
    teams: [
      { name: 'Red', isAI: false },
      { name: 'Blue', isAI: false },
    ],
  });

  // Mortar split test
  engine.terrain.carveCircle(620, 420, 150, 0);
  engine.terrain.placeGirder(620, 480, 0, 320, 16);
  const red = engine.worms.find((w) => w.teamIndex === 0);
  const blue = engine.worms.find((w) => w.teamIndex === 1);
  red.x = 520;
  red.y = 462;
  red.vx = 0;
  red.vy = 0;
  red.grounded = true;
  blue.x = 690;
  blue.y = 462;
  blue.vx = 0;
  blue.vy = 0;
  blue.grounded = true;

  engine.selectWeapon('mortar');
  red.facing = 1;
  red.aimPitch = -0.35;
  assert.equal(engine.fireWeapon(0.45), true);
  assert.equal(engine.projectiles.length, 1);

  let sawShrapnelCount = 0;
  for (let i = 0; i < 240; i++) {
    engine.step(DT);
    const shrapnel = engine.projectiles.filter((p) => p.type === 'mortar_shrapnel');
    if (shrapnel.length > sawShrapnelCount) sawShrapnelCount = shrapnel.length;
    if (engine.phase === PHASES.PLAYER_TURN && engine.turnCount === 2) break;
  }
  assert.equal(sawShrapnelCount, 4, 'Expected mortar detonation to spawn 4 mortar_shrapnel projectiles');

  // Wait / switch back to team 0 or fire Sheep on team 1's turn!
  const blueActive = engine.getActiveWorm();
  engine.selectWeapon('sheep');
  blueActive.facing = -1;
  const solidBeforeSheep = engine.terrain.solidCount;
  assert.equal(engine.fireWeapon(1), true);
  assert.equal(engine.phase, PHASES.PROJECTILE_ACTIVE);
  assert.equal(engine.walkers.length, 1);
  const startSheepX = engine.walkers[0].x;
  for (let i = 0; i < 15; i++) engine.step(DT);
  assert.ok(engine.walkers[0]?.x < startSheepX, 'Expected sheep to hop left');

  assert.equal(engine.triggerActiveSpecial(), true);
  assert.equal(engine.walkers.length, 0);
  assert.ok(engine.terrain.solidCount < solidBeforeSheep, 'Expected manual sheep detonation to carve terrain');
});

test('Poison Bomb deals damage per turn, Ice Bomb freezes worm movement, Drill carves, and Rope grapples', () => {
  const engine = new GameEngine();
  engine.startMatch({
    theme: 'meadow',
    seed: 808,
    wormsPerTeam: 1,
    startHp: 100,
    turnTime: 45,
    suddenDeathTurns: 14,
    teams: [
      { name: 'Red', isAI: false },
      { name: 'Blue', isAI: false },
    ],
  });

  engine.terrain.carveCircle(600, 420, 170, 0);
  engine.terrain.placeGirder(600, 480, 0, 340, 16);
  engine.terrain.placeGirder(560, 320, 0, 180, 16);

  const red = engine.worms.find((w) => w.teamIndex === 0);
  const blue = engine.worms.find((w) => w.teamIndex === 1);
  red.x = 540;
  red.y = 462;
  red.vx = 0;
  red.vy = 0;
  red.grounded = true;
  blue.x = 700;
  blue.y = 462;
  blue.vx = 0;
  blue.vy = 0;
  blue.grounded = true;

  // Test Toxic Bomb & Ice Bomb explosion status application directly on blue
  engine._handleProjectileExplosion({
    type: 'poison',
    ownerId: red.id,
    teamIndex: 0,
    x: blue.x,
    y: blue.y,
    damage: 20,
    blastRadius: 28,
    knockback: 180,
  });
  assert.equal(blue.poisoned, true);

  engine._handleProjectileExplosion({
    type: 'icebomb',
    ownerId: red.id,
    teamIndex: 0,
    x: blue.x,
    y: blue.y,
    damage: 10,
    blastRadius: 24,
    knockback: 150,
  });
  assert.ok(blue.frozenTurns >= 1);
  assert.equal(blue.walk(1, DT, engine.terrain), false, 'Frozen worm must not walk');

  const hpBeforeTurn = blue.hp;
  engine._advanceTurn();
  assert.equal(blue.hp, hpBeforeTurn - 5, 'Poisoned worm should take 5 poison damage on turn advance');

  // Advance back to Red and test Ninja Rope + Pneumatic Drill
  engine._advanceTurn();
  const activeRed = engine.getActiveWorm();
  activeRed.x = 560;
  activeRed.y = 462;
  activeRed.grounded = true;
  activeRed.facing = 1;
  activeRed.aimPitch = -Math.PI * 0.45;
  assert.equal(engine.selectWeapon('rope'), true);
  assert.equal(engine.fireWeapon(1), true);
  assert.equal(engine.phase, PHASES.ROPE);
  assert.ok(engine.ropeState && engine.ropeState.anchorY <= 340);
  engine.stopRope();
  assert.equal(engine.ropeState, null);
  assert.equal(engine.phase, PHASES.RETREAT);

  // Switch back to Blue (or start fresh turn on Red for drill)
  engine._advanceTurn();
  const blueDrill = engine.getActiveWorm();
  blueDrill.x = 560;
  blueDrill.y = 462;
  blueDrill.grounded = true;
  const startY = blueDrill.y;
  const solidBeforeDrill = engine.terrain.solidCount;
  assert.equal(engine.selectWeapon('drill'), true);
  assert.equal(engine.phase, PHASES.DRILL);
  for (let i = 0; i < 15; i++) engine.step(DT);
  assert.ok(blueDrill.y > startY, 'Expected pneumatic drill to descend');
  assert.ok(engine.terrain.solidCount < solidBeforeDrill, 'Expected pneumatic drill to carve rock');
  engine.stopDrill();
  assert.equal(engine.phase, PHASES.RETREAT);
});
