import { WORLD_H, WORLD_W } from './constants.js';

function clamp(v, lo, hi) {
  return v < lo ? lo : v > hi ? hi : v;
}

export class Camera {
  constructor(viewW = 1280, viewH = 720) {
    this.viewW = viewW;
    this.viewH = viewH;
    this.x = WORLD_W * 0.5;
    this.y = WORLD_H * 0.52;
    this.targetX = this.x;
    this.targetY = this.y;
    this.zoom = 1;
    this.targetZoom = 1;
    this.shakeTime = 0;
    this.shakeDuration = 0.01;
    this.shakeIntensity = 0;
    this.shakeX = 0;
    this.shakeY = 0;
    this.manualHold = 0;
  }

  resize(viewW, viewH) {
    this.viewW = Math.max(1, viewW);
    this.viewH = Math.max(1, viewH);
    this._clampTarget();
  }

  focus(wx, wy, immediate = false) {
    if (this.manualHold > 0 && !immediate) return;
    this.targetX = wx;
    this.targetY = wy;
    this._clampTarget();
    if (immediate) {
      this.x = this.targetX;
      this.y = this.targetY;
    }
  }

  panByScreenDelta(dx, dy) {
    this.manualHold = 2.4;
    this.targetX -= dx / this.zoom;
    this.targetY -= dy / this.zoom;
    this._clampTarget();
    this.x = this.targetX;
    this.y = this.targetY;
  }

  adjustZoom(deltaFactor, anchorScreenX = null, anchorScreenY = null) {
    const oldTargetZoom = this.targetZoom;
    const nextZoom = clamp(oldTargetZoom * deltaFactor, 0.52, 1.65);
    if (anchorScreenX !== null && anchorScreenY !== null) {
      const before = this.screenToWorld(anchorScreenX, anchorScreenY);
      this.zoom = nextZoom;
      this.targetZoom = nextZoom;
      const after = this.screenToWorld(anchorScreenX, anchorScreenY);
      this.targetX += before.x - after.x;
      this.targetY += before.y - after.y;
      this.x = this.targetX;
      this.y = this.targetY;
    } else {
      this.targetZoom = nextZoom;
    }
    this._clampTarget();
  }

  clearManualHold() {
    this.manualHold = 0;
  }

  shake(intensity = 8, duration = 0.32) {
    this.shakeIntensity = Math.max(this.shakeIntensity, intensity);
    this.shakeDuration = Math.max(this.shakeDuration, duration);
    this.shakeTime = this.shakeDuration;
  }

  _clampTarget() {
    const halfW = (this.viewW * 0.5) / this.targetZoom;
    const halfH = (this.viewH * 0.5) / this.targetZoom;
    const padX = 120;
    const padY = 90;
    if (halfW * 2 >= WORLD_W + padX * 2) {
      this.targetX = WORLD_W * 0.5;
    } else {
      this.targetX = clamp(this.targetX, halfW - padX, WORLD_W + padX - halfW);
    }
    if (halfH * 2 >= WORLD_H + padY * 2) {
      this.targetY = WORLD_H * 0.5;
    } else {
      this.targetY = clamp(this.targetY, halfH - padY, WORLD_H + padY - halfH);
    }
  }

  update(dt) {
    if (this.manualHold > 0) {
      this.manualHold = Math.max(0, this.manualHold - dt);
    }
    this._clampTarget();
    const lerp = Math.min(1, dt * 6.5);
    this.x += (this.targetX - this.x) * lerp;
    this.y += (this.targetY - this.y) * lerp;
    this.zoom += (this.targetZoom - this.zoom) * Math.min(1, dt * 10);

    if (this.shakeTime > 0) {
      this.shakeTime = Math.max(0, this.shakeTime - dt);
      const decay = this.shakeTime / Math.max(0.01, this.shakeDuration);
      const mag = this.shakeIntensity * decay;
      this.shakeX = (Math.random() * 2 - 1) * mag;
      this.shakeY = (Math.random() * 2 - 1) * mag;
      if (this.shakeTime <= 0) {
        this.shakeIntensity = 0;
        this.shakeX = 0;
        this.shakeY = 0;
      }
    }
  }

  worldToScreen(wx, wy) {
    return {
      x: (wx - this.x) * this.zoom + this.viewW * 0.5 + this.shakeX,
      y: (wy - this.y) * this.zoom + this.viewH * 0.5 + this.shakeY,
    };
  }

  screenToWorld(sx, sy) {
    return {
      x: (sx - this.viewW * 0.5 - this.shakeX) / this.zoom + this.x,
      y: (sy - this.viewH * 0.5 - this.shakeY) / this.zoom + this.y,
    };
  }
}
