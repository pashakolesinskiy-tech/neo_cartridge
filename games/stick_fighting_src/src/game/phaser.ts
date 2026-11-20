import { WORLD_HEIGHT, WORLD_WIDTH, type Settings, type Snapshot } from './types';
import { FightEngine } from './engine';
import { onSpritesReady } from './sprites';

export interface ArenaInstance {
  engine: FightEngine;
  destroy: () => void;
}

/**
 * Mounts the 1920x1080 (2x 960x540 world) fighting arena onto a native 2D canvas
 * driven by a fixed 60 Hz requestAnimationFrame loop (zero Phaser bundle overhead).
 */
export function createGame(
  container: HTMLElement,
  settings: Settings,
  onSnapshot: (snapshot: Snapshot) => void,
): ArenaInstance {
  container.replaceChildren();

  const canvas = document.createElement('canvas');
  canvas.width = WORLD_WIDTH * 2;
  canvas.height = WORLD_HEIGHT * 2;
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.display = 'block';
  canvas.setAttribute('aria-label', 'Stick Fighting Arena');
  container.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  const engine = new FightEngine(settings, onSnapshot);

  let destroyed = false;
  let rafId = 0;
  let lastTime = performance.now();
  let accumulator = 0;
  const FIXED_STEP_SEC = 1 / 60;

  const unsubscribeSprites = onSpritesReady(() => {
    if (!destroyed && ctx) engine.draw(ctx);
  });

  const tick = (now: number) => {
    if (destroyed) return;
    const elapsedSec = Math.min(0.05, Math.max(0, (now - lastTime) / 1000));
    lastTime = now;
    accumulator += elapsedSec;

    let steps = 0;
    while (accumulator >= FIXED_STEP_SEC && steps < 3) {
      engine.step(FIXED_STEP_SEC);
      accumulator -= FIXED_STEP_SEC;
      steps += 1;
    }

    if (ctx) {
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      engine.draw(ctx);
      ctx.restore();
    }

    rafId = requestAnimationFrame(tick);
  };

  if (ctx) engine.draw(ctx);
  rafId = requestAnimationFrame(tick);

  return {
    engine,
    destroy: () => {
      if (destroyed) return;
      destroyed = true;
      cancelAnimationFrame(rafId);
      unsubscribeSprites();
      canvas.remove();
    },
  };
}
