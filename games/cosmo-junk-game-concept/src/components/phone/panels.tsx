"use client";

import { HAZARD_MANUAL, MANUAL } from "@/lib/game/manual";
import type { BreakerId, InputMsg, ShieldSide, Snapshot } from "@/lib/game/types";
import { ROLE_META, SHIELD_LABELS } from "@/lib/game/types";
import { sfx, vibrate } from "@/lib/sfx";
import {
  BookOpen, ChevronDown, ChevronsDown, ChevronsUp, Crosshair, Droplets,
  Flame, Gauge as GaugeIcon, Heart, Loader2, Power, Rocket, RotateCw, Shield, Skull, Snowflake, Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

export interface PanelProps {
  snap: Snapshot;
  send: (msg: InputMsg) => void;
}

// ---------- примитивы ----------

function Gauge({
  label, value, max, icon: Icon, color, danger,
}: {
  label: string; value: number; max: number; icon?: typeof Flame; color: string; danger?: boolean;
}) {
  const pct = Math.max(0, Math.min(1, value / max));
  return (
    <div>
      <div className="flex items-center justify-between font-pixel text-[8px] text-slate-400">
        <span className="inline-flex items-center gap-1.5">
          {Icon && <Icon className="h-3.5 w-3.5" style={{ color }} />} {label}
        </span>
        <span style={{ color: danger ? "#ff3b5b" : color }}>{Math.round(value)}</span>
      </div>
      <div className="mt-1.5 flex gap-[2px]">
        {Array.from({ length: 20 }, (_, i) => (
          <span
            key={i}
            className={`h-3 flex-1 ${danger && i / 20 > 0.75 ? "blink-fast" : ""}`}
            style={{ background: i < pct * 20 ? color : "#14202e" }}
          />
        ))}
      </div>
    </div>
  );
}

function HoldButton({
  label, icon: Icon, color, onHeld, disabled, className, note,
}: {
  label: string;
  icon?: typeof Zap;
  color: string;
  onHeld: (v: boolean) => void;
  disabled?: boolean;
  className?: string;
  note?: string;
}) {
  const [pressed, setPressed] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const pressedRef = useRef(false);

  const release = () => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
    if (pressedRef.current) {
      pressedRef.current = false;
      setPressed(false);
      onHeld(false);
    }
  };

  useEffect(() => release, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <button
      disabled={disabled}
      onPointerDown={(e) => {
        e.preventDefault();
        if (disabled || pressedRef.current) return;
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
        pressedRef.current = true;
        setPressed(true);
        onHeld(true);
        vibrate(12);
        sfx.play("click");
        timer.current = setInterval(() => onHeld(true), 240);
      }}
      onPointerUp={release}
      onPointerCancel={release}
      onPointerLeave={release}
      onContextMenu={(e) => e.preventDefault()}
      className={`pxl-btn no-touch-callout ${pressed ? "pressed" : ""} ${className ?? ""}`}
      style={{ background: color, touchAction: "none" }}
    >
      <span className="flex h-full flex-col items-center justify-center gap-1 font-pixel text-black">
        {Icon && <Icon className="h-7 w-7" strokeWidth={2.6} />}
        <span className="text-xs">{label}</span>
        {note && <span className="text-[7px] opacity-70">{note}</span>}
      </span>
    </button>
  );
}

function TapButton({
  label, icon: Icon, color, onTap, disabled, className, note,
}: {
  label: string;
  icon?: typeof Zap;
  color: string;
  onTap: () => void;
  disabled?: boolean;
  className?: string;
  note?: string;
}) {
  return (
    <button
      disabled={disabled}
      onPointerDown={(e) => {
        e.preventDefault();
        if (disabled) return;
        onTap();
        vibrate(18);
        sfx.play("click");
      }}
      onContextMenu={(e) => e.preventDefault()}
      className={`pxl-btn no-touch-callout ${className ?? ""}`}
      style={{ background: color, touchAction: "manipulation" }}
    >
      <span className="flex h-full flex-col items-center justify-center gap-1 font-pixel text-black">
        {Icon && <Icon className="h-6 w-6" strokeWidth={2.6} />}
        <span className="text-[11px]">{label}</span>
        {note && <span className="text-[7px] opacity-70">{note}</span>}
      </span>
    </button>
  );
}

function CooldownBar({ t, max, color }: { t: number; max: number; color: string }) {
  if (t <= 0) return null;
  return (
    <div className="mt-1 h-1.5 w-full bg-[#14202e]">
      <div className="h-full" style={{ width: `${(1 - t / max) * 100}%`, background: color }} />
    </div>
  );
}

function Warn({ text }: { text: string }) {
  return (
    <div className="border-2 border-rose-500/70 bg-rose-950/50 px-3 py-2 text-center font-pixel text-[8px] leading-relaxed text-rose-300 blink-hard">
      {text}
    </div>
  );
}

// ---------- ПИЛОТ ----------

export function PilotPanel({ snap, send }: PanelProps) {
  const meta = ROLE_META.pilot;
  const engineOff = !snap.breakers.A1;
  return (
    <div className="flex flex-1 flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="pxl-panel p-3">
          <div className="flex items-center gap-1.5 font-pixel text-[8px] text-slate-400">
            <GaugeIcon className="h-3.5 w-3.5" style={{ color: meta.color }} /> СКОРОСТЬ
          </div>
          <div className="mt-1 font-pixel text-2xl" style={{ color: meta.color }}>
            {snap.speed}
            <span className="text-[10px] text-slate-500"> СВ</span>
          </div>
        </div>
        <div className="pxl-panel p-3">
          <div className="font-pixel text-[8px] text-slate-400">ПУТЬ ДО СТАНЦИИ</div>
          <div className="mt-1 font-pixel text-2xl text-cyan-300">
            {Math.round(snap.progress * 100)}
            <span className="text-[10px] text-slate-500"> %</span>
          </div>
        </div>
      </div>

      {engineOff && <Warn text="ДВИГАТЕЛЬ ОБЕСТОЧЕН (A1). КРИЧИ ИНЖЕНЕРУ!" />}

      <div className="grid flex-1 grid-cols-2 gap-3">
        <div className="flex flex-col gap-3">
          <HoldButton
            label="ВЫШЕ"
            icon={ChevronsUp}
            color={engineOff ? "#5a6470" : "#ffb000"}
            disabled={engineOff}
            className="min-h-[110px] flex-1"
            onHeld={(v) => send({ kind: "held", key: "up", v })}
          />
          <HoldButton
            label="НИЖЕ"
            icon={ChevronsDown}
            color={engineOff ? "#5a6470" : "#ffb000"}
            disabled={engineOff}
            className="min-h-[110px] flex-1"
            onHeld={(v) => send({ kind: "held", key: "down", v })}
          />
        </div>
        <div className="flex flex-col gap-3">
          <HoldButton
            label="ГАЗ"
            note="ГРЕЕТ ДВИЖОК!"
            icon={Zap}
            color={engineOff ? "#5a6470" : "#ff8c42"}
            disabled={engineOff}
            className="min-h-[110px] flex-1"
            onHeld={(v) => send({ kind: "held", key: "thrust", v })}
          />
          <div className="flex-1">
            <TapButton
              label="ГИПЕРПРЫЖОК"
              note={snap.cds.hyper > 0 ? `ЗАРЯД ${Math.ceil(snap.cds.hyper)}с` : "ГОТОВ"}
              icon={Rocket}
              color={snap.cds.hyper > 0 || engineOff ? "#5a6470" : "#57e6e6"}
              disabled={snap.cds.hyper > 0 || engineOff}
              className="h-full min-h-[110px] w-full"
              onTap={() => send({ kind: "hyper" })}
            />
            <CooldownBar t={snap.cds.hyper} max={18} color="#57e6e6" />
          </div>
        </div>
      </div>
      <p className="text-center font-term text-[10px] text-slate-500">
        Ты не видишь жар и щиты — спрашивай команду голосом
      </p>
    </div>
  );
}

// ---------- ИНЖЕНЕР ----------

const BREAKER_NAMES: Record<BreakerId, string> = {
  A1: "ДВИГАТЕЛЬ",
  A2: "ЩИТЫ",
  B1: "ПУШКА",
  B2: "ДАТЧИКИ/O2",
};

function Breaker({
  id, on, tripped, onToggle,
}: {
  id: BreakerId; on: boolean; tripped: boolean; onToggle: () => void;
}) {
  return (
    <button
      onPointerDown={(e) => {
        e.preventDefault();
        onToggle();
        vibrate(15);
        sfx.play(on ? "trip" : "confirm");
      }}
      className={`pxl-panel no-touch-callout flex flex-col items-center gap-2 p-3 ${tripped ? "border-rose-500" : ""}`}
      style={{ touchAction: "manipulation" }}
    >
      <div className="font-pixel text-[9px] text-slate-300">{id}</div>
      <div
        className={`relative h-16 w-9 border-2 ${on ? "border-emerald-400" : "border-rose-500"} bg-[#050a12]`}
      >
        <div
          className={`absolute left-1/2 h-6 w-6 -translate-x-1/2 transition-all duration-75 ${
            on ? "top-1 bg-emerald-400" : "top-[34px] bg-rose-500"
          }`}
          style={{ boxShadow: `0 0 12px ${on ? "#3bff8f88" : "#ff3b5b88"}` }}
        />
      </div>
      <div className="text-center font-term text-[9px] leading-tight text-slate-400">
        {BREAKER_NAMES[id]}
      </div>
      <div className={`font-pixel text-[8px] ${on ? "text-emerald-300" : "text-rose-400"}`}>
        {on ? "ВКЛ" : "ВЫКЛ"}
      </div>
    </button>
  );
}

export function EngineerPanel({ snap, send }: PanelProps) {
  return (
    <div className="flex flex-1 flex-col gap-3">
      <div className="pxl-panel p-3">
        <Gauge label="ЖАР ДВИГАТЕЛЯ" value={snap.heat} max={100} icon={Flame} color="#ff8c42" danger={snap.heat > 82} />
        <div className="mt-3">
          <Gauge label="ПОЖАРЫ В ОТСЕКАХ" value={snap.fires} max={3} icon={Flame} color="#ff3b5b" danger={snap.fires > 0} />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {(Object.keys(snap.breakers) as BreakerId[]).map((id) => (
          <Breaker
            key={id}
            id={id}
            on={snap.breakers[id]}
            tripped={snap.tripped === id}
            onToggle={() => send({ kind: "breaker", id, v: !snap.breakers[id] })}
          />
        ))}
      </div>

      {snap.tripped && <Warn text={`ВЫБИЛО ${snap.tripped}! ВЕРНИ ТУМБЛЕР!`} />}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <TapButton
            label="ТУШЕНИЕ"
            note={snap.cds.extinguish > 0 ? `${Math.ceil(snap.cds.extinguish)}с` : `ОГОНЬ: ${snap.fires}`}
            icon={Droplets}
            color={snap.fires > 0 ? "#3bff8f" : "#5a6470"}
            disabled={snap.cds.extinguish > 0}
            className="h-24 w-full"
            onTap={() => send({ kind: "extinguish" })}
          />
          <CooldownBar t={snap.cds.extinguish} max={5} color="#3bff8f" />
        </div>
        <div>
          <TapButton
            label="ОХЛАЖДЕНИЕ"
            note={snap.coolantOn ? "РАБОТАЕТ · ЖРЁТ ЩИТЫ" : "ВЫКЛ"}
            icon={Snowflake}
            color={snap.coolantOn ? "#57e6e6" : "#5a6470"}
            className="h-24 w-full"
            onTap={() => send({ kind: "coolant", v: !snap.coolantOn })}
          />
        </div>
      </div>

      <p className="text-center font-term text-[10px] text-slate-500">
        Охлаждение включено — канонир не может двигать щит. Договаривайтесь!
      </p>
    </div>
  );
}

// ---------- КАНОНИР ----------

export function GunnerPanel({ snap, send }: PanelProps) {
  const shieldsOff = !snap.breakers.A2;
  const gunOff = !snap.breakers.B1;
  const frozen = snap.coolantOn;
  const rebooting = snap.rebootT >= 0;

  const sideBtn = (side: ShieldSide, label: string, pos: string) => {
    const active = snap.shieldSide === side && snap.shieldUp && !frozen;
    return (
      <button
        disabled={frozen}
        onPointerDown={(e) => {
          e.preventDefault();
          send({ kind: "shield", side });
          vibrate(14);
          sfx.play("click");
        }}
        className={`pxl-btn no-touch-callout ${pos} flex items-center justify-center gap-1 font-pixel text-[9px] ${
          active ? "text-black" : "text-fuchsia-200"
        }`}
        style={{
          background: active ? "#ff4bd8" : frozen ? "#3a3040" : "#40124a",
          touchAction: "manipulation",
          opacity: frozen ? 0.4 : 1,
        }}
      >
        <Shield className="h-4 w-4" />
        {label}
      </button>
    );
  };

  return (
    <div className="flex flex-1 flex-col gap-3">
      {shieldsOff && <Warn text="ЩИТЫ ОБЕСТОЧЕНЫ (A2). ИНЖЕНЕР, ПРИЁМ!" />}
      {frozen && <Warn text="ЭНЕРГИЯ УШЛА В ОХЛАЖДЕНИЕ. ЩИТ ЗАМОРОЖЕН!" />}

      <div className="pxl-panel p-4">
        <div className="mb-3 text-center font-pixel text-[8px] text-slate-400">
          СИЛОВОЙ ЩИТ · СЕЙЧАС: <span className="text-fuchsia-300">{SHIELD_LABELS[snap.shieldSide]}</span>
        </div>
        <div className="mx-auto grid w-full max-w-[280px] grid-cols-3 grid-rows-3 gap-2">
          <div />
          {sideBtn(1, "ВЕРХ", "h-16")}
          <div />
          {sideBtn(2, "КОРМА", "h-16")}
          <div className="flex h-16 items-center justify-center border-2 border-dashed border-[#1b2b3a]">
            <Crosshair className="h-5 w-5 text-fuchsia-300/50" />
          </div>
          {sideBtn(0, "НОС", "h-16")}
          <div />
          {sideBtn(3, "НИЗ", "h-16")}
          <div />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <TapButton
            label="ОГОНЬ"
            note={gunOff ? "ПУШКА МЕРТВА (B1)" : rebooting ? "ПЕРЕЗАГРУЗКА…" : snap.cds.fire > 0 ? "ЗАРЯД…" : "ЦЕЛЬ АВТО"}
            icon={Crosshair}
            color={gunOff || rebooting || snap.cds.fire > 0.15 ? "#5a6470" : "#ff4b5b"}
            disabled={gunOff || rebooting || snap.cds.fire > 0.15}
            className="h-28 w-full"
            onTap={() => send({ kind: "fire" })}
          />
          <CooldownBar t={snap.cds.fire} max={snap.cds.fireMax} color="#ff4bd8" />
        </div>
        <div className="pxl-panel flex flex-col">
          <button
            disabled={rebooting}
            onPointerDown={(e) => {
              e.preventDefault();
              if (rebooting) return;
              send({ kind: "reboot" });
              vibrate([20, 40, 20]);
              sfx.play("click");
            }}
            className="flex flex-1 flex-col items-center justify-center gap-2 p-3"
          >
            {rebooting ? (
              <Loader2 className="h-6 w-6 animate-spin text-cyan-300" />
            ) : (
              <RotateCw className="h-6 w-6 text-cyan-300" />
            )}
            <span className="font-pixel text-[9px] text-cyan-300">
              {rebooting ? `СБРОС ${Math.round((snap.rebootT / 3) * 100)}%` : "ПЕРЕЗАГРУЗКА"}
            </span>
            {rebooting && (
              <div className="h-1.5 w-full bg-[#14202e]">
                <div className="h-full bg-cyan-300" style={{ width: `${(snap.rebootT / 3) * 100}%` }} />
              </div>
            )}
          </button>
        </div>
      </div>

      {snap.hazards.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2">
          {snap.hazards.map((h) => (
            <span key={h} className="border border-fuchsia-500/60 bg-fuchsia-950/60 px-2 py-1 font-pixel text-[8px] text-fuchsia-300">
              {h === "storm" ? "БУРЯ" : h === "gravity" ? "ГРАВИТЯГА" : "ПИРАТЫ С КОРМЫ"}
            </span>
          ))}
        </div>
      )}
      <p className="text-center font-term text-[10px] text-slate-500">
        Смотри на главный экран — видишь, откуда летит?
      </p>
    </div>
  );
}

// ---------- НАВИГАТОР ----------

function ManualEntryView({ id, active }: { id: string; active?: { tLeft: number; dur: number } }) {
  const [open, setOpen] = useState(!!active);
  const entry = MANUAL.find((m) => m.id === id);
  if (!entry) return null;
  useEffect(() => {
    if (active) setOpen(true);
  }, [active]);
  return (
    <div className={`pxl-panel ${active ? "border-rose-500" : ""}`}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2 px-3 py-2.5 text-left"
      >
        <span className={`font-pixel text-[10px] ${active ? "text-rose-400" : "text-cyan-300"}`}>
          {entry.code}
        </span>
        <span className="flex-1 font-term text-[11px] text-slate-300">{entry.title}</span>
        <span className="flex gap-0.5">
          {Array.from({ length: entry.danger }, (_, i) => (
            <Skull key={i} className="h-3 w-3 text-rose-500" />
          ))}
        </span>
        <ChevronDown className={`h-4 w-4 text-slate-500 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {active && (
        <div className="mx-3 mb-1 h-1.5 bg-[#2a0a12]">
          <div
            className={`h-full ${active.tLeft < 5 ? "bg-rose-500 blink-fast" : "bg-amber-400"}`}
            style={{ width: `${(active.tLeft / active.dur) * 100}%` }}
          />
        </div>
      )}
      {open && (
        <div className="space-y-2 px-3 pb-3 pt-1">
          <p className="font-term text-[11px] italic text-slate-400">{entry.symptoms}</p>
          <div className="space-y-1.5">
            {entry.fix.map((f, i) => {
              const roleColor = f.role === "any" ? "#c9d6e2" : ROLE_META[f.role].color;
              const roleLabel =
                f.role === "any"
                  ? "ВСЕ"
                  : f.role === "pilot"
                    ? "ПИЛОТ"
                    : f.role === "engineer"
                      ? "ИНЖЕНЕР"
                      : "КАНОНИР";
              return (
                <div key={i} className="flex items-start gap-2">
                  <span
                    className="mt-0.5 shrink-0 border px-1.5 py-0.5 font-pixel text-[7px]"
                    style={{ borderColor: roleColor, color: roleColor }}
                  >
                    {roleLabel}
                  </span>
                  <span className="font-term text-[11px] leading-snug text-slate-200">{f.text}</span>
                </div>
              );
            })}
          </div>
          <p className="font-term text-[10px] text-slate-600">// {entry.lore}</p>
        </div>
      )}
    </div>
  );
}

export function NavigatorPanel({ snap }: PanelProps) {
  const rest = MANUAL.filter((m) => !snap.errors.some((e) => e.code === m.code));
  return (
    <div className="flex flex-1 flex-col gap-3">
      {snap.errors.length === 0 ? (
        <div className="pxl-panel px-3 py-3 text-center font-pixel text-[9px] text-emerald-300">
          ВСЕ СИСТЕМЫ В НОРМЕ. ЛУЧШЕ ПЕРЕЧИТАЙ МАНУАЛ.
        </div>
      ) : (
        <Warn text={`АКТИВНЫХ АВАРИЙ: ${snap.errors.length}. КРИЧИ ИНСТРУКЦИИ!`} />
      )}

      <div className="term-scroll flex-1 space-y-2 overflow-y-auto pr-0.5">
        {snap.errors.map((e) => {
          const m = MANUAL.find((mm) => mm.code === e.code);
          return m ? <ManualEntryView key={m.id} id={m.id} active={{ tLeft: e.tLeft, dur: e.dur }} /> : null;
        })}
        {rest.map((m) => (
          <ManualEntryView key={m.id} id={m.id} />
        ))}
        <div className="pxl-panel p-3">
          <div className="flex items-center gap-2 font-pixel text-[9px] text-amber-300">
            <BookOpen className="h-4 w-4" /> ПРИРОДНЫЕ УГРОЗЫ
          </div>
          <div className="mt-2 space-y-2">
            {HAZARD_MANUAL.map((h) => (
              <div key={h.id}>
                <div className="font-pixel text-[8px] text-slate-300">{h.title}</div>
                <p className="mt-0.5 font-term text-[10px] leading-snug text-slate-400">{h.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- ЗРИТЕЛЬ ----------

export function SpectatorPanel({ snap, send }: PanelProps) {
  const [cd, setCd] = useState(0);
  useEffect(() => {
    if (cd <= 0) return;
    const t = setTimeout(() => setCd(cd - 1), 1000);
    return () => clearTimeout(t);
  }, [cd]);
  return (
    <div className="flex flex-1 flex-col gap-3">
      <div className="pxl-panel p-3 text-center font-term text-[11px] text-slate-400">
        Все роли заняты — ты груз морали. Подбадривай экипаж!
      </div>
      <TapButton
        label="ПОДДЕРЖАТЬ!"
        icon={Heart}
        color={cd > 0 ? "#5a6470" : "#ff4bd8"}
        disabled={cd > 0}
        className="h-28 w-full"
        note={cd > 0 ? `ПЕРЕДЫШКА ${cd}с` : "ЭКИПАЖ УСЛЫШИТ"}
        onTap={() => {
          send({ kind: "cheer" });
          setCd(4);
        }}
      />
      <div className="pxl-panel flex-1 p-3">
        <div className="flex items-center gap-2 font-pixel text-[8px] text-slate-400">
          <Power className="h-3.5 w-3.5 text-cyan-300" /> БОРТОВОЙ ЖУРНАЛ
        </div>
        <div className="mt-2 space-y-1.5 font-term text-[11px] leading-snug text-slate-400">
          {[...snap.log].reverse().map((l, i) => (
            <div key={i} className={i === 0 ? "text-cyan-200" : ""}>
              {l}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
