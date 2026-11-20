import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode, type PointerEvent } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Shield, Zap, X } from 'lucide-react';
import { drawArenaPreview, drawFighter } from '../game/art';
import { onSpritesReady } from '../game/sprites';
import { FIGHTERS, type Action, type ArenaId, type FighterId, type FighterSnapshot, type Snapshot } from '../game/types';

const FONT: Record<string, string[]> = {
  S: ['11111', '10000', '10000', '11111', '00001', '00001', '11111'],
  T: ['11111', '00100', '00100', '00100', '00100', '00100', '00100'],
  I: ['111', '010', '010', '010', '010', '010', '111'],
  C: ['01111', '11000', '10000', '10000', '10000', '11000', '01111'],
  K: ['10001', '10010', '10100', '11000', '10100', '10010', '10001'],
  F: ['11111', '10000', '10000', '11110', '10000', '10000', '10000'],
  G: ['01111', '11000', '10000', '10111', '10001', '11001', '01111'],
  H: ['10001', '10001', '10001', '11111', '10001', '10001', '10001'],
  N: ['10001', '11001', '11001', '10101', '10011', '10011', '10001'],
  '0': ['01110', '11011', '10001', '10001', '10001', '11011', '01110'],
  '1': ['00100', '01100', '00100', '00100', '00100', '00100', '01110'],
  '2': ['11110', '00001', '00001', '01110', '10000', '10000', '11111'],
  '3': ['11110', '00001', '00001', '01110', '00001', '00001', '11110'],
  '4': ['10001', '10001', '10001', '11111', '00001', '00001', '00001'],
  '5': ['11111', '10000', '10000', '11110', '00001', '00001', '11110'],
  '6': ['01111', '10000', '10000', '11110', '10001', '10001', '01110'],
  '7': ['11111', '00001', '00010', '00100', '01000', '01000', '01000'],
  '8': ['01110', '10001', '10001', '01110', '10001', '10001', '01110'],
  '9': ['01110', '10001', '10001', '01111', '00001', '00001', '11110'],
  ':': ['0', '1', '1', '0', '1', '1', '0'],
};

export function PixelWord({ text, className = '' }: { text: string; className?: string }) {
  let cursor = 0;
  const pixels: ReactNode[] = [];
  for (let letter = 0; letter < text.length; letter++) {
    const glyph = FONT[text[letter]] ?? FONT['0'];
    glyph.forEach((row, y) => [...row].forEach((bit, x) => {
      if (bit === '1') pixels.push(<rect key={`${letter}-${x}-${y}`} x={cursor + x} y={y} width="1" height="1" />);
    }));
    cursor += glyph[0].length + 1;
  }
  return <svg className={`pixel-word ${className}`} viewBox={`0 0 ${cursor - 1} 7`} role="img" aria-label={text} fill="currentColor" shapeRendering="crispEdges">{pixels}</svg>;
}

export function BrandMark() {
  return <svg className="brand-mark" viewBox="0 0 28 28" aria-hidden="true" fill="currentColor" shapeRendering="crispEdges">
    <path d="M3 3h8v4H7v4h8v4h-4v6H7v4H3v-8h4v-4H3V3zm22 0v8h-4v4h4v10h-8v-4h4v-4h-8v-4h4V7h4V3h4z" />
    <rect x="12" y="3" width="4" height="4" /><rect x="12" y="21" width="4" height="4" />
  </svg>;
}

export function FighterPortrait({ id, animated = true, className = '' }: { id: FighterId; animated?: boolean; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    canvas.width = 220; canvas.height = 192;
    const ctx = canvas.getContext('2d')!;
    let frame = 0;
    const paint = (time: number) => {
      ctx.clearRect(0, 0, 220, 192);
      ctx.fillStyle = '#090e1880'; ctx.fillRect(58, 174, 104, 7);
      drawFighter(ctx, { id, x: 110, y: 176, facing: 1, pose: 'idle' }, time / 1000, 1.18, true);
      if (animated) frame = requestAnimationFrame(paint);
    };
    const unsubscribe = onSpritesReady(() => paint(performance.now()));
    paint(0);
    return () => {
      unsubscribe();
      cancelAnimationFrame(frame);
    };
  }, [id, animated]);
  return <canvas ref={ref} className={`fighter-portrait ${className}`} aria-label={`Боец ${FIGHTERS[id].name}`} role="img" />;
}

export function ArenaThumbnail({ id }: { id: ArenaId }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    drawArenaPreview(ref.current, id);
    return onSpritesReady(() => {
      if (ref.current) drawArenaPreview(ref.current, id);
    });
  }, [id]);
  return <canvas ref={ref} className="arena-thumbnail" aria-hidden="true" />;
}

export function Modal({ title, eyebrow, children, onClose, className = '' }: {
  title: string; eyebrow: string; children: ReactNode; onClose: () => void; className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const titleId = useId();
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const modal = ref.current;
    modal?.focus({ preventScroll: true });
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); onClose(); }
      if (event.key === 'Tab' && modal) {
        const focusable = [...modal.querySelectorAll<HTMLElement>('button, input, select, [tabindex="0"]')].filter(el => !el.hasAttribute('disabled'));
        const first = focusable[0]; const last = focusable[focusable.length - 1];
        if (event.shiftKey && (document.activeElement === first || document.activeElement === modal)) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && (document.activeElement === last || document.activeElement === modal)) { event.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener('keydown', handler);
    return () => { document.removeEventListener('keydown', handler); if (previous?.isConnected) previous.focus({ preventScroll: true }); };
  }, [onClose]);
  return <div className="modal-backdrop" onPointerDown={event => { if (event.target === event.currentTarget) onClose(); }}>
    <div ref={ref} className={`modal-window ${className}`} role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1}>
      <button type="button" className="icon-button modal-close" aria-label="Закрыть окно" onClick={onClose}><X size={21} /></button>
      <div className="eyebrow">{eyebrow}</div>
      <h2 id={titleId}>{title}</h2>
      {children}
    </div>
  </div>;
}

export function Kbd({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <kbd className={className}>{children}</kbd>;
}

function HealthSide({ fighter, enemy = false, you = false }: { fighter: FighterSnapshot; enemy?: boolean; you?: boolean }) {
  const definition = FIGHTERS[fighter.id];
  return <div className={`hud-side ${enemy ? 'enemy' : 'player'}`} style={{ '--fighter-color': definition.color } as CSSProperties}>
    <div className="fighter-heading">
      <span className="fighter-name">{definition.name}{you && <span className="you-tag">ТЫ</span>}</span>
      <span className="round-points" aria-label={`Выиграно раундов: ${fighter.wins}`}>
        {[0, 1].map(i => <span key={i} className={`win-point ${fighter.wins > i ? 'won' : ''}`} />)}
      </span>
    </div>
    <div className="health-track" role="progressbar" aria-label={`Здоровье: ${definition.name}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={fighter.health}>
      <div className={`health-fill ${fighter.health < 25 ? 'critical' : ''}`} style={{ width: `${fighter.health}%` }} />
      <span className="health-value">{fighter.health}<span> / 100</span></span>
    </div>
    <div className={`energy-track ${fighter.energy >= 50 ? 'ready' : ''}`} role="progressbar" aria-label={`Энергия: ${definition.name}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(fighter.energy)}>
      <div className="energy-fill" style={{ width: `${fighter.energy}%` }} />
      <span className="energy-cost-marker" />
    </div>
    <div className="energy-caption"><span>{fighter.energy >= 50 ? 'СПЕЦПРИЁМ ГОТОВ' : 'ЭНЕРГИЯ'}</span><span>{Math.round(fighter.energy)} / 100</span></div>
  </div>;
}

/** `you` is the index of the fighter controlled from this device in a network match (0 = left, 1 = right). */
export function HUD({ snapshot, you = null }: { snapshot: Snapshot; you?: 0 | 1 | null }) {
  return <>
    <div className="battle-hud">
      <HealthSide fighter={snapshot.player} you={you === 0} />
      <div className={`timer-center ${snapshot.timer <= 10 ? 'time-low' : ''}`}>
        <span className="round-caption">РАУНД {snapshot.round}</span>
        <PixelWord text={String(snapshot.timer).padStart(2, '0')} />
        <span className="first-to-two">ДО ДВУХ ПОБЕД</span>
      </div>
      <HealthSide fighter={snapshot.enemy} enemy you={you === 1} />
    </div>
    {snapshot.player.combo >= 2 && snapshot.phase === 'fight' && <div key={`p-${snapshot.player.combo}`} className="combo-display player-combo"><strong>КОМБО <span>×{snapshot.player.combo}</span></strong><small>{snapshot.player.comboDamage} урона</small></div>}
    {snapshot.enemy.combo >= 2 && snapshot.phase === 'fight' && <div key={`e-${snapshot.enemy.combo}`} className="combo-display enemy-combo"><strong>КОМБО <span>×{snapshot.enemy.combo}</span></strong><small>{snapshot.enemy.comboDamage} урона</small></div>}
  </>;
}

function TouchButton({ action, label, children, onAction, className = '', disabled = false }: {
  action: Action; label: string; children: ReactNode; onAction: (action: Action, down: boolean, source: string) => void; className?: string; disabled?: boolean;
}) {
  const [pressed, setPressed] = useState(false);
  useEffect(() => { if (disabled) setPressed(false); }, [disabled]);
  const release = (event: PointerEvent<HTMLButtonElement>) => {
    onAction(action, false, `touch-${event.pointerId}`); setPressed(false);
  };
  return <button type="button" disabled={disabled} aria-label={label} className={`touch-button ${className} ${pressed ? 'pressed' : ''}`}
    onPointerDown={event => {
      event.preventDefault();
      if (event.currentTarget.hasPointerCapture(event.pointerId) === false) {
        try { event.currentTarget.setPointerCapture(event.pointerId); } catch { /* Synthetic pointers may not be capturable. */ }
      }
      onAction(action, true, `touch-${event.pointerId}`); setPressed(true);
    }} onPointerUp={release} onPointerCancel={release} onLostPointerCapture={release} onContextMenu={event => event.preventDefault()}>{children}</button>;
}

export function TouchControls({ onAction, paused }: { onAction: (action: Action, down: boolean, source: string) => void; paused: boolean }) {
  const activeDpadRef = useRef<Map<number, Action>>(new Map());
  const [dpadPressed, setDpadPressed] = useState<Set<Action>>(new Set());

  const syncPressedSet = () => {
    setDpadPressed(new Set(activeDpadRef.current.values()));
  };

  useEffect(() => {
    if (!paused) return;
    for (const [pid, act] of activeDpadRef.current.entries()) {
      onAction(act, false, `dpad-${pid}`);
    }
    activeDpadRef.current.clear();
    setDpadPressed(new Set());
  }, [paused, onAction]);

  const actionAtPoint = (x: number, y: number): Action | null => {
    const el = document.elementFromPoint(x, y)?.closest<HTMLElement>('[data-dpad-action]');
    return (el?.dataset.dpadAction as Action | undefined) ?? null;
  };

  const handleDpadMove = (pid: number, x: number, y: number) => {
    if (paused) return;
    const next = actionAtPoint(x, y);
    const prev = activeDpadRef.current.get(pid);
    if (prev === next) return;
    if (prev) onAction(prev, false, `dpad-${pid}`);
    if (next) {
      activeDpadRef.current.set(pid, next);
      onAction(next, true, `dpad-${pid}`);
    } else {
      activeDpadRef.current.delete(pid);
    }
    syncPressedSet();
  };

  const releaseDpad = (pid: number) => {
    const prev = activeDpadRef.current.get(pid);
    if (!prev) return;
    onAction(prev, false, `dpad-${pid}`);
    activeDpadRef.current.delete(pid);
    syncPressedSet();
  };

  return <div className="touch-controls" aria-label="Сенсорное управление">
    <div
      className="touch-dpad"
      onPointerDown={e => {
        if (paused) return;
        e.preventDefault();
        try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* Ignore */ }
        handleDpadMove(e.pointerId, e.clientX, e.clientY);
      }}
      onPointerMove={e => {
        if (!activeDpadRef.current.has(e.pointerId)) return;
        handleDpadMove(e.pointerId, e.clientX, e.clientY);
      }}
      onPointerUp={e => releaseDpad(e.pointerId)}
      onPointerCancel={e => releaseDpad(e.pointerId)}
      onLostPointerCapture={e => releaseDpad(e.pointerId)}
      onContextMenu={e => e.preventDefault()}
    >
      <button type="button" disabled={paused} data-dpad-action="up" aria-label="Прыжок" className={`touch-button dpad-up ${dpadPressed.has('up') ? 'pressed' : ''}`}><ArrowUp /></button>
      <button type="button" disabled={paused} data-dpad-action="left" aria-label="Движение влево" className={`touch-button dpad-left ${dpadPressed.has('left') ? 'pressed' : ''}`}><ArrowLeft /></button>
      <button type="button" disabled={paused} data-dpad-action="down" aria-label="Присесть" className={`touch-button dpad-down ${dpadPressed.has('down') ? 'pressed' : ''}`}><ArrowDown /></button>
      <button type="button" disabled={paused} data-dpad-action="right" aria-label="Движение вправо" className={`touch-button dpad-right ${dpadPressed.has('right') ? 'pressed' : ''}`}><ArrowRight /></button>
    </div>
    <div className="touch-center-hint"><span>ДЕРЖИ ТЕМП.</span><span>ЛОВИ МОМЕНТ.</span></div>
    <div className="touch-attacks">
      <TouchButton action="jab" label="Быстрый удар рукой" onAction={onAction} disabled={paused}><b>J</b><small>РУКА</small></TouchButton>
      <TouchButton action="heavy" label="Сильный удар рукой" onAction={onAction} disabled={paused}><b>K</b><small>СИЛЬНЫЙ</small></TouchButton>
      <TouchButton action="special" label="Спецприём, стоимость 50 энергии" className="touch-special" onAction={onAction} disabled={paused}><Zap size={19} /><small>СПЕЦ / O</small></TouchButton>
      <TouchButton action="kick" label="Быстрый удар ногой" onAction={onAction} disabled={paused}><b>U</b><small>НОГА</small></TouchButton>
      <TouchButton action="heavyKick" label="Сильный удар ногой" onAction={onAction} disabled={paused}><b>I</b><small>СИЛЬНЫЙ</small></TouchButton>
      <TouchButton action="block" label="Удерживать блок" className="touch-block" onAction={onAction} disabled={paused}><Shield size={20} /><small>БЛОК</small></TouchButton>
    </div>
  </div>;
}