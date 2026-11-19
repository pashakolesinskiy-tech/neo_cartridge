// Zero-dependency ISO/IEC 18004 QR Code Encoder (Versions 1-5, ECC Level L, Byte mode)

const VERSION_SPECS = [
  null,
  { version: 1, size: 21, dataCW: 19, ecCW: 7, align: [] },
  { version: 2, size: 25, dataCW: 34, ecCW: 10, align: [18] },
  { version: 3, size: 29, dataCW: 55, ecCW: 15, align: [22] },
  { version: 4, size: 33, dataCW: 80, ecCW: 20, align: [26] },
  { version: 5, size: 37, dataCW: 108, ecCW: 26, align: [30] },
];

const GF_EXP = new Uint8Array(512);
const GF_LOG = new Uint8Array(256);
(() => {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    GF_EXP[i] = x;
    GF_LOG[x] = i;
    x <<= 1;
    if (x & 0x100) x ^= 0x11d;
  }
  for (let i = 255; i < 512; i++) {
    GF_EXP[i] = GF_EXP[i - 255];
  }
})();

function gfMul(a, b) {
  if (a === 0 || b === 0) return 0;
  return GF_EXP[GF_LOG[a] + GF_LOG[b]];
}

function buildRsGenerator(ecCount) {
  let poly = [1];
  for (let i = 0; i < ecCount; i++) {
    const next = new Array(poly.length + 1).fill(0);
    const root = GF_EXP[i];
    for (let j = 0; j < poly.length; j++) {
      next[j] ^= poly[j];
      next[j + 1] ^= gfMul(poly[j], root);
    }
    poly = next;
  }
  return poly;
}

export function computeReedSolomon(dataBytes, ecCount) {
  const gen = buildRsGenerator(ecCount);
  const rem = new Uint8Array(ecCount);
  for (let i = 0; i < dataBytes.length; i++) {
    const factor = dataBytes[i] ^ rem[0];
    rem.copyWithin(0, 1);
    rem[ecCount - 1] = 0;
    if (factor !== 0) {
      for (let j = 0; j < ecCount; j++) {
        rem[j] ^= gfMul(gen[j + 1], factor);
      }
    }
  }
  return rem;
}

export function computeFormatBits(maskId) {
  // ECC Level L = 01
  const data = (0b01 << 3) | (maskId & 0x7);
  let bits = data << 10;
  const gen = 0x537;
  for (let i = 14; i >= 10; i--) {
    if ((bits >> i) & 1) {
      bits ^= gen << (i - 10);
    }
  }
  return ((data << 10) | bits) ^ 0x5412;
}

function encodeDataCodewords(bytes, dataCW) {
  const bits = [];
  const pushBits = (val, len) => {
    for (let i = len - 1; i >= 0; i--) {
      bits.push((val >> i) & 1);
    }
  };

  // Byte mode indicator (0100) + 8-bit length
  pushBits(0b0100, 4);
  pushBits(bytes.length, 8);
  for (let i = 0; i < bytes.length; i++) {
    pushBits(bytes[i], 8);
  }

  const maxBits = dataCW * 8;
  const termLen = Math.min(4, maxBits - bits.length);
  pushBits(0, termLen);
  while (bits.length % 8 !== 0) bits.push(0);

  const codewords = new Uint8Array(dataCW);
  const byteCount = bits.length / 8;
  for (let i = 0; i < byteCount; i++) {
    let b = 0;
    for (let k = 0; k < 8; k++) {
      b = (b << 1) | bits[i * 8 + k];
    }
    codewords[i] = b;
  }

  let padToggle = 0;
  for (let i = byteCount; i < dataCW; i++) {
    codewords[i] = padToggle === 0 ? 0xec : 0x11;
    padToggle ^= 1;
  }
  return codewords;
}

function createMatrix(spec) {
  const { size, version, align } = spec;
  const modules = new Uint8Array(size * size);
  const isFunc = new Uint8Array(size * size);

  const setFunc = (r, c, dark) => {
    if (r < 0 || r >= size || c < 0 || c >= size) return;
    const idx = r * size + c;
    modules[idx] = dark ? 1 : 0;
    isFunc[idx] = 1;
  };

  const drawFinder = (r0, c0) => {
    for (let dr = -1; dr <= 7; dr++) {
      for (let dc = -1; dc <= 7; dc++) {
        const r = r0 + dr;
        const c = c0 + dc;
        if (r < 0 || r >= size || c < 0 || c >= size) continue;
        const inBox = dr >= 0 && dr <= 6 && dc >= 0 && dc <= 6;
        const dark =
          inBox &&
          (dr === 0 ||
            dr === 6 ||
            dc === 0 ||
            dc === 6 ||
            (dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4));
        setFunc(r, c, dark);
      }
    }
  };

  drawFinder(0, 0);
  drawFinder(0, size - 7);
  drawFinder(size - 7, 0);

  // Timing patterns
  for (let i = 8; i <= size - 9; i++) {
    const dark = i % 2 === 0;
    setFunc(6, i, dark);
    setFunc(i, 6, dark);
  }

  // Alignment pattern (Versions 2..5 have 1 center at (a, a))
  for (const ar of align) {
    for (let dr = -2; dr <= 2; dr++) {
      for (let dc = -2; dc <= 2; dc++) {
        const dark = Math.abs(dr) === 2 || Math.abs(dc) === 2 || (dr === 0 && dc === 0);
        setFunc(ar + dr, ar + dc, dark);
      }
    }
  }

  // Dark module
  setFunc(4 * version + 9, 8, true);

  // Reserve format info strips
  for (let i = 0; i <= 8; i++) {
    if (i !== 6) {
      setFunc(8, i, false);
      setFunc(i, 8, false);
    }
  }
  for (let i = 0; i < 8; i++) {
    setFunc(8, size - 1 - i, false);
    if (i < 7) setFunc(size - 1 - i, 8, false);
  }

  return { size, modules, isFunc };
}

function placeDataBits(matrix, fullCodewords) {
  const { size, modules, isFunc } = matrix;
  const totalBits = fullCodewords.length * 8;
  let bitIdx = 0;
  let upward = true;

  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right--;
    for (let step = 0; step < size; step++) {
      const r = upward ? size - 1 - step : step;
      for (let dx = 0; dx < 2; dx++) {
        const c = right - dx;
        const idx = r * size + c;
        if (isFunc[idx]) continue;
        let bit = 0;
        if (bitIdx < totalBits) {
          const byte = fullCodewords[bitIdx >> 3];
          bit = (byte >> (7 - (bitIdx & 7))) & 1;
          bitIdx++;
        }
        modules[idx] = bit;
      }
    }
    upward = !upward;
  }
}

function maskCond(maskId, r, c) {
  switch (maskId) {
    case 0:
      return (r + c) % 2 === 0;
    case 1:
      return r % 2 === 0;
    case 2:
      return c % 3 === 0;
    case 3:
      return (r + c) % 3 === 0;
    case 4:
      return (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0;
    case 5:
      return ((r * c) % 2) + ((r * c) % 3) === 0;
    case 6:
      return (((r * c) % 2) + ((r * c) % 3)) % 2 === 0;
    default:
      return (((r + c) % 2) + ((r * c) % 3)) % 2 === 0;
  }
}

function applyMaskAndFormat(baseMatrix, maskId) {
  const { size, isFunc } = baseMatrix;
  const out = new Uint8Array(baseMatrix.modules);

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const idx = r * size + c;
      if (!isFunc[idx] && maskCond(maskId, r, c)) {
        out[idx] ^= 1;
      }
    }
  }

  const fmt = computeFormatBits(maskId);
  const setBit = (r, c, bitPos) => {
    out[r * size + c] = (fmt >> bitPos) & 1;
  };

  // Top-left format strip
  for (let i = 0; i <= 5; i++) setBit(8, i, 14 - i);
  setBit(8, 7, 8);
  setBit(8, 8, 7);
  setBit(7, 8, 6);
  for (let i = 0; i <= 5; i++) setBit(5 - i, 8, 5 - i);

  // Split copies (bottom-left & top-right)
  for (let i = 0; i < 7; i++) setBit(size - 1 - i, 8, 14 - i);
  for (let i = 0; i < 8; i++) setBit(8, size - 8 + i, 7 - i);

  return out;
}

function computePenalty(modules, size) {
  let penalty = 0;

  // Rule 1: 5+ consecutive same color in row/col
  for (let r = 0; r < size; r++) {
    let runColor = modules[r * size];
    let runLen = 1;
    for (let c = 1; c < size; c++) {
      const v = modules[r * size + c];
      if (v === runColor) {
        runLen++;
      } else {
        if (runLen >= 5) penalty += 3 + (runLen - 5);
        runColor = v;
        runLen = 1;
      }
    }
    if (runLen >= 5) penalty += 3 + (runLen - 5);
  }
  for (let c = 0; c < size; c++) {
    let runColor = modules[c];
    let runLen = 1;
    for (let r = 1; r < size; r++) {
      const v = modules[r * size + c];
      if (v === runColor) {
        runLen++;
      } else {
        if (runLen >= 5) penalty += 3 + (runLen - 5);
        runColor = v;
        runLen = 1;
      }
    }
    if (runLen >= 5) penalty += 3 + (runLen - 5);
  }

  // Rule 2: 2x2 same-color blocks
  for (let r = 0; r < size - 1; r++) {
    for (let c = 0; c < size - 1; c++) {
      const v = modules[r * size + c];
      if (
        modules[r * size + c + 1] === v &&
        modules[(r + 1) * size + c] === v &&
        modules[(r + 1) * size + c + 1] === v
      ) {
        penalty += 3;
      }
    }
  }

  // Rule 3: finder-like 1:1:3:1:1 patterns
  const matchPattern = (arr) => {
    for (let i = 0; i <= arr.length - 11; i++) {
      const isA =
        arr[i] === 1 &&
        arr[i + 1] === 0 &&
        arr[i + 2] === 1 &&
        arr[i + 3] === 1 &&
        arr[i + 4] === 1 &&
        arr[i + 5] === 0 &&
        arr[i + 6] === 1 &&
        arr[i + 7] === 0 &&
        arr[i + 8] === 0 &&
        arr[i + 9] === 0 &&
        arr[i + 10] === 0;
      const isB =
        arr[i] === 0 &&
        arr[i + 1] === 0 &&
        arr[i + 2] === 0 &&
        arr[i + 3] === 0 &&
        arr[i + 4] === 1 &&
        arr[i + 5] === 0 &&
        arr[i + 6] === 1 &&
        arr[i + 7] === 1 &&
        arr[i + 8] === 1 &&
        arr[i + 9] === 0 &&
        arr[i + 10] === 1;
      if (isA || isB) penalty += 40;
    }
  };
  const line = new Uint8Array(size);
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) line[c] = modules[r * size + c];
    matchPattern(line);
  }
  for (let c = 0; c < size; c++) {
    for (let r = 0; r < size; r++) line[r] = modules[r * size + c];
    matchPattern(line);
  }

  // Rule 4: dark/light balance
  let dark = 0;
  for (let i = 0; i < modules.length; i++) dark += modules[i];
  const pct = (dark * 100) / modules.length;
  const k = Math.floor(Math.abs(pct - 50) / 5);
  penalty += k * 10;

  return penalty;
}

export function encodeQR(text) {
  const bytes = new TextEncoder().encode(String(text));
  let spec = null;
  for (let v = 1; v <= 5; v++) {
    if (bytes.length <= VERSION_SPECS[v].dataCW - 2) {
      spec = VERSION_SPECS[v];
      break;
    }
  }
  if (!spec) {
    throw new Error(`QR payload too long (${bytes.length} bytes, max 106)`);
  }

  const data = encodeDataCodewords(bytes, spec.dataCW);
  const ec = computeReedSolomon(data, spec.ecCW);
  const full = new Uint8Array(data.length + ec.length);
  full.set(data, 0);
  full.set(ec, data.length);

  const matrix = createMatrix(spec);
  placeDataBits(matrix, full);

  let bestMask = 0;
  let bestModules = null;
  let bestScore = Infinity;
  for (let m = 0; m < 8; m++) {
    const candidate = applyMaskAndFormat(matrix, m);
    const score = computePenalty(candidate, spec.size);
    if (score < bestScore) {
      bestScore = score;
      bestMask = m;
      bestModules = candidate;
    }
  }

  return {
    version: spec.version,
    size: spec.size,
    mask: bestMask,
    modules: bestModules,
  };
}

export function renderQRToCanvas(canvas, text, quietZone = 4) {
  if (!canvas) return null;
  const qr = encodeQR(text);
  const total = qr.size + quietZone * 2;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  const modSize = Math.floor(Math.min(w, h) / total);
  const drawSize = modSize * total;
  const offsetX = Math.floor((w - drawSize) * 0.5);
  const offsetY = Math.floor((h - drawSize) * 0.5);

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = '#0c111d';
  for (let r = 0; r < qr.size; r++) {
    for (let c = 0; c < qr.size; c++) {
      if (qr.modules[r * qr.size + c]) {
        ctx.fillRect(
          offsetX + (c + quietZone) * modSize,
          offsetY + (r + quietZone) * modSize,
          modSize,
          modSize
        );
      }
    }
  }
  return qr;
}
