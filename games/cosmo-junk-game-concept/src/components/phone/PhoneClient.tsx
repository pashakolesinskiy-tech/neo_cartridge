"use client";

import ResultsCard from "@/components/ResultsCard";
import {
  EngineerPanel, GunnerPanel, NavigatorPanel, PilotPanel, SpectatorPanel,
} from "@/components/phone/panels";
import type { InputMsg, Role, RoomPublic } from "@/lib/game/types";
import { ROLE_META } from "@/lib/game/types";
import { sfx, vibrate } from "@/lib/sfx";
import {
  BookOpen, Crosshair, Eye, Gamepad2, Loader2, Radio, Rocket, Satellite, TriangleAlert, Wrench,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

const ROLE_ICONS: Record<Role, typeof Gamepad2> = {
  pilot: Gamepad2,
  engineer: Wrench,
  gunner: Crosshair,
  navigator: BookOpen,
  spectator: Eye,
};

interface Joined {
  playerId: string;
  role: Role;
  name: string;
  shipName: string;
}

export default function PhoneClient({ code }: { code: string }) {
  const [joined, setJoined] = useState<Joined | null>(null);
  const [name, setName] = useState("");
  const [room, setRoom] = useState<RoomPublic | null>(null);
  const [missing, setMissing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [flashKey, setFlashKey] = useState(0);
  const [alarmKey, setAlarmKey] = useState(0);

  const prevShake = useRef(-1);
  const prevErr = useRef(-1);
  const joinedRef = useRef<Joined | null>(null);
  joinedRef.current = joined;

  const doJoin = useCallback(
    async (callName: string, playerId?: string) => {
      setBusy(true);
      setErr("");
      try {
        const res = await fetch(`/api/rooms/${code}/join`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: callName, playerId }),
        });
        if (res.status === 404) {
          setMissing(true);
          return;
        }
        const data = (await res.json()) as Joined & { error?: string };
        const j: Joined = {
          playerId: data.playerId,
          role: data.role,
          name: data.name,
          shipName: data.shipName,
        };
        setJoined(j);
        try {
          sessionStorage.setItem(`cosmo:${code}`, JSON.stringify({ playerId: j.playerId, name: j.name }));
        } catch { /* noop */ }
        sfx.ensure();
        sfx.play("confirm");
        vibrate(30);
      } catch {
        setErr("НЕТ СВЯЗИ С КОРАБЛЁМ");
      } finally {
        setBusy(false);
      }
    },
    [code]
  );

  // автореконнект
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(`cosmo:${code}`);
      if (!raw) return;
      const saved = JSON.parse(raw) as { playerId?: string; name?: string };
      if (saved.playerId) void doJoin(saved.name ?? "", saved.playerId);
    } catch { /* noop */ }
  }, [code, doJoin]);

  // опрос состояния
  useEffect(() => {
    if (!joined) return;
    let alive = true;
    const poll = async () => {
      try {
        const res = await fetch(`/api/rooms/${code}?player=${joined.playerId}`, { cache: "no-store" });
        if (res.status === 404) {
          if (alive) setMissing(true);
          return;
        }
        const data = (await res.json()) as RoomPublic;
        if (!alive) return;
        setRoom(data);
        const snap = data.snapshot;
        if (snap) {
          if (prevShake.current >= 0 && snap.shakeSeq > prevShake.current) {
            vibrate(snap.lastShake >= 10 ? [70, 40, 120] : 60);
            sfx.play("hit");
            setFlashKey((k) => k + 1);
          }
          if (prevErr.current >= 0 && snap.errSeq > prevErr.current) {
            vibrate([30, 50, 30]);
            sfx.play("alarm");
            setAlarmKey((k) => k + 1);
          }
          prevShake.current = snap.shakeSeq;
          prevErr.current = snap.errSeq;
        }
      } catch { /* оффлайн — молча */ }
    };
    void poll();
    const i = setInterval(poll, 700);
    return () => {
      alive = false;
      clearInterval(i);
    };
  }, [joined, code]);

  const send = useCallback(
    (msg: InputMsg) => {
      const j = joinedRef.current;
      if (!j) return;
      void fetch(`/api/rooms/${code}/input`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId: j.playerId, role: j.role, msg }),
      }).catch(() => undefined);
    },
    [code]
  );

  if (missing) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center">
        <Satellite className="h-10 w-10 text-rose-400" />
        <p className="font-pixel text-xs leading-relaxed text-rose-400">
          КОРАБЛЬ С ПОЗЫВНЫМ {code} НЕ ОТВЕЧАЕТ
        </p>
        <p className="font-term text-xs text-slate-400">
          Проверь код на главном экране или попроси начать новую игру.
        </p>
        <Link href="/" className="pxl-btn bg-cyan-400 px-5 py-3 font-pixel text-[10px] text-black">
          НА БАЗУ
        </Link>
      </div>
    );
  }

  // ---- экран входа ----
  if (!joined) {
    return (
      <div className="relative flex min-h-dvh flex-col items-center justify-center gap-6 overflow-hidden px-6">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 22% 28%, rgba(88, 224, 255, 0.24), transparent 55%), radial-gradient(ellipse at 78% 68%, rgba(255, 72, 164, 0.2), transparent 55%), radial-gradient(circle at 50% 50%, #101b33 0%, #060a14 100%)",
          }}
        />
        <div className="crt-scan" />
        <div className="relative z-10 flex w-full max-w-sm flex-col items-center gap-6">
          <Rocket className="floaty h-10 w-10 text-cyan-300" />
          <div className="text-center">
            <h1 className="font-pixel text-lg text-cyan-200">ПОСАДКА НА БОРТ</h1>
            <p className="mt-2 font-term text-xs text-slate-400">
              Корабль <span className="text-amber-300">{code}</span> ждёт. Представься, экипаж!
            </p>
          </div>
          <input
            value={name}
            onChange={(e) => {
              setName(e.target.value.toUpperCase().slice(0, 12));
              setErr("");
            }}
            onKeyDown={(e) => e.key === "Enter" && !busy && void doJoin(name)}
            placeholder="ПОЗЫВНОЙ"
            className="pxl-input w-full px-4 py-4 text-center font-pixel text-sm tracking-[0.3em] text-cyan-200"
          />
          <button
            onClick={() => void doJoin(name)}
            disabled={busy}
            className="pxl-btn w-full bg-amber-400 px-6 py-4 font-pixel text-xs text-black"
          >
            {busy ? <Loader2 className="mx-auto h-5 w-5 animate-spin" /> : "ЗАНЯТЬ КРЕСЛО"}
          </button>
          {err && <p className="font-term text-xs text-rose-400">{err}</p>}
          <p className="text-center font-term text-[10px] text-slate-500">
            Роль выдаёт бортовой компьютер.<br />Спорить с ним бесполезно — он серии ХЛАМ-13.
          </p>
        </div>
      </div>
    );
  }

  const meta = ROLE_META[joined.role];
  const Icon = ROLE_ICONS[joined.role];
  const snap = room?.snapshot ?? null;
  const phase = room?.phase ?? "lobby";
  const result = snap?.result ?? null;
  const showPanel = phase === "playing" && snap && !result;

  return (
    <div
      className="no-touch-callout relative flex min-h-dvh flex-col"
      style={{ background: `linear-gradient(180deg, #04060e 0%, ${meta.dim}14 100%)` }}
    >
      {/* вспышка урона */}
      {flashKey > 0 && (
        <div
          key={flashKey}
          className="pointer-events-none absolute inset-0 z-50"
          style={{
            background: "radial-gradient(ellipse at center, transparent 30%, rgba(255,59,91,0.5) 100%)",
            animation: "dmgFlash 0.7s ease-out forwards",
          }}
        />
      )}

      {/* шапка пульта */}
      <header
        className="z-10 border-b-2 px-4 pb-3 pt-4"
        style={{ borderColor: `${meta.color}55`, background: "#05080fb8" }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 items-center justify-center border-2"
              style={{ borderColor: meta.color, background: `${meta.color}1c` }}
            >
              <Icon className="h-6 w-6" style={{ color: meta.color }} />
            </div>
            <div>
              <div className="font-pixel text-[11px]" style={{ color: meta.color }}>
                {meta.label}
              </div>
              <div className="font-term text-[10px] text-slate-400">
                {joined.name} · {joined.shipName}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 font-pixel text-[8px] text-emerald-300">
            <Radio className={`h-3.5 w-3.5 ${room ? "" : "opacity-30"}`} />
            {room ? "СВЯЗЬ" : "…"}
          </div>
        </div>
      </header>

      {/* тело */}
      <main className="z-10 flex flex-1 flex-col px-4 py-4">
        {!room && (
          <div className="flex flex-1 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" style={{ color: meta.color }} />
          </div>
        )}

        {room && phase === "lobby" && (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <Icon className="floaty h-12 w-12" style={{ color: meta.color }} />
            <div>
              <div className="font-pixel text-sm" style={{ color: meta.color }}>
                ТЫ — {meta.label}
              </div>
              <p className="mt-2 max-w-xs font-term text-xs text-slate-400">{meta.desc}</p>
            </div>
            <div className="pxl-panel w-full max-w-xs p-3">
              <div className="font-pixel text-[8px] text-slate-400">ЭКИПАЖ НА БОРТУ</div>
              <div className="mt-2 space-y-1">
                {room.players.map((p) => {
                  const m = ROLE_META[p.role];
                  return (
                    <div key={p.id} className="flex items-center justify-between font-term text-[11px]">
                      <span style={{ color: m.color }}>{p.name}</span>
                      <span className="text-slate-500">{m.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <p className="font-pixel text-[9px] text-amber-300 blink-hard">
              ЖДЁМ ЗАПУСКА С ГЛАВНОГО ЭКРАНА…
            </p>
            <p className="max-w-xs font-term text-[10px] text-slate-500">
              Свободные кресла займут боты-автопилоты. Если телефон отвалится —
              бот подхватит твою роль, а на возвращении вернёт обратно.
            </p>
          </div>
        )}

        {room && result && (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 overflow-y-auto py-2">
            <ResultsCard result={result} shipName={joined.shipName} compact />
            <p className="font-term text-[11px] text-slate-500">
              Главный экран решает, лететь ли ещё раз…
            </p>
          </div>
        )}

        {room && !result && showPanel && snap && (
          <>
            {joined.role === "pilot" && <PilotPanel snap={snap} send={send} />}
            {joined.role === "engineer" && <EngineerPanel snap={snap} send={send} />}
            {joined.role === "gunner" && <GunnerPanel snap={snap} send={send} />}
            {joined.role === "navigator" && <NavigatorPanel snap={snap} send={send} />}
            {joined.role === "spectator" && <SpectatorPanel snap={snap} send={send} />}
          </>
        )}
      </main>

      {/* новая авария — всплывашка */}
      {alarmKey > 0 && snap && snap.errors.length > 0 && !result && (
        <div
          key={`alarm-${alarmKey}`}
          className="pointer-events-none absolute left-1/2 top-20 z-50 -translate-x-1/2 border-2 border-rose-500 bg-[#1c050c]/95 px-4 py-2.5"
          style={{ animation: "dmgFlash 2.6s ease-out forwards" }}
        >
          <span className="inline-flex items-center gap-2 font-pixel text-[10px] text-rose-400">
            <TriangleAlert className="h-4 w-4" /> {snap.errors[snap.errors.length - 1].code} НА БОРТУ!
          </span>
        </div>
      )}
    </div>
  );
}
