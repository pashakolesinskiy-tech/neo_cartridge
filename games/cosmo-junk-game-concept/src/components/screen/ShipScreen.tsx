"use client";

import ResultsCard from "@/components/ResultsCard";
import GameCanvas from "@/components/screen/GameCanvas";
import Hud from "@/components/screen/Hud";
import LobbyView from "@/components/screen/LobbyView";
import type { BotDifficulty } from "@/lib/game/bots";
import { BotCrew } from "@/lib/game/bots";
import { GameSim } from "@/lib/game/sim";
import type { QueuedInput, Role, RoomPublic, Snapshot } from "@/lib/game/types";
import { ROLE_META, ROLE_ORDER } from "@/lib/game/types";
import { sfx } from "@/lib/sfx";
import { Home, Loader2, Satellite, Volume2, VolumeX } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Ui = "lobby" | "count" | "play" | "ended";

export interface BotSlot {
  role: Role;
  name: string;
}

export default function ShipScreen({ code }: { code: string }) {
  const [room, setRoom] = useState<RoomPublic | null>(null);
  const [missing, setMissing] = useState(false);
  const [ui, setUi] = useState<Ui>("lobby");
  const [countN, setCountN] = useState(3);
  const [snap, setSnap] = useState<Snapshot | null>(null);
  const [muted, setMuted] = useState(false);

  // --- боты ---
  const [difficulty, setDifficulty] = useState<BotDifficulty>("norm");
  const [disabledRoles, setDisabledRoles] = useState<Role[]>([]);
  const [botSlots, setBotSlots] = useState<BotSlot[]>([]);
  const botsRef = useRef<BotCrew | null>(null);
  if (botsRef.current === null) botsRef.current = new BotCrew();

  const simRef = useRef<GameSim | null>(null);
  const finalizedRef = useRef(false);
  const roomRef = useRef<RoomPublic | null>(null);
  const botSlotsRef = useRef<BotSlot[]>([]);
  roomRef.current = room;
  botSlotsRef.current = botSlots;

  const api = useCallback(
    async (path: string, init?: RequestInit) => {
      const res = await fetch(`/api/rooms/${code}${path}`, { cache: "no-store", ...init });
      if (res.status === 404) {
        setMissing(true);
        return null;
      }
      return res.json();
    },
    [code]
  );

  // первичная загрузка
  useEffect(() => {
    (async () => {
      const data = (await api("?host=1")) as (RoomPublic & { inputs?: QueuedInput[] }) | null;
      if (!data) return;
      if (data.phase === "playing") {
        await fetch(`/api/rooms/${code}/host`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ op: "reset" }),
        });
        const again = (await api("?host=1")) as RoomPublic | null;
        setRoom(again);
      } else {
        setRoom(data);
      }
    })();
  }, [api, code]);

  // ---- состав живых игроков (ключ для пересчёта ботов) ----
  const liveKey = useMemo(
    () =>
      (room?.players ?? [])
        .filter((p) => p.connected && p.role !== "spectator")
        .map((p) => p.role)
        .sort()
        .join(","),
    [room]
  );
  const disabledKey = disabledRoles.slice().sort().join(",");

  // ---- синхронизация ботов ----
  useEffect(() => {
    const bots = botsRef.current;
    if (!bots) return;
    bots.setDifficulty(difficulty);

    const covered = new Set(
      (roomRef.current?.players ?? [])
        .filter((p) => p.connected && p.role !== "spectator")
        .map((p) => p.role)
    );
    const disabled = new Set(disabledRoles);
    const want = ROLE_ORDER.filter((r) => !covered.has(r) && !disabled.has(r));

    const { added, removed } = bots.sync(simRef.current, want);
    const sim = simRef.current;
    if (sim && !sim.result) {
      for (const r of added) {
        sim.log(`${bots.nameOf(r) ?? "БОТ"} занял кресло: ${ROLE_META[r].label}. Подменяет!`);
      }
      for (const r of removed) {
        sim.log(`${ROLE_META[r].label}: живой человек вернулся, бот идёт пить масло.`);
      }
    }

    const next = want.map((r) => ({ role: r, name: bots.nameOf(r) ?? "БОТ" }));
    if (JSON.stringify(next) !== JSON.stringify(botSlotsRef.current)) setBotSlots(next);
  }, [liveKey, disabledKey, difficulty, disabledRoles]);

  // опрос лобби / финиша
  useEffect(() => {
    if (ui !== "lobby" && ui !== "ended") return;
    const i = setInterval(async () => {
      const data = (await api("?host=1")) as RoomPublic | null;
      if (data) {
        setRoom((prev) =>
          prev && JSON.stringify(prev.players) === JSON.stringify(data.players) ? prev : data
        );
      }
    }, 1000);
    return () => clearInterval(i);
  }, [ui, api]);

  // во время игры: забираем ввод с телефонов
  useEffect(() => {
    if (ui !== "play") return;
    let alive = true;
    const i = setInterval(async () => {
      const data = (await api("?host=1")) as (RoomPublic & { inputs?: QueuedInput[] }) | null;
      if (!alive || !data) return;
      const sim = simRef.current;
      if (sim && data.inputs) {
        for (const m of data.inputs) sim.applyInput(m);
      }
      setRoom((prev) =>
        prev && JSON.stringify(prev.players) === JSON.stringify(data.players) ? prev : data
      );
    }, 130);
    return () => {
      alive = false;
      clearInterval(i);
    };
  }, [ui, api]);

  // снапшоты для телефонов + финализация
  useEffect(() => {
    if (ui !== "play") return;
    const i = setInterval(() => {
      const sim = simRef.current;
      if (!sim) return;
      const s = sim.snapshot(sim.result ? "ended" : "playing");
      setSnap(s);
      void fetch(`/api/rooms/${code}/host`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ op: "snapshot", snapshot: s }),
      }).catch(() => undefined);
      if (sim.result && !finalizedRef.current) {
        finalizedRef.current = true;
        finalize();
      }
    }, 260);
    return () => clearInterval(i);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ui, code]);

  useEffect(() => {
    if (ui !== "play" || !snap) {
      sfx.setAlarmLoop(false);
      return;
    }
    sfx.setAlarmLoop(snap.fires > 0 || snap.hull < 28 || snap.errors.length > 0);
  }, [snap, ui]);

  const finalize = useCallback(() => {
    setTimeout(async () => {
      sfx.stopMusic();
      sfx.setAlarmLoop(false);
      const sim = simRef.current;
      if (!sim?.result) return;
      if (sim.result.won) {
        sfx.play("resolve");
        setTimeout(() => sfx.play("go"), 250);
      } else {
        sfx.play("fail");
      }
      const humans =
        roomRef.current?.players.filter((p) => p.role !== "spectator").map((p) => p.name) ?? [];
      const botNames = botSlotsRef.current.map((b) => `${b.name} (БОТ)`);
      await fetch("/api/leaderboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          shipName: roomRef.current?.shipName ?? "НЕИЗВЕСТНЫЙ",
          crew: [...humans, ...botNames],
          bots: botSlotsRef.current.length,
          result: sim.result,
        }),
      }).catch(() => undefined);
      setUi("ended");
    }, 1700);
  }, [code]);

  const start = async () => {
    sfx.ensure();
    sfx.play("confirm");
    const sim = new GameSim();
    simRef.current = sim;
    finalizedRef.current = false;
    if (botSlotsRef.current.length) {
      sim.log(
        `Автопилоты в строю: ${botSlotsRef.current.map((b) => b.name).join(", ")}. Не подведите их.`
      );
    }
    setSnap(sim.snapshot("playing"));
    await fetch(`/api/rooms/${code}/host`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ op: "start" }),
    }).catch(() => undefined);
    setUi("count");
    setCountN(3);
    let n = 3;
    const timer = setInterval(() => {
      n -= 1;
      if (n > 0) {
        setCountN(n);
        sfx.play("count");
      } else {
        clearInterval(timer);
        sfx.play("go");
        sfx.startMusic();
        setUi("play");
      }
    }, 900);
    sfx.play("count");
  };

  const reset = async () => {
    sfx.ensure();
    sfx.play("click");
    await fetch(`/api/rooms/${code}/host`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ op: "reset" }),
    }).catch(() => undefined);
    simRef.current = null;
    finalizedRef.current = false;
    setSnap(null);
    setUi("lobby");
  };

  const toggleMute = () => {
    sfx.ensure();
    const next = !muted;
    setMuted(next);
    sfx.setMuted(next);
  };

  const toggleBot = (role: Role) => {
    sfx.ensure();
    sfx.play("click");
    setDisabledRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  if (missing) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-5 px-4 text-center">
        <Satellite className="h-10 w-10 text-rose-400" />
        <p className="font-pixel text-sm text-rose-400">КОМНАТА {code} НЕ НАЙДЕНА</p>
        <p className="max-w-sm font-term text-xs text-slate-400">
          Возможно, корабль улетел в другой сектор (комната истекла). Создай новую на главном экране.
        </p>
        <Link href="/" className="pxl-btn bg-cyan-400 px-6 py-3 font-pixel text-xs text-black">
          НА ГЛАВНУЮ
        </Link>
      </div>
    );
  }

  return (
    <div className="relative min-h-dvh overflow-hidden">
      {ui === "lobby" && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center opacity-45"
            style={{
              backgroundImage:
                "radial-gradient(ellipse at 22% 28%, rgba(88, 224, 255, 0.24), transparent 55%), radial-gradient(ellipse at 78% 68%, rgba(255, 72, 164, 0.2), transparent 55%), radial-gradient(circle at 50% 50%, #101b33 0%, #060a14 100%)",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#04060e]/70 via-transparent to-[#04060e]" />
          <div className="crt-scan" />
          <div className="crt-glow" />
        </>
      )}

      <div className="absolute left-0 right-0 top-0 z-50 flex items-center justify-between p-3">
        <Link
          href="/"
          className="pointer-events-auto inline-flex items-center gap-2 border border-slate-800 bg-[#070d18]/80 px-3 py-1.5 font-pixel text-[9px] text-slate-400 hover:text-cyan-300"
        >
          <Home className="h-3.5 w-3.5" /> ВЫХОД
        </Link>
        <button
          onClick={toggleMute}
          className="pointer-events-auto inline-flex items-center gap-2 border border-slate-800 bg-[#070d18]/80 px-3 py-1.5 font-pixel text-[9px] text-slate-400 hover:text-cyan-300"
        >
          {muted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
          {muted ? "ТИХО" : "ЗВУК"}
        </button>
      </div>

      {ui === "lobby" &&
        (room ? (
          <LobbyView
            room={room}
            onStart={() => void start()}
            starting={false}
            botSlots={botSlots}
            difficulty={difficulty}
            onDifficulty={(d) => {
              sfx.ensure();
              sfx.play("click");
              setDifficulty(d);
            }}
            disabledRoles={disabledRoles}
            onToggleBot={toggleBot}
          />
        ) : (
          <div className="flex min-h-dvh items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
          </div>
        ))}

      {ui !== "lobby" && (
        <div className="relative flex min-h-dvh items-center justify-center p-2">
          <div className="relative aspect-video w-full max-w-[1600px] overflow-hidden border-2 border-[#14202e] bg-black shadow-[0_0_80px_rgba(34,211,238,0.08)]">
            <GameCanvas
              simRef={simRef}
              botsRef={botsRef}
              active={ui === "play"}
              phase={ui === "play" ? "playing" : "ended"}
            />
            {snap && ui !== "count" && room && (
              <Hud
                snap={snap}
                shipName={room.shipName}
                code={code}
                players={room.players}
                botSlots={botSlots}
              />
            )}
            <div className="crt-scan" />
            <div className="crt-rgb" />
            <div className="crt-flicker" />
            <div className="crt-glow" />

            {ui === "count" && (
              <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/45">
                <div className="font-pixel text-[10px] tracking-[0.4em] text-cyan-300">ЗАПУСК</div>
                <div
                  className="mt-4 font-pixel text-8xl text-amber-300"
                  style={{ textShadow: "4px 4px 0 #000, 0 0 60px #ffb00066" }}
                >
                  {countN}
                </div>
              </div>
            )}

            {ui === "ended" && snap?.result && room && (
              <div className="absolute inset-0 z-40 flex items-center justify-center overflow-y-auto bg-black/55 p-4">
                <div className="max-h-full overflow-y-auto py-6">
                  <ResultsCard result={snap.result} shipName={room.shipName} onAgain={() => void reset()} />
                  <p className="mt-4 text-center font-term text-[11px] text-slate-500">
                    {botSlots.length > 0
                      ? `В экипаже было ботов: ${botSlots.length}. Они уже пишут мемуары.`
                      : "Полностью живой экипаж. Уважение."}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
