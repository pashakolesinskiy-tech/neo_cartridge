"use client";

import type { GameResult } from "@/lib/game/types";
import { RotateCcw, Skull, Trophy } from "lucide-react";

export const RANK_COLORS: Record<string, string> = {
  S: "#57e6e6",
  A: "#3bff8f",
  B: "#ffb000",
  C: "#ff8c42",
  D: "#b0723a",
  X: "#ff3b5b",
};

const RANK_QUOTES: Record<string, string> = {
  S: "О вас сложат баллады в космопортах.",
  A: "Груз уцелел. Клиент почти не плакал.",
  B: "Корабль дышит. Через раз, но дышит.",
  C: "Станция встретила вас огнетушителем.",
  D: "Технически — это победа. Юридически — тоже.",
  X: "Спаскапсулы проданы ещё вчера. Извините.",
};

export default function ResultsCard({
  result, shipName, onAgain, compact,
}: {
  result: GameResult;
  shipName: string;
  onAgain?: () => void;
  compact?: boolean;
}) {
  const color = RANK_COLORS[result.rankCode] ?? "#fff";
  const Icon = result.won ? Trophy : Skull;
  return (
    <div className={`pxl-panel mx-auto w-full ${compact ? "max-w-sm p-5" : "max-w-xl p-8"} text-center`}>
      <div className="flex items-center justify-center gap-3 font-pixel text-[10px] text-slate-400">
        <Icon className="h-5 w-5" style={{ color }} />
        {result.won ? "СТЫКОВКА УСПЕШНА" : "КОРАБЛЬ ПОТЕРЯН"}
      </div>
      <div className="mt-2 font-pixel text-[11px] text-cyan-300">{shipName}</div>

      <div
        className="glitchy mx-auto mt-5 font-pixel leading-none"
        style={{
          fontSize: compact ? 76 : 120,
          color,
          textShadow: `4px 4px 0 #00000088, 0 0 44px ${color}66`,
        }}
      >
        {result.rankCode}
      </div>
      <div className="mt-3 font-pixel text-xs" style={{ color }}>
        {result.rankTitle}
      </div>
      <p className="mt-3 font-term text-xs text-slate-400">{RANK_QUOTES[result.rankCode]}</p>

      <div className="mt-6 grid grid-cols-3 gap-2 font-term text-xs">
        {[
          ["ОЧКИ", result.score, "#ffb000"],
          ["КОРПУС", `${result.hull}%`, "#3bff8f"],
          ["ПУТЬ", `${result.progress}%`, "#57e6e6"],
          ["АВАРИЙ УСТРАНЕНО", result.resolved, "#3bff8f"],
          ["ПРОВАЛЕНО", result.failed, "#ff3b5b"],
          ["СБИТО", result.kills, "#ff4bd8"],
        ].map(([label, v, c]) => (
          <div key={label as string} className="border border-slate-800 bg-[#070d18] px-2 py-2.5">
            <div className="font-pixel text-sm" style={{ color: c as string }}>
              {v}
            </div>
            <div className="mt-1 text-[9px] tracking-wider text-slate-500">{label}</div>
          </div>
        ))}
      </div>

      {onAgain && (
        <button
          onClick={onAgain}
          className="pxl-btn mt-7 inline-flex items-center gap-2 bg-emerald-400 px-6 py-4 font-pixel text-xs text-black"
        >
          <RotateCcw className="h-4 w-4" /> ЛЕТИМ ЕЩЁ РАЗ
        </button>
      )}
    </div>
  );
}
