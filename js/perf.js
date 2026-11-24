/* NEO-CARTRIDGE adaptive canvas quality controller.
 * URL override: ?quality=low | mid | high
 */
(function () {
  'use strict';
  if (window.NeoPerf) return;

  const params = new URLSearchParams(window.location.search);
  const requested = params.get('quality');
  const valid = ['low', 'mid', 'high'];
  const override = valid.includes(requested) ? requested : null;
  const coarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  const cores = Number(navigator.hardwareConcurrency) || 4;
  const memory = Number(navigator.deviceMemory) || 4;

  const factors = { low: 0.45, mid: 0.72, high: 1 };
  let quality = override || ((coarse && (cores <= 6 || memory <= 4)) ? 'mid' : 'high');
  let fps = 60;
  let lastFrame = 0;
  let frames = 0;
  let sampleStarted = 0;
  let rafId = 0;

  function applyQuality(next) {
    if (!valid.includes(next) || next === quality) return;
    quality = next;
    document.documentElement.dataset.renderQuality = next;
    window.dispatchEvent(new CustomEvent('neo:qualitychange', { detail: { quality: next, fps } }));
  }

  function sampleFrame(now) {
    if (document.hidden) {
      lastFrame = 0;
      sampleStarted = 0;
      frames = 0;
      rafId = requestAnimationFrame(sampleFrame);
      return;
    }
    if (lastFrame) {
      const delta = now - lastFrame;
      if (delta > 0 && delta < 250) frames++;
    }
    lastFrame = now;
    if (!sampleStarted) sampleStarted = now;
    if (now - sampleStarted >= 2200) {
      fps = Math.round(frames * 1000 / (now - sampleStarted));
      if (!override) {
        if (fps < 42) applyQuality('low');
        else if (fps < 53 && quality !== 'low') applyQuality('mid');
        else if (fps >= 57 && quality !== 'high') applyQuality('high');
      }
      sampleStarted = now;
      frames = 0;
    }
    rafId = requestAnimationFrame(sampleFrame);
  }

  const proto = window.CanvasRenderingContext2D && CanvasRenderingContext2D.prototype;
  const descriptor = proto && Object.getOwnPropertyDescriptor(proto, 'shadowBlur');
  if (descriptor && descriptor.configurable && descriptor.get && descriptor.set) {
    Object.defineProperty(proto, 'shadowBlur', {
      configurable: true,
      enumerable: descriptor.enumerable,
      get: function () {
        return descriptor.get.call(this);
      },
      set: function (value) {
        const numeric = Number(value);
        const factor = factors[quality] || 1;
        descriptor.set.call(this, Number.isFinite(numeric) && numeric > 0 ? numeric * factor : value);
      }
    });
  }

  document.documentElement.dataset.renderQuality = quality;
  window.NeoPerf = {
    get quality() { return quality; },
    get fps() { return fps; },
    get override() { return override; },
    setQuality: function (next) {
      if (!override) applyQuality(next);
    }
  };

  if (override) {
    document.documentElement.dataset.renderQuality = override;
  } else {
    rafId = requestAnimationFrame(sampleFrame);
  }

  window.addEventListener('pagehide', function () {
    if (rafId) cancelAnimationFrame(rafId);
  }, { once: true });
})();
