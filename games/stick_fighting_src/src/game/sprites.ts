import type { FighterId } from './types';

export const SPRITE_CELL = 192;
export const SPRITE_COLS = 6;
export const SPRITE_ROWS = 4;

type SpriteSource = HTMLImageElement | HTMLCanvasElement;

interface SheetSet {
  vortex: SpriteSource;
  spark: HTMLCanvasElement;
  titan: HTMLCanvasElement;
  flash: HTMLCanvasElement;
}

let fighterImg: HTMLImageElement | null = null;
let vfxImg: HTMLImageElement | null = null;
let fighterSheets: SheetSet | null = null;
let vfxReady = false;
let loadStarted = false;
const readyListeners = new Set<() => void>();

function notifyListeners() {
  for (const cb of Array.from(readyListeners)) {
    try { cb(); } catch { /* ignore */ }
  }
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === rn) h = (gn - bn) / d + (gn < bn ? 6 : 0);
  else if (max === gn) h = (bn - rn) / d + 2;
  else h = (rn - gn) / d + 4;
  return [h * 60, s, l];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const hp = ((h % 360) + 360) % 360 / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));
  let r1 = 0, g1 = 0, b1 = 0;
  if (hp < 1) { r1 = c; g1 = x; }
  else if (hp < 2) { r1 = x; g1 = c; }
  else if (hp < 3) { g1 = c; b1 = x; }
  else if (hp < 4) { g1 = x; b1 = c; }
  else if (hp < 5) { r1 = x; b1 = c; }
  else { r1 = c; b1 = x; }
  const m = l - c / 2;
  return [
    Math.max(0, Math.min(255, Math.round((r1 + m) * 255))),
    Math.max(0, Math.min(255, Math.round((g1 + m) * 255))),
    Math.max(0, Math.min(255, Math.round((b1 + m) * 255))),
  ];
}

function buildRecoloredSheet(src: HTMLImageElement, targetHue: number, satMult: number, lightMult: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = src.naturalWidth || src.width;
  canvas.height = src.naturalHeight || src.height;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(src, 0, 0);
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const d = imgData.data;

  for (let i = 0; i < d.length; i += 4) {
    if (d[i + 3] < 10) continue;
    const [h, s, l] = rgbToHsl(d[i], d[i + 1], d[i + 2]);
    // Selective hue rotation strictly on blue/cyan suit, headband & vortex slash pixels
    if (h >= 172 && h <= 258 && s >= 0.22 && l >= 0.14 && l <= 0.88) {
      const nextS = Math.min(1, s * satMult);
      const nextL = Math.max(0.18, Math.min(0.78, l * lightMult));
      const [nr, ng, nb] = hslToRgb(targetHue, nextS, nextL);
      d[i] = nr;
      d[i + 1] = ng;
      d[i + 2] = nb;
    }
  }
  ctx.putImageData(imgData, 0, 0);
  return canvas;
}

function buildFlashSheet(src: HTMLImageElement): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = src.naturalWidth || src.width;
  canvas.height = src.naturalHeight || src.height;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(src, 0, 0);
  ctx.globalCompositeOperation = 'source-in';
  ctx.fillStyle = '#fff3dc';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.globalCompositeOperation = 'source-over';
  return canvas;
}

export function ensureSpritesLoaded() {
  if (loadStarted || typeof Image === 'undefined') return;
  loadStarted = true;

  const fImg = new Image();
  fImg.decoding = 'async';
  fImg.onload = () => {
    fighterImg = fImg;
    fighterSheets = {
      vortex: fImg,
      spark: buildRecoloredSheet(fImg, 44, 1.08, 1.06),
      titan: buildRecoloredSheet(fImg, 354, 1.08, 0.94),
      flash: buildFlashSheet(fImg),
    };
    notifyListeners();
  };
  fImg.src = './stick_fighting_assets/fighter_vortex.png';

  const vImg = new Image();
  vImg.decoding = 'async';
  vImg.onload = () => {
    vfxImg = vImg;
    vfxReady = true;
    notifyListeners();
  };
  vImg.src = './stick_fighting_assets/vfx_props.png';
}

export function onSpritesReady(cb: () => void): () => void {
  ensureSpritesLoaded();
  readyListeners.add(cb);
  return () => { readyListeners.delete(cb); };
}

export function isSpritesReady(): boolean {
  return Boolean(fighterSheets && fighterImg);
}

export function getFighterSheet(id: FighterId, flash = false): SpriteSource | null {
  if (!fighterSheets) return null;
  if (flash) return fighterSheets.flash;
  return fighterSheets[id] ?? fighterSheets.vortex;
}

export function getVfxSheet(): HTMLImageElement | null {
  return vfxReady ? vfxImg : null;
}

export function drawSpriteCell(
  ctx: CanvasRenderingContext2D,
  sheet: SpriteSource,
  col: number,
  row: number,
  dx: number,
  dy: number,
  dw: number,
  dh: number,
  flipX = false
) {
  const sx = col * SPRITE_CELL;
  const sy = row * SPRITE_CELL;
  ctx.save();
  ctx.imageSmoothingEnabled = true;
  if (flipX) {
    ctx.translate(dx + dw, dy);
    ctx.scale(-1, 1);
    ctx.drawImage(sheet, sx, sy, SPRITE_CELL, SPRITE_CELL, 0, 0, dw, dh);
  } else {
    ctx.drawImage(sheet, sx, sy, SPRITE_CELL, SPRITE_CELL, dx, dy, dw, dh);
  }
  ctx.restore();
}
