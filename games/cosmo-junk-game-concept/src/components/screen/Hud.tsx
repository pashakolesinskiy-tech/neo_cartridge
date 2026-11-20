"use client";

import type { BotSlot } from "@/components/screen/ShipScreen";
import type { PlayerInfo, Snapshot } from "@/lib/game/types";
import { ROLE_META } from "@/lib/game/types";
import {
  BookOpen, Bot, Crosshair, Eye, Flame, Gamepad2, Thermometer, Wrench,
} from "lucide-react";

const ROLE_ICONS = {
  pilot: Gamepad2,
  engineer: Wrench,
  gunner: Crosshair,
  navigator: BookOpen,
  spectator: Eye,
} as const;

function PixBar({
  value, max, colorFrom, colorTo, danger,
}: {
  value: number; max: number; colorFrom: string; colorTo: string; danger?: boolean;
}) {
  const pct = Math.max(0, Math.min(1, value / max));
  const cells = 18;
  const filled = Math.round(pct * cells);
  const colorOf = (i: number) => {
    const t = i / cells;
    return mix(colorFrom, colorTo, t);
  };
  return (
    <div className={`flex gap-[1.5px] sm:gap-[2px] md:gap-[3px] ${danger ? "blink-fast" : ""}`}>
      {Array.from({ length: cells }, (_, i) => (
        <span
          key={i}
          className="h-2 w-[4px] sm:h-3 sm:w-[6px] md:h-3.5 md:w-[8px]"
          style={{ background: i < filled ? colorOf(i) : "#14202e" }}
        />
      ))}
    </div>
  );
}

function mix(a: string, b: string, t: number) {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  const c = pa.map((v, i) => Math.round(v + (pb[i] - v) * t).toString(16).padStart(2, "0"));
  return `#${c.join("")}`;
}

export default function Hud({
  snap, shipName, code, players, botSlots = [],
}: {
  snap: Snapshot;
  shipName: string;
  code: string;
  players: PlayerInfo[];
  botSlots?: BotSlot[];
}) {
  const heatDanger = snap.heat > 82;
  const hullDanger = snap.hull < 30;
  const breakersArr = [snap.breakers.A1, snap.breakers.A2, snap.breakers.B1, snap.breakers.B2];

  return (
    <div className="pointer-events-none absolute inset-0 z-30 flex flex-col justify-between p-1.5 sm:p-3 md:p-4">
      {/* верхняя панель */}
      <div className="flex items-start justify-between gap-1.5 sm:gap-3">
        <div className="pxl-panel shrink-0 px-2 py-1 sm:px-3.5 sm:py-2">
          <div className="max-w-[110px] truncate font-pixel text-[8px] text-cyan-300 sm:max-w-none sm:text-[10px]">
            {shipName}
          </div>
          <div className="mt-0.5 font-term text-[8px] tracking-[0.16em] text-slate-500 sm:mt-1 sm:text-[10px] sm:tracking-[0.28em]">
            КОМНАТА <span className="text-amber-300">{code}</span>
          </div>
        </div>

        {/* прогресс */}
        <div className="pxl-panel min-w-0 flex-1 px-2 py-1 sm:px-4 sm:py-2.5">
          <div className="flex items-center justify-between gap-1 whitespace-nowrap font-pixel text-[7px] text-slate-400 sm:text-[9px]">
            <span>СЕКТОР 7</span>
            <span className="text-cyan-300">{Math.round(snap.progress * 100)}%</span>
            <span>СТАНЦИЯ</span>
          </div>
          <div className="relative mt-1.5 h-2 bg-[#14202e] sm:mt-2 sm:h-2.5">
            <div
              className="h-full bg-gradient-to-r from-teal-500 via-cyan-400 to-emerald-300"
              style={{ width: `${snap.progress * 100}%` }}
            />
            <div
              className="absolute -top-[5px] h-4 w-[8px] bg-amber-300 sm:-top-[7px] sm:h-6 sm:w-[10px]"
              style={{ left: `calc(${snap.progress * 100}% - 4px)` }}
            />
          </div>
        </div>

        {/* корпус + жар */}
        <div className="pxl-panel flex shrink-0 items-center gap-2.5 px-2 py-1 sm:gap-4 sm:px-4 sm:py-2.5">
          <div>
            <div className="flex items-center gap-1 whitespace-nowrap font-pixel text-[7px] text-slate-400 sm:gap-2 sm:text-[9px]">
              <Flame className="h-3 w-3 text-rose-400 sm:h-3.5 sm:w-3.5" /> КОРПУС
              <span className={hullDanger ? "text-rose-400" : "text-emerald-300"}>{snap.hull}%</span>
            </div>
            <div className="mt-1 sm:mt-1.5">
              <PixBar value={snap.hull} max={100} colorFrom="#ff3b5b" colorTo="#3bff8f" danger={hullDanger} />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1 whitespace-nowrap font-pixel text-[7px] text-slate-400 sm:gap-2 sm:text-[9px]">
              <Thermometer className="h-3 w-3 text-amber-400 sm:h-3.5 sm:w-3.5" /> ЖАР
              <span className={heatDanger ? "text-rose-400" : "text-slate-300"}>{snap.heat}°</span>
            </div>
            <div className="mt-1 sm:mt-1.5">
              <PixBar value={snap.heat} max={100} colorFrom="#2dd4ee" colorTo="#ff3b5b" danger={heatDanger} />
            </div>
          </div>
        </div>
      </div>

      {/* аварии по центру */}
      <div className="absolute left-1/2 top-14 flex w-full max-w-sm -translate-x-1/2 flex-col items-center gap-2 px-3 sm:top-20 sm:max-w-lg sm:gap-3 md:top-24">
        {snap.errors.map((e) => (
          <div
            key={e.code}
            className="w-full border-2 border-rose-500/80 bg-[#1c050c]/90 px-4 py-3 text-center shadow-[0_0_28px_#ff3b5b44]"
          >
            <div className="glitchy font-pixel text-sm text-rose-400">
              {e.code} · {e.title}
            </div>
            <div className="mt-2 h-1.5 w-full bg-[#2a0a12]">
              <div
                className={`h-full ${e.tLeft < 5 ? "bg-rose-500 blink-fast" : "bg-amber-400"}`}
                style={{ width: `${(e.tLeft / e.dur) * 100}%` }}
              />
            </div>
          </div>
        ))}
        {snap.patternTarget && (
          <div className="pxl-panel px-4 py-3 text-center">
            <div className="font-pixel text-[9px] text-slate-400">E-8008 · ВЫСТАВЬ СХЕМУ:</div>
            <div className="mt-2 flex justify-center gap-3">
              {snap.patternTarget.map((on, i) => (
                <div key={i} className="text-center">
                  <div
                    className={`h-10 w-7 border-2 ${on ? "border-emerald-400 bg-emerald-400/30" : "border-rose-500 bg-rose-500/20"}`}
                  >
                    <div className={`mx-auto mt-[3px] h-3.5 w-3 ${on ? "bg-emerald-300" : "translate-y-[14px] bg-rose-400"}`} />
                  </div>
                  <div className={`mt-1 font-pixel text-[8px] ${breakersArr[i] === on ? "text-emerald-300" : "text-slate-500"}`}>
                    {["A1", "A2", "B1", "B2"][i]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {snap.tripped && (
          <div className="border-2 border-amber-400 bg-[#1c1205]/90 px-4 py-2 font-pixel text-[10px] text-amber-300 blink-hard">
            ВЫБИЛО ПРЕДОХРАНИТЕЛЬ {snap.tripped}
          </div>
        )}
      </div>

      {/* нижняя панель */}
      <div className="flex items-end justify-between gap-2 sm:gap-4">
        <div className="flex flex-wrap gap-1 sm:gap-2">
          {players.map((p) => {
            const Icon = ROLE_ICONS[p.role];
            const meta = ROLE_META[p.role];
            return (
              <div key={p.id} className="pxl-panel flex items-center gap-1.5 px-2 py-1 sm:gap-2 sm:px-3 sm:py-2">
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ background: p.connected ? "#3bff8f" : "#ff3b5b" }}
                />
                <Icon className="h-3 w-3 sm:h-4 sm:w-4" style={{ color: meta.color }} />
                <span className="font-pixel text-[7px] sm:text-[9px]" style={{ color: meta.color }}>
                  {p.name}
                </span>
              </div>
            );
          })}
          {botSlots.map((b) => {
            const meta = ROLE_META[b.role];
            return (
              <div
                key={`bot-${b.role}`}
                className="pxl-panel flex items-center gap-1 border-emerald-500/40 px-2 py-1 sm:gap-2 sm:px-3 sm:py-2"
              >
                <Bot className="h-3 w-3 text-emerald-300 sm:h-4 sm:w-4" />
                <span className="font-pixel text-[7px] text-emerald-300 sm:text-[9px]">{b.name}</span>
                <span className="hidden font-pixel text-[8px] sm:inline" style={{ color: meta.color }}>
                  {meta.label}
                </span>
              </div>
            );
          })}
          {players.length === 0 && botSlots.length === 0 && (
            <div className="pxl-panel px-2 py-1 font-pixel text-[8px] text-slate-500 sm:px-3 sm:py-2 sm:text-[9px]">
              ЭКИПАЖ НЕ НАЙДЕН
            </div>
          )}
        </div>

        <div className="pxl-panel max-w-[200px] shrink-0 px-2 py-1 text-right sm:max-w-sm sm:px-3 sm:py-2">
          {snap.hazards.length > 0 && (
            <div className="mb-1 flex justify-end gap-1 sm:mb-1.5 sm:gap-2">
              {snap.hazards.map((h) => (
                <span
                  key={h}
                  className="border border-fuchsia-500/60 bg-fuchsia-950/60 px-1.5 py-0.5 font-pixel text-[7px] text-fuchsia-300 sm:px-2 sm:text-[8px]"
                >
                  {h === "storm" ? "СОЛНЕЧНАЯ БУРЯ" : h === "gravity" ? "ГРАВИКОЛОДЕЦ" : "ПИРАТЫ"}
                </span>
              ))}
            </div>
          )}
          <div className="font-term text-[8px] leading-snug text-slate-500 sm:text-[10px] sm:leading-relaxed">
            {snap.log.slice(-3).map((l, i, arr) => (
              <div key={l + i} className={`truncate ${i === arr.length - 1 ? "text-slate-300" : ""}`}>
                {l}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
