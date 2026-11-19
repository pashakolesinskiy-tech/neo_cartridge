"use client";

import AmbientCanvas from "@/components/landing/AmbientCanvas";
import { sfx } from "@/lib/sfx";
import { Loader2, MonitorPlay, QrCode, Rocket, Smartphone, Wrench } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LandingClient() {
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");

  const createRoom = async () => {
    sfx.ensure();
    sfx.play("confirm");
    setCreating(true);
    try {
      const res = await fetch("/api/rooms", { method: "POST" });
      const data = (await res.json()) as { code: string };
      router.push(`/ship/${data.code}`);
    } catch {
      setErr("СВЯЗЬ С ЗЕМЛЁЙ ПОТЕРЯНА. ПОПРОБУЙ ЕЩЁ.");
      setCreating(false);
    }
  };

  const join = () => {
    const c = code.trim().toUpperCase();
    if (c.length < 4) {
      setErr("КОД — 4 СИМВОЛА С ГЛАВНОГО ЭКРАНА");
      return;
    }
    sfx.ensure();
    sfx.play("confirm");
    router.push(`/play/${c}`);
  };

  return (
    <div className="relative min-h-dvh overflow-hidden">
      {/* фон */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-55"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 22% 28%, rgba(88, 224, 255, 0.24), transparent 55%), radial-gradient(ellipse at 78% 68%, rgba(255, 72, 164, 0.2), transparent 55%), radial-gradient(circle at 50% 50%, #101b33 0%, #060a14 100%)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#04060e]/60 via-[#04060e]/35 to-[#04060e]" />
      <div className="absolute inset-0">
        <AmbientCanvas />
      </div>
      <div className="crt-scan" />
      <div className="crt-glow" />
      <div className="scan-sweep" />

      <div className="relative z-10 mx-auto flex min-h-dvh max-w-5xl flex-col items-center px-4 py-10">
        {/* шапка */}
        <div className="flex items-center gap-3 text-[10px] tracking-[0.35em] text-cyan-300/80">
          <Rocket className="h-4 w-4" strokeWidth={2.4} />
          <span className="font-pixel">COSMO-JUNK CO-OP TERMINAL v1.3</span>
        </div>

        <h1
          className="glitchy mt-8 text-center font-pixel text-4xl leading-tight text-cyan-200 sm:text-6xl"
          style={{ textShadow: "3px 3px 0 #ff3b5b66, -3px -3px 0 #22d3ee55, 0 0 32px #22d3ee44" }}
        >
          КОСМО-ХЛАМ
        </h1>
        <p className="mt-5 max-w-xl text-center font-term text-sm text-slate-300 sm:text-base">
          Экипаж разваливающегося грузовика против беспощадного сектора.
          <br />
          <span className="text-amber-300">1 экран</span> — корабль.{" "}
          <span className="text-amber-300">2–4 телефона</span> — пульты. Голос — главный интерфейс.
        </p>

        {/* CTA */}
        <div className="mt-10 flex w-full max-w-md flex-col items-stretch gap-4">
          <button
            onClick={createRoom}
            disabled={creating}
            className="pxl-btn bg-amber-400 px-6 py-5 font-pixel text-sm text-black sm:text-base"
          >
            {creating ? (
              <span className="inline-flex items-center justify-center gap-3">
                <Loader2 className="h-5 w-5 animate-spin" /> ЗАГРУЖАЕМ ТРЮМ…
              </span>
            ) : (
              "СОЗДАТЬ КОРАБЛЬ"
            )}
          </button>
          <div className="flex items-stretch gap-3">
            <input
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 4));
                setErr("");
              }}
              onKeyDown={(e) => e.key === "Enter" && join()}
              placeholder="КОД"
              className="pxl-input w-0 flex-1 px-4 py-3 text-center font-pixel text-base tracking-[0.5em] text-cyan-200"
            />
            <button onClick={join} className="pxl-btn bg-cyan-400 px-5 py-3 font-pixel text-xs text-black">
              НА БОРТ
            </button>
          </div>
          {err && <p className="text-center font-term text-xs text-rose-400 blink-hard">{err}</p>}
        </div>

        {/* как играть */}
        <div className="mt-14 grid w-full grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            {
              icon: MonitorPlay,
              title: "1 · ЭКРАН",
              text: "Открой игру на ПК или ТВ — там появится корабль и QR-код.",
              color: "#57e6e6",
            },
            {
              icon: QrCode,
              title: "2 · ТЕЛЕФОНЫ",
              text: "Друзья сканируют QR. Каждому достаётся своя панель: штурвал, тумблеры, щит или мануал.",
              color: "#ffb000",
            },
            {
              icon: Wrench,
              title: "3 · ХАОС",
              text: "На экране загорается ERROR 404. Кричите друг другу инструкции и не сгорите.",
              color: "#ff4bd8",
            },
          ].map((s) => (
            <div key={s.title} className="pxl-panel p-5">
              <s.icon className="h-6 w-6" style={{ color: s.color }} strokeWidth={2.2} />
              <h3 className="mt-3 font-pixel text-xs" style={{ color: s.color }}>
                {s.title}
              </h3>
              <p className="mt-2 font-term text-xs leading-relaxed text-slate-400">{s.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex items-center gap-2 text-center font-term text-[11px] text-slate-500">
          <Smartphone className="h-4 w-4" />
          Ничего скачивать не нужно — телефон открывает ссылку из QR-кода
        </div>
      </div>
    </div>
  );
}
