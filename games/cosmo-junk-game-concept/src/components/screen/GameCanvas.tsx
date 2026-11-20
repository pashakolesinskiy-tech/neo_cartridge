"use client";

import { Renderer } from "@/components/screen/renderer";
import type { BotCrew } from "@/lib/game/bots";
import type { GameSim } from "@/lib/game/sim";
import { WORLD } from "@/lib/game/sim";
import type { Phase } from "@/lib/game/types";
import { useEffect, useRef } from "react";

export default function GameCanvas({
  simRef,
  botsRef,
  active,
  phase,
}: {
  simRef: React.MutableRefObject<GameSim | null>;
  botsRef?: React.MutableRefObject<BotCrew | null>;
  active: boolean;
  phase: Phase;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);
  const phaseRef = useRef<Phase>(phase);
  activeRef.current = active;
  phaseRef.current = phase;

  useEffect(() => {
    const renderer = new Renderer();
    renderer.reset();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;

    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const sim = simRef.current;
      if (sim) {
        if (activeRef.current) {
          botsRef?.current?.update(sim, dt);
          sim.update(dt);
        }
        renderer.draw(ctx, sim, phaseRef.current, dt, now);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [simRef, botsRef]);

  return (
    <canvas
      ref={canvasRef}
      width={WORLD.w}
      height={WORLD.h}
      className="h-full w-full object-contain"
    />
  );
}
