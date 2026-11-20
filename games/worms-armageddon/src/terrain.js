import { BASE_WATER_Y, THEMES, WORLD_H, WORLD_W } from './constants.js';

export function mulberry32(seed) {
  let a = (seed >>> 0) || 1;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function clamp(v, lo, hi) {
  return v < lo ? lo : v > hi ? hi : v;
}

export class Terrain {
  constructor(width = WORLD_W, height = WORLD_H, themeKey = 'meadow', seed = 1337) {
    this.width = width;
    this.height = height;
    this.themeKey = THEMES[themeKey] ? themeKey : 'meadow';
    this.theme = THEMES[this.themeKey];
    this.seed = seed >>> 0;
    this.rng = mulberry32(this.seed);

    this.solid = new Uint8Array(width * height);
    this.solidCount = 0;

    this.canvas = null;
    this.ctx = null;
    this.imageData = null;

    this._generateMask();
    if (typeof document !== 'undefined') {
      this._buildTextureCanvas();
    }
  }

  _generateMask() {
    const { width, height, themeKey, rng } = this;
    const heights = new Float32Array(width);

    const p1 = rng() * Math.PI * 2;
    const p2 = rng() * Math.PI * 2;
    const p3 = rng() * Math.PI * 2;

    for (let x = 0; x < width; x++) {
      const u = x / width;
      let y = 520;

      if (themeKey === 'meadow') {
        const rolling =
          Math.sin(u * Math.PI * 3.2 + p1) * 95 +
          Math.sin(u * Math.PI * 7.5 + p2) * 38 +
          Math.cos(u * Math.PI * 14 + p3) * 14;
        // Flat plateaus around u ~ 0.25 and 0.75
        const plateau =
          Math.exp(-Math.pow((u - 0.28) / 0.08, 2)) * -45 +
          Math.exp(-Math.pow((u - 0.72) / 0.08, 2)) * -40;
        y = 505 + rolling * 0.78 + plateau;
      } else if (themeKey === 'arctic') {
        // Jagged twin alpine glaciers with frozen central valley
        const leftPeak = Math.exp(-Math.pow((u - 0.24) / 0.13, 2)) * 210;
        const rightPeak = Math.exp(-Math.pow((u - 0.76) / 0.13, 2)) * 205;
        const centerMound = Math.exp(-Math.pow((u - 0.5) / 0.08, 2)) * 75;
        const crag =
          Math.abs(Math.sin(u * Math.PI * 11 + p1)) * -28 +
          Math.sin(u * Math.PI * 22 + p2) * 12;
        y = 620 - leftPeak - rightPeak - centerMound + crag;
      } else if (themeKey === 'desert') {
        // Stepped canyon mesas with central gorge
        const raw =
          500 -
          Math.exp(-Math.pow((u - 0.23) / 0.12, 2)) * 165 -
          Math.exp(-Math.pow((u - 0.77) / 0.12, 2)) * 170 +
          Math.exp(-Math.pow((u - 0.5) / 0.075, 2)) * 120 +
          Math.sin(u * Math.PI * 6 + p1) * 28;
        // Terraced mesa quantization
        const step = 36;
        const snapped = Math.round(raw / step) * step;
        y = raw * 0.35 + snapped * 0.65 + Math.sin(u * Math.PI * 16 + p2) * 6;
      } else {
        // Volcano: twin fortress spires + central caldera bridge
        const spireL = Math.exp(-Math.pow((u - 0.22) / 0.10, 2)) * 235;
        const spireR = Math.exp(-Math.pow((u - 0.78) / 0.10, 2)) * 235;
        const calderaRim = Math.exp(-Math.pow((u - 0.5) / 0.11, 2)) * 125;
        const jagged =
          Math.sin(u * Math.PI * 9 + p1) * 26 +
          Math.cos(u * Math.PI * 19 + p3) * 14;
        y = 640 - spireL - spireR - calderaRim + jagged;
      }

      // Smoothly taper islands into water on far left & right edges
      const edgeLeft = clamp((x - 75) / 95, 0, 1);
      const edgeRight = clamp((width - 75 - x) / 95, 0, 1);
      const islandMask = Math.min(edgeLeft, edgeRight);
      const sinkY = height + 40;
      y = sinkY * (1 - islandMask) + y * islandMask;

      heights[x] = clamp(Math.round(y), 185, height + 20);
    }

    // Fill solid columns
    let count = 0;
    for (let x = 0; x < width; x++) {
      const topY = heights[x];
      for (let y = topY; y < height; y++) {
        this.solid[y * width + x] = 1;
        count++;
      }
    }
    this.solidCount = count;

    // Add scenic carved arches / natural overhangs depending on theme
    if (themeKey === 'meadow') {
      this._carveRawEllipse(width * 0.5, 595, 62, 42);
      this._carveRawEllipse(width * 0.28, 560, 34, 24);
    } else if (themeKey === 'arctic') {
      this._carveRawEllipse(width * 0.24, 520, 44, 28);
      this._carveRawEllipse(width * 0.76, 525, 44, 28);
    } else if (themeKey === 'desert') {
      this._carveRawEllipse(width * 0.23, 470, 42, 26);
      this._carveRawEllipse(width * 0.77, 465, 42, 26);
    } else if (themeKey === 'volcano') {
      // Caldera tunnel under the central bridge
      this._carveRawEllipse(width * 0.5, 625, 72, 46);
    }
  }

  _carveRawEllipse(cx, cy, rx, ry) {
    const { width, height, solid } = this;
    const x0 = Math.max(0, Math.floor(cx - rx));
    const x1 = Math.min(width - 1, Math.ceil(cx + rx));
    const y0 = Math.max(0, Math.floor(cy - ry));
    const y1 = Math.min(height - 1, Math.ceil(cy + ry));
    for (let y = y0; y <= y1; y++) {
      const dy = (y - cy) / ry;
      for (let x = x0; x <= x1; x++) {
        const dx = (x - cx) / rx;
        if (dx * dx + dy * dy <= 1) {
          const idx = y * width + x;
          if (solid[idx] === 1) {
            solid[idx] = 0;
            this.solidCount--;
          }
        }
      }
    }
  }

  _buildTextureCanvas() {
    const { width, height, solid, theme } = this;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    const img = ctx.createImageData(width, height);
    const data = img.data;

    // Precompute column surface depths & top exposed surface Y so caves don't spawn interior grass
    const depthAbove = new Int16Array(width * height);
    const topSurfaceY = new Int16Array(width).fill(height);
    for (let x = 0; x < width; x++) {
      let depth = 0;
      for (let y = 0; y < height; y++) {
        const idx = y * width + x;
        if (solid[idx] === 1) {
          if (y < topSurfaceY[x]) topSurfaceY[x] = y;
          depth++;
          depthAbove[idx] = depth;
        } else {
          depth = 0;
        }
      }
    }

    const noiseVal = (x, y) => {
      const n = Math.sin(x * 0.13 + y * 0.19) * 43758.5453;
      return n - Math.floor(n);
    };

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = y * width + x;
        if (solid[idx] === 0) continue;

        const p = idx * 4;
        const d = depthAbove[idx];
        const strata = Math.sin(y * 0.055 + Math.sin(x * 0.018) * 2.1);
        const grain = noiseVal(x, y);
        const checker = ((x >> 3) + (y >> 3)) & 1;

        let r, g, b;
        const crustDepth = 9 + Math.round(Math.sin(x * 0.19) * 2);
        const isExposedTop = y <= topSurfaceY[x] + crustDepth + 3;

        if (isExposedTop && d <= 2) {
          [r, g, b] = theme.crustTop;
        } else if (isExposedTop && d <= crustDepth) {
          const t = (d - 2) / Math.max(1, crustDepth - 2);
          const c1 = theme.crustMain;
          const c2 = theme.crustShadow;
          r = c1[0] * (1 - t * 0.5) + c2[0] * (t * 0.5);
          g = c1[1] * (1 - t * 0.5) + c2[1] * (t * 0.5);
          b = c1[2] * (1 - t * 0.5) + c2[2] * (t * 0.5);
        } else if (isExposedTop && d <= crustDepth + 3) {
          [r, g, b] = theme.crustShadow;
        } else {
          // Underground rock & soil strata
          const base = strata > 0.35 ? theme.soilLight : strata < -0.35 ? theme.soilDark : theme.soilMid;
          r = base[0];
          g = base[1];
          b = base[2];

          // Pebble/vein speckles
          if (grain > 0.965 || (theme.isLava && Math.abs(Math.sin(x * 0.04 + y * 0.06)) > 0.985)) {
            [r, g, b] = theme.pebbleColor;
          } else {
            const shade = (grain - 0.5) * 22 + (checker ? 4 : -4);
            r += shade;
            g += shade;
            b += shade;
          }
        }

        // Subtle darkening near the bottom of the map
        const depthFade = 1 - clamp((y - BASE_WATER_Y + 40) / 240, 0, 0.35);
        data[p] = clamp(Math.round(r * depthFade), 0, 255);
        data[p + 1] = clamp(Math.round(g * depthFade), 0, 255);
        data[p + 2] = clamp(Math.round(b * depthFade), 0, 255);
        data[p + 3] = 255;
      }
    }

    ctx.putImageData(img, 0, 0);
    this.canvas = canvas;
    this.ctx = ctx;
    this.imageData = img;
  }

  isSolid(x, y) {
    const ix = Math.floor(x);
    const iy = Math.floor(y);
    if (ix < 0 || ix >= this.width || iy < 0 || iy >= this.height) return false;
    return this.solid[iy * this.width + ix] === 1;
  }

  sampleColor(x, y) {
    const ix = clamp(Math.floor(x), 0, this.width - 1);
    const iy = clamp(Math.floor(y), 0, this.height - 1);
    if (this.imageData) {
      const p = (iy * this.width + ix) * 4;
      if (this.imageData.data[p + 3] > 0) {
        return `rgb(${this.imageData.data[p]},${this.imageData.data[p + 1]},${this.imageData.data[p + 2]})`;
      }
    }
    const [r, g, b] = this.theme.soilMid;
    return `rgb(${r},${g},${b})`;
  }

  carveCircle(cx, cy, radius, scorchWidth = 4) {
    const { width, height, solid, imageData, ctx } = this;
    const outerR = radius + scorchWidth;
    const x0 = Math.max(0, Math.floor(cx - outerR));
    const x1 = Math.min(width - 1, Math.ceil(cx + outerR));
    const y0 = Math.max(0, Math.floor(cy - outerR));
    const y1 = Math.min(height - 1, Math.ceil(cy + outerR));

    if (x1 < x0 || y1 < y0) return 0;

    const rSq = radius * radius;
    const outerSq = outerR * outerR;
    let removed = 0;
    const data = imageData ? imageData.data : null;

    for (let y = y0; y <= y1; y++) {
      const dy = y - cy;
      const dySq = dy * dy;
      for (let x = x0; x <= x1; x++) {
        const dx = x - cx;
        const dSq = dx * dx + dySq;
        if (dSq > outerSq) continue;

        const idx = y * width + x;
        if (dSq <= rSq) {
          if (solid[idx] === 1) {
            solid[idx] = 0;
            removed++;
            if (data) {
              data[idx * 4 + 3] = 0;
            }
          }
        } else if (solid[idx] === 1 && data) {
          // Charred crater rim
          const dist = Math.sqrt(dSq) - radius;
          const scorch = 0.42 + (dist / scorchWidth) * 0.45;
          const p = idx * 4;
          data[p] = Math.round(data[p] * scorch);
          data[p + 1] = Math.round(data[p + 1] * scorch * 0.92);
          data[p + 2] = Math.round(data[p + 2] * scorch * 0.88);
        }
      }
    }

    this.solidCount -= removed;
    if (ctx && imageData) {
      ctx.putImageData(imageData, 0, 0, x0, y0, x1 - x0 + 1, y1 - y0 + 1);
    }
    return removed;
  }

  placeGirder(cx, cy, angle, length = 96, thickness = 12) {
    const { width, height, solid, imageData, ctx } = this;
    const halfL = length * 0.5;
    const halfT = thickness * 0.5;
    const cos = Math.cos(-angle);
    const sin = Math.sin(-angle);
    const bound = Math.ceil(Math.hypot(halfL, halfT)) + 2;

    const x0 = Math.max(0, Math.floor(cx - bound));
    const x1 = Math.min(width - 1, Math.ceil(cx + bound));
    const y0 = Math.max(0, Math.floor(cy - bound));
    const y1 = Math.min(height - 1, Math.ceil(cy + bound));

    const data = imageData ? imageData.data : null;
    for (let y = y0; y <= y1; y++) {
      for (let x = x0; x <= x1; x++) {
        const dx = x - cx;
        const dy = y - cy;
        const lx = dx * cos - dy * sin;
        const ly = dx * sin + dy * cos;
        if (Math.abs(lx) <= halfL && Math.abs(ly) <= halfT) {
          const idx = y * width + x;
          if (solid[idx] === 0) {
            solid[idx] = 1;
            this.solidCount++;
          }
          if (data) {
            const p = idx * 4;
            const isRim = Math.abs(ly) >= halfT - 2 || Math.abs(lx) >= halfL - 2;
            const truss = Math.abs(((lx + halfL) % 16) - 8) < 1.8 && Math.abs(ly) < halfT - 2;
            if (isRim) {
              data[p] = 196;
              data[p + 1] = 208;
              data[p + 2] = 224;
            } else if (truss) {
              data[p] = 138;
              data[p + 1] = 152;
              data[p + 2] = 172;
            } else {
              data[p] = 74;
              data[p + 1] = 86;
              data[p + 2] = 104;
            }
            data[p + 3] = 255;
          }
        }
      }
    }

    if (ctx && imageData) {
      ctx.putImageData(imageData, 0, 0, x0, y0, x1 - x0 + 1, y1 - y0 + 1);
    }
  }

  getSurfaceNormal(x, y, sampleR = 5) {
    let nx = 0;
    let ny = 0;
    let hits = 0;
    const ix = Math.floor(x);
    const iy = Math.floor(y);
    for (let oy = -sampleR; oy <= sampleR; oy++) {
      for (let ox = -sampleR; ox <= sampleR; ox++) {
        if (ox === 0 && oy === 0) continue;
        if (ox * ox + oy * oy > sampleR * sampleR) continue;
        if (this.isSolid(ix + ox, iy + oy)) {
          nx -= ox;
          ny -= oy;
          hits++;
        }
      }
    }
    const len = Math.hypot(nx, ny);
    if (hits === 0 || len < 0.001) {
      return { x: 0, y: -1 };
    }
    return { x: nx / len, y: ny / len };
  }

  findGroundY(x, startY = 0) {
    const ix = Math.floor(x);
    if (ix < 0 || ix >= this.width) return -1;
    const yStart = Math.max(0, Math.floor(startY));
    for (let y = yStart; y < this.height; y++) {
      if (this.solid[y * this.width + ix] === 1) {
        return y;
      }
    }
    return -1;
  }

  findSafeSpawns(count, marginX = 140, waterY = BASE_WATER_Y) {
    const candidates = [];
    const usableW = this.width - marginX * 2;
    const step = 12;

    for (let x = marginX; x <= this.width - marginX; x += step) {
      // Find topmost solid surface with >= 26px open sky above it
      for (let y = 80; y < waterY - 34; y++) {
        if (!this.isSolid(x, y) && this.isSolid(x, y + 1)) {
          let clear = true;
          for (let h = 1; h <= 26; h++) {
            if (this.isSolid(x, y - h) || this.isSolid(x - 6, y - h) || this.isSolid(x + 6, y - h)) {
              clear = false;
              break;
            }
          }
          if (clear) {
            candidates.push({ x, y: y - 10 });
          }
          break;
        }
      }
    }

    if (candidates.length === 0) {
      // Emergency fallback across center
      const out = [];
      for (let i = 0; i < count; i++) {
        const x = Math.round(marginX + ((i + 0.5) / count) * usableW);
        const gy = this.findGroundY(x, 40);
        out.push({ x, y: gy > 0 ? gy - 12 : 300 });
      }
      return out;
    }

    // Spread picks horizontally across available candidates, then shuffle order deterministically
    const picked = [];
    const minSpacing = Math.max(48, usableW / (count * 1.45));
    const shuffled = [...candidates];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(this.rng() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    for (const c of shuffled) {
      if (picked.every((p) => Math.abs(p.x - c.x) >= minSpacing)) {
        picked.push(c);
        if (picked.length === count) break;
      }
    }

    // Fill remainder if spacing was too strict
    for (const c of shuffled) {
      if (picked.length >= count) break;
      if (!picked.some((p) => Math.abs(p.x - c.x) < 28 && Math.abs(p.y - c.y) < 28)) {
        picked.push(c);
      }
    }

    while (picked.length < count) {
      picked.push(candidates[picked.length % candidates.length]);
    }
    return picked;
  }
}
