"use client";

import ConnectionHelp from "@/components/screen/ConnectionHelp";
import type { BotSlot } from "@/components/screen/ShipScreen";
import type { BotDifficulty } from "@/lib/game/bots";
import { DIFFICULTY_META } from "@/lib/game/bots";
import type { Role, RoomPublic } from "@/lib/game/types";
import { ROLE_META, ROLE_ORDER } from "@/lib/game/types";
import {
  Bot, BookOpen, Copy, Crosshair, Eye, Gamepad2, Play, QrCode, UserPlus, Users, Wrench,
} from "lucide-react";
import QRCode from "qrcode";
import { useEffect, useState } from "react";

const ROLE_ICONS: Record<Role, typeof Gamepad2> = {
  pilot: Gamepad2,
  engineer: Wrench,
  gunner: Crosshair,
  navigator: BookOpen,
  spectator: Eye,
};

export default function LobbyView({
  room, onStart, starting, botSlots, difficulty, onDifficulty, disabledRoles, onToggleBot,
}: {
  room: RoomPublic;
  onStart: () => void;
  starting: boolean;
  botSlots: BotSlot[];
  difficulty: BotDifficulty;
  onDifficulty: (d: BotDifficulty) => void;
  disabledRoles: Role[];
  onToggleBot: (role: Role) => void;
}) {
  const [qr, setQr] = useState("");
  const [joinUrl, setJoinUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const customBase = (window as any).__COSMO_JOIN_BASE__;
    const url = customBase
      ? `${customBase}#/play/${room.code}`
      : `${window.location.origin}/play/${room.code}`;
    setJoinUrl(url);
    QRCode.toDataURL(url, {
      margin: 1,
      width: 300,
      color: { dark: "#0d1522", light: "#c9faff" },
    })
      .then(setQr)
      .catch(() => setQr(""));
  }, [room.code]);

  const crewByRole = (role: Role) => room.players.filter((p) => p.role === role)[0];
  const botByRole = (role: Role) => botSlots.find((b) => b.role === role);
  const humans = room.players.filter((p) => p.role !== "spectator").length;

  return (
    <div className="relative z-30 mx-auto flex min-h-dvh w-full max-w-6xl flex-col items-center px-4 py-8">
      <div className="flex items-center gap-3 font-pixel text-[10px] text-cyan-300/70">
        <QrCode className="h-4 w-4" /> ЗАГРУЗКА ЭКИПАЖА
      </div>
      <h2 className="glitchy mt-4 text-center font-pixel text-2xl text-cyan-200 sm:text-4xl">
        {room.shipName}
      </h2>
      <p className="mt-3 text-center font-term text-xs text-slate-400">
        Пустые кресла займут бортовые автопилоты. Играть можно хоть вдвоём, хоть одному.
      </p>

      <div className="mt-8 grid w-full grid-cols-1 gap-6 lg:grid-cols-[auto_1fr]">
        {/* QR + код */}
        <div className="pxl-panel mx-auto flex flex-col items-center p-6">
          {qr ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={qr} alt="QR для подключения" className="pixelated h-56 w-56" />
          ) : (
            <div className="h-56 w-56 animate-pulse bg-[#101a28]" />
          )}
          <div className="mt-5 flex gap-2">
            {room.code.split("").map((ch, i) => (
              <span
                key={i}
                className="border-2 border-amber-400/60 bg-amber-400/10 px-3 py-2 font-pixel text-xl text-amber-300"
              >
                {ch}
              </span>
            ))}
          </div>
          <button
            onClick={() => {
              void navigator.clipboard?.writeText(joinUrl);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
            className="mt-4 inline-flex items-center gap-2 font-term text-[11px] text-slate-400 hover:text-cyan-300"
          >
            <Copy className="h-3.5 w-3.5" />
            {copied ? "ССЫЛКА СКОПИРОВАНА!" : joinUrl || "…"}
          </button>
          <div className="mt-3 font-term text-[10px] text-slate-500">
            Заходит с любой сети: Wi-Fi, мобильный интернет, другой город
          </div>
          <ConnectionHelp code={room.code} />
        </div>

        {/* слоты экипажа */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 font-pixel text-[10px] text-slate-400">
              <Users className="h-4 w-4 text-cyan-300" /> ЛЮДИ: {humans}/4
              {botSlots.length > 0 && (
                <span className="inline-flex items-center gap-1.5 text-emerald-300">
                  <Bot className="h-4 w-4" /> БОТЫ: {botSlots.length}
                </span>
              )}
            </div>

            {/* сложность ботов */}
            <div className="flex items-center gap-1.5">
              <span className="font-pixel text-[8px] text-slate-500">ИИ:</span>
              {(Object.keys(DIFFICULTY_META) as BotDifficulty[]).map((d) => {
                const m = DIFFICULTY_META[d];
                const on = difficulty === d;
                return (
                  <button
                    key={d}
                    onClick={() => onDifficulty(d)}
                    title={m.desc}
                    className="border-2 px-2.5 py-1.5 font-pixel text-[8px] transition-colors"
                    style={{
                      borderColor: on ? m.color : "#1b2b3a",
                      color: on ? "#04060e" : m.color,
                      background: on ? m.color : "transparent",
                    }}
                  >
                    {m.label}
                  </button>
                );
              })}
            </div>
          </div>

          {ROLE_ORDER.map((role) => {
            const meta = ROLE_META[role];
            const Icon = ROLE_ICONS[role];
            const player = crewByRole(role);
            const bot = botByRole(role);
            const botOff = disabledRoles.includes(role) && !player;
            const filled = !!player || !!bot;
            return (
              <div
                key={role}
                className="pxl-panel flex items-center gap-4 px-5 py-4"
                style={{ opacity: filled ? 1 : 0.5 }}
              >
                <div
                  className="flex h-12 w-12 items-center justify-center border-2"
                  style={{
                    borderColor: player ? meta.color : bot ? "#3bff8f" : "#1b2b3a",
                    background: player ? `${meta.color}22` : bot ? "#3bff8f18" : "transparent",
                  }}
                >
                  {bot && !player ? (
                    <Bot className="h-6 w-6 text-emerald-300" />
                  ) : (
                    <Icon className="h-6 w-6" style={{ color: meta.color }} />
                  )}
                </div>
                <div className="flex-1">
                  <div
                    className="font-pixel text-[11px]"
                    style={{ color: player ? meta.color : bot ? "#3bff8f" : "#64748b" }}
                  >
                    {player ? player.name : bot ? bot.name : meta.label}
                  </div>
                  <div className="mt-1 font-term text-[10px] text-slate-500">
                    {player
                      ? `${meta.label} · НА СВЯЗИ`
                      : bot
                        ? `${meta.label} · АВТОПИЛОТ ГОТОВ`
                        : `${meta.label} · КРЕСЛО ПУСТОЕ`}
                  </div>
                </div>

                {player ? (
                  <span className="font-pixel text-[8px] text-emerald-300">■ ЖИВОЙ</span>
                ) : (
                  <button
                    onClick={() => onToggleBot(role)}
                    className="inline-flex items-center gap-1.5 border-2 px-2.5 py-2 font-pixel text-[8px]"
                    style={{
                      borderColor: botOff ? "#1b2b3a" : "#3bff8f",
                      color: botOff ? "#64748b" : "#3bff8f",
                    }}
                  >
                    {botOff ? <UserPlus className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
                    {botOff ? "БОТ ВЫКЛ" : "БОТ ВКЛ"}
                  </button>
                )}
              </div>
            );
          })}

          {room.players.filter((p) => p.role === "spectator").length > 0 && (
            <div className="font-term text-[11px] text-slate-500">
              + зрители: {room.players.filter((p) => p.role === "spectator").map((p) => p.name).join(", ")}
            </div>
          )}

          <button
            onClick={onStart}
            disabled={starting}
            className="pxl-btn mt-3 inline-flex items-center justify-center gap-3 bg-emerald-400 px-8 py-5 font-pixel text-sm text-black"
          >
            <Play className="h-5 w-5" />
            {starting ? "ЗАЖИГАНИЕ…" : "ЗАПУСК ДВИГАТЕЛЕЙ"}
          </button>
          <p className="text-center font-term text-[11px] text-slate-500">
            {humans === 0
              ? "Живых нет — полетит чисто железный экипаж. Можно просто смотреть шоу."
              : botSlots.length > 0
                ? "Боты подхватят и пустые кресла, и роль того, у кого сядет телефон."
                : "Все кресла заняты людьми. Боты отдыхают."}
          </p>
        </div>
      </div>
    </div>
  );
}
