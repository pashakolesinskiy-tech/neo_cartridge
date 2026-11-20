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

const ROLE_SPRITE_COL: Record<Role, number> = {
  pilot: 0,
  engineer: 1,
  gunner: 2,
  navigator: 3,
  spectator: 5,
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
    <div className="relative z-30 mx-auto flex min-h-dvh w-full max-w-6xl flex-col items-center justify-center px-3 pb-4 pt-10 sm:px-4 sm:py-6 md:py-8">
      <div className="flex items-center gap-2 font-pixel text-[9px] text-cyan-300/70 sm:gap-3 sm:text-[10px]">
        <QrCode className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> ЗАГРУЗКА ЭКИПАЖА
      </div>
      <h2 className="glitchy mt-2 text-center font-pixel text-lg text-cyan-200 sm:mt-3 sm:text-2xl lg:text-4xl">
        {room.shipName}
      </h2>
      <p className="mt-1.5 hidden text-center font-term text-xs text-slate-400 sm:block">
        Пустые кресла займут бортовые автопилоты. Играть можно хоть вдвоём, хоть одному.
      </p>

      <div className="mt-3 grid w-full grid-cols-1 gap-3 md:mt-5 md:grid-cols-[240px_1fr] md:gap-4 lg:grid-cols-[auto_1fr] lg:gap-6">
        {/* QR + код */}
        <div className="pxl-panel mx-auto flex w-full max-w-xs flex-col items-center p-3 sm:p-4 lg:w-auto lg:p-6">
          {qr ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={qr} alt="QR для подключения" className="pixelated h-32 w-32 sm:h-40 sm:w-40 lg:h-56 lg:w-56" />
          ) : (
            <div className="h-32 w-32 animate-pulse bg-[#101a28] sm:h-40 sm:w-40 lg:h-56 lg:w-56" />
          )}
          <div className="mt-3 flex gap-1.5 lg:mt-5 lg:gap-2">
            {room.code.split("").map((ch, i) => (
              <span
                key={i}
                className="border-2 border-amber-400/60 bg-amber-400/10 px-2 py-1 font-pixel text-base text-amber-300 lg:px-3 lg:py-2 lg:text-xl"
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
        <div className="flex flex-col gap-2 lg:gap-3">
          <div className="flex flex-wrap items-center justify-between gap-2 lg:gap-3">
            <div className="flex items-center gap-2 font-pixel text-[9px] text-slate-400 lg:text-[10px]">
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
                    className="border-2 px-2 py-1 font-pixel text-[8px] transition-colors lg:px-2.5 lg:py-1.5"
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

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1 lg:gap-3">
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
                  className="pxl-panel flex items-center gap-2.5 px-3 py-2 lg:gap-4 lg:px-5 lg:py-4"
                  style={{ opacity: filled ? 1 : 0.5 }}
                >
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden border-2 lg:h-12 lg:w-12"
                    style={{
                      borderColor: player ? meta.color : bot ? "#3bff8f" : "#1b2b3a",
                      background: player ? `${meta.color}22` : bot ? "#3bff8f18" : "transparent",
                    }}
                  >
                    <div
                      title={bot && !player ? "БОТ" : meta.label}
                      className="h-8 w-8 shrink-0 lg:h-11 lg:w-11"
                      style={{
                        backgroundImage: "url('sprites/cosmo_junk_sheet.png')",
                        backgroundSize: "600% 400%",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: `${((bot && !player) ? 4 : ROLE_SPRITE_COL[role]) * 20}% 66.6667%`,
                      }}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div
                      className="truncate font-pixel text-[9px] lg:text-[11px]"
                      style={{ color: player ? meta.color : bot ? "#3bff8f" : "#64748b" }}
                    >
                      {player ? player.name : bot ? bot.name : meta.label}
                    </div>
                    <div className="mt-0.5 truncate font-term text-[9px] text-slate-500 lg:mt-1 lg:text-[10px]">
                      {player
                        ? `${meta.label} · НА СВЯЗИ`
                        : bot
                          ? `${meta.label} · АВТОПИЛОТ`
                          : `${meta.label} · ПУСТО`}
                    </div>
                  </div>

                  {player ? (
                    <span className="shrink-0 font-pixel text-[7px] text-emerald-300 lg:text-[8px]">■ ЖИВОЙ</span>
                  ) : (
                    <button
                      onClick={() => onToggleBot(role)}
                      className="inline-flex shrink-0 items-center gap-1 border-2 px-2 py-1 font-pixel text-[7px] lg:gap-1.5 lg:px-2.5 lg:py-2 lg:text-[8px]"
                      style={{
                        borderColor: botOff ? "#1b2b3a" : "#3bff8f",
                        color: botOff ? "#64748b" : "#3bff8f",
                      }}
                    >
                      {botOff ? <UserPlus className="h-3 w-3 lg:h-3.5 lg:w-3.5" /> : <Bot className="h-3 w-3 lg:h-3.5 lg:w-3.5" />}
                      {botOff ? "ВЫКЛ" : "БОТ"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {room.players.filter((p) => p.role === "spectator").length > 0 && (
            <div className="font-term text-[11px] text-slate-500">
              + зрители: {room.players.filter((p) => p.role === "spectator").map((p) => p.name).join(", ")}
            </div>
          )}

          <button
            onClick={onStart}
            disabled={starting}
            className="pxl-btn mt-1 inline-flex items-center justify-center gap-3 bg-emerald-400 px-6 py-3 font-pixel text-xs text-black lg:mt-3 lg:px-8 lg:py-5 lg:text-sm"
          >
            <Play className="h-4 w-4 lg:h-5 lg:w-5" />
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
