"use client";

import { useEffect, useRef } from "react";

/** Атмосферный фон: параллакс-звёзды, дрейфующий кораблик и пролетающие астероиды */
export default function AmbientCanvas({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = false;
    };
    resize();
    window.addEventListener("resize", resize);

    const LAYERS = [
      { n: 60, spd: 9, size: 1, color: "#3a5a78" },
      { n: 40, spd: 22, size: 1.6, color: "#6d95b8" },
      { n: 22, spd: 48, size: 2.4, color: "#bfe3ff" },
    ].map((L) => ({
      ...L,
      stars: Array.from({ length: L.n }, () => ({
        x: Math.random() * 2000,
        y: Math.random() * 1200,
      })),
    }));

    const rocks = Array.from({ length: 5 }, (_, i) => ({
      x: Math.random() * 1600,
      y: 80 + i * 140 + Math.random() * 100,
      r: 14 + Math.random() * 22,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.4,
      spd: 30 + Math.random() * 40,
      seed: Math.random() * 100,
    }));

    let shipY = 0.5;
    let last = performance.now();

    let sheetOk = false;
    const sheet = new Image();
    sheet.onload = () => {
      sheetOk = true;
    };
    sheet.src = "sprites/cosmo_junk_sheet.png";

    const drawRock = (x: number, y: number, r: number, rot: number, seed: number) => {
      if (sheetOk) {
        const col = Math.abs(Math.floor(seed)) % 3;
        const sz = r * 2.35;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rot);
        ctx.imageSmoothingEnabled = true;
        ctx.drawImage(sheet, col * 192, 192, 192, 192, -sz * 0.5, -sz * 0.5, sz, sz);
        ctx.restore();
        return;
      }
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.fillStyle = "#2a3542";
      const pts = 9;
      ctx.beginPath();
      for (let i = 0; i < pts; i++) {
        const a = (i / pts) * Math.PI * 2;
        const rr = r * (0.72 + 0.28 * Math.abs(Math.sin(seed + i * 2.3)));
        const px = Math.round(Math.cos(a) * rr);
        const py = Math.round(Math.sin(a) * rr);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#3d4d5e";
      ctx.fillRect(Math.round(-r * 0.4), Math.round(-r * 0.45), Math.round(r * 0.5), Math.round(r * 0.35));
      ctx.restore();
    };

    const drawShip = (x: number, y: number, t: number) => {
      if (sheetOk) {
        ctx.save();
        ctx.translate(x, y + Math.sin(t * 2) * 3);
        ctx.imageSmoothingEnabled = true;
        ctx.drawImage(sheet, 192, 0, 192, 192, -48, -48, 96, 96);
        ctx.restore();
        return;
      }
      const u = 3;
      const px = (dx: number, dy: number, wd: number, ht: number, c: string) => {
        ctx.fillStyle = c;
        ctx.fillRect(Math.round(x + dx * u), Math.round(y + dy * u), wd * u, ht * u);
      };
      // thruster
      const fl = 1.4 + Math.sin(t * 18) * 0.6 + Math.random() * 0.4;
      px(-13.4, -1, -fl * 2, 2, "#2dd4ee44");
      px(-13, -0.5, -fl * 1.3, 1, "#9be8ff");
      // engine
      px(-13, -2, 3, 4, "#1c2733");
      px(-10.5, -1, 1, 2, "#0d141c");
      // hull
      px(-10, -3, 14, 6, "#8ca6b3");
      px(-10, 2, 13, 1.4, "#5a7280");
      px(4, -2, 4, 4, "#8ca6b3");
      px(8, -1, 1.6, 2, "#8ca6b3");
      px(-9, -3.6, 12, 1, "#b8cdd6");
      // glass
      px(3, -1.6, 3, 2, "#5ff2f2");
      px(4.4, -1.2, 1.2, 1, "#bdfcff");
      // stripe
      px(-3, -3, 2, 6, "#ffb000");
      // fins
      px(-7, -4.6, 4, 1.8, "#ffb000");
      px(-7, 2.8, 4, 1.8, "#ffb000");
    };

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      ctx.clearRect(0, 0, w, h);

      for (const L of LAYERS) {
        ctx.fillStyle = L.color;
        for (const s of L.stars) {
          s.x -= L.spd * dt;
          if (s.x < -4) {
            s.x = w + 4;
            s.y = Math.random() * h;
          }
          ctx.globalAlpha = 0.4 + 0.6 * Math.abs(Math.sin((s.x + s.y) * 0.05 + now * 0.001));
          ctx.fillRect(Math.round(s.x), Math.round(s.y % h), L.size, L.size);
        }
      }
      ctx.globalAlpha = 1;

      for (const r of rocks) {
        r.x -= r.spd * dt;
        r.rot += r.vr * dt;
        if (r.x < -60) {
          r.x = w + 60;
          r.y = Math.random() * h;
        }
        drawRock(r.x, r.y, r.r, r.rot, r.seed);
      }

      shipY = 0.5 + Math.sin(now * 0.0004) * 0.16;
      drawShip(w * 0.68, h * shipY, now / 1000);

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} className={className ?? "h-full w-full"} />;
}
