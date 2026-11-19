const ASSET_BASE =
  (typeof window !== 'undefined' && window.__WORMS_ASSET_BASE__) || 'assets/';

export const SPRITE_RECTS = {
  worms: {
    wormIdle: [
      [61, 43, 153, 185],
      [316, 43, 139, 185],
      [570, 42, 137, 183],
      [822, 40, 133, 186],
      [1075, 37, 129, 187],
      [1327, 40, 134, 186],
    ],
    wormWalk: [
      [65, 284, 142, 192],
      [328, 283, 132, 182],
      [567, 284, 151, 181],
      [822, 283, 141, 187],
      [1075, 284, 143, 186],
      [1331, 284, 137, 182],
    ],
    wormBazooka: [41, 567, 180, 172],
    wormFire: [287, 533, 218, 206],
    wormAir: [576, 530, 141, 202],
    wormLand: [803, 585, 174, 158],
    wormRope: [1055, 526, 168, 210],
    wormParachute: [1315, 514, 165, 244],
    grenade: [57, 803, 128, 162],
    rocket: [320, 849, 137, 89],
    banana: [594, 796, 124, 164],
    crateWood: [808, 827, 159, 136],
    explosion: [1033, 788, 221, 193],
    smoke: [1304, 803, 201, 178],
  },
  items: {
    bazooka: [18, 54, 202, 104],
    shotgun: [238, 43, 168, 120],
    uzi: [417, 47, 176, 121],
    grenadeIcon: [626, 36, 100, 132],
    clusterBomb: [772, 26, 140, 142],
    bananaPlain: [1104, 62, 108, 98],
    angel: [1260, 32, 90, 136],
    crateBox: [1398, 64, 122, 106],
    homing: [36, 210, 152, 126],
    dynamite: [242, 200, 124, 134],
    fireball: [750, 208, 106, 126],
    jetpack: [1404, 202, 102, 156],
    parachuteCrateRed: [40, 356, 134, 146],
    dynamiteClock: [438, 380, 96, 120],
    cross: [590, 382, 84, 112],
    radio: [740, 364, 102, 140],
    portal: [920, 364, 114, 146],
    bricks: [1082, 388, 120, 102],
    barrel: [1258, 382, 98, 120],
    crateAlert: [222, 542, 120, 112],
    clusterGroup: [578, 536, 114, 110],
    smokeItem: [910, 532, 128, 124],
    explosionItem: [1076, 530, 140, 128],
    splash: [1248, 534, 128, 130],
    blowtorch: [1232, 694, 172, 108],
    skull: [1411, 683, 108, 120],
    parachuteCrateOrange: [556, 804, 122, 154],
    trophy: [720, 828, 128, 134],
    stopwatch: [904, 830, 110, 136],
    mine: [1056, 876, 144, 86],
    handgun: [934, 52, 108, 108],
    mineButton: [422, 234, 106, 92],
    mortar: [564, 206, 130, 132],
    sheep: [908, 224, 124, 108],
    cow: [1088, 214, 128, 120],
    punch: [1254, 220, 100, 116],
    rope: [234, 372, 152, 130],
    slime: [1394, 392, 124, 118],
    ice: [48, 542, 122, 114],
    magnet: [412, 538, 114, 106],
    shrapnel: [742, 534, 122, 122],
    gas: [1402, 540, 118, 114],
    petrol: [58, 688, 92, 108],
    phone: [562, 688, 118, 102],
    drill: [712, 698, 160, 96],
    supersheep: [906, 690, 136, 110],
    sonic: [1078, 684, 112, 122],
    flare: [44, 812, 124, 156],
    balloon: [398, 824, 96, 136],
    windblower: [1226, 860, 144, 106],
    meteor: [1394, 836, 128, 136],
  },
  plane: {
    plane: [0, 0, 941, 498],
  },
};

export class SpriteAtlas {
  constructor() {
    this.sheets = { worms: null, items: null, plane: null };
    this.loaded = false;
    this.loading = false;
    this.iconCache = new Map();
    this._callbacks = [];
  }

  isReady() {
    const w = this.sheets.worms;
    const it = this.sheets.items;
    return Boolean(
      w &&
        it &&
        w.complete &&
        it.complete &&
        w.naturalWidth > 0 &&
        it.naturalWidth > 0
    );
  }

  load(onReady = null) {
    if (typeof Image === 'undefined') return;
    if (this.isReady()) {
      onReady?.();
      return;
    }
    if (onReady) this._callbacks.push(onReady);
    if (this.loading) return;
    this.loading = true;

    let remaining = 3;
    const doneOne = () => {
      remaining--;
      if (remaining <= 0) {
        this.loaded = this.isReady();
        const cbs = this._callbacks.splice(0);
        for (const cb of cbs) cb();
      }
    };

    const loadImg = (key, src) => {
      const img = new Image();
      img.onload = doneOne;
      img.onerror = doneOne;
      img.src = src;
      this.sheets[key] = img;
    };

    loadImg('worms', `${ASSET_BASE}worms-sheet.png`);
    loadImg('items', `${ASSET_BASE}items-sheet.png`);
    loadImg('plane', `${ASSET_BASE}plane.png`);
  }

  _resolveRect(sheetName, rectOrKey) {
    if (Array.isArray(rectOrKey)) return rectOrKey;
    return SPRITE_RECTS[sheetName]?.[rectOrKey] || null;
  }

  draw(ctx, sheetName, rectOrKey, x, y, maxW, maxH, anchorX = 0.5, anchorY = 0.5) {
    const img = this.sheets[sheetName];
    if (!img || !img.complete || img.naturalWidth === 0) return false;
    const rect = this._resolveRect(sheetName, rectOrKey);
    if (!rect) return false;

    const [sx, sy, sw, sh] = rect;
    let dw = maxW;
    let dh = maxH;
    if (dw && dh) {
      const scale = Math.min(dw / sw, dh / sh);
      dw = sw * scale;
      dh = sh * scale;
    } else if (dw && !dh) {
      dh = (sh / sw) * dw;
    } else if (!dw && dh) {
      dw = (sw / sh) * dh;
    } else {
      dw = sw;
      dh = sh;
    }

    ctx.drawImage(img, sx, sy, sw, sh, x - dw * anchorX, y - dh * anchorY, dw, dh);
    return true;
  }

  getIconDataUrl(sheetName, key, size = 56) {
    if (!this.isReady() || typeof document === 'undefined') return null;
    const cacheKey = `${sheetName}:${key}:${size}`;
    if (this.iconCache.has(cacheKey)) return this.iconCache.get(cacheKey);

    const rect = this._resolveRect(sheetName, key);
    const img = this.sheets[sheetName];
    if (!rect || !img || !img.complete || img.naturalWidth === 0) return null;

    const [sx, sy, sw, sh] = rect;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    const pad = 4;
    const scale = Math.min((size - pad * 2) / sw, (size - pad * 2) / sh);
    const dw = sw * scale;
    const dh = sh * scale;
    ctx.drawImage(img, sx, sy, sw, sh, (size - dw) * 0.5, (size - dh) * 0.5, dw, dh);

    try {
      const url = canvas.toDataURL('image/png');
      this.iconCache.set(cacheKey, url);
      return url;
    } catch {
      return null;
    }
  }

  getIconHtml(sheetName, key, size = 28) {
    if (!this.isReady()) return null;
    const url = this.getIconDataUrl(sheetName, key, 56);
    if (url) {
      return `<img class="weapon-sprite-icon" src="${url}" alt="" />`;
    }
    const rect = this._resolveRect(sheetName, key);
    const img = this.sheets[sheetName];
    if (!rect || !img || !img.complete || img.naturalWidth === 0) return null;

    const [sx, sy, sw, sh] = rect;
    const pad = 2;
    const scale = Math.min((size - pad * 2) / sw, (size - pad * 2) / sh);
    const dw = sw * scale;
    const dh = sh * scale;
    const bgW = img.naturalWidth * scale;
    const bgH = img.naturalHeight * scale;
    const posX = -sx * scale;
    const posY = -sy * scale;

    return (
      `<span class="weapon-sprite-icon" style="display:inline-flex;align-items:center;justify-content:center;width:${size}px;height:${size}px;overflow:hidden;">` +
      `<span style="display:block;width:${dw.toFixed(2)}px;height:${dh.toFixed(2)}px;background-image:url('${img.src}');background-size:${bgW.toFixed(2)}px ${bgH.toFixed(2)}px;background-position:${posX.toFixed(2)}px ${posY.toFixed(2)}px;background-repeat:no-repeat;flex-shrink:0;"></span>` +
      `</span>`
    );
  }
}

export const sprites = new SpriteAtlas();
