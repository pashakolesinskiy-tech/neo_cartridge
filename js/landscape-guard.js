/**
 * NEO-CARTRIDGE // Universal Mobile Landscape Orientation Guard
 * Requires phone/mobile users to hold their device horizontally (landscape)
 * when playing any game cartridge, while cleanly exempting portrait Crew Deck/phone controllers.
 */
(function () {
  if (window.__NEO_LANDSCAPE_GUARD__) return;
  window.__NEO_LANDSCAPE_GUARD__ = true;

  const isConsoleShell = !!document.getElementById('screen-housing') && !window.location.pathname.includes('/games/');
  const urlParams = new URLSearchParams(window.location.search);
  const isEmbeddedSubframe = (function () {
    if (urlParams.get('embed') === '1') return true;
    try {
      return window.self !== window.top;
    } catch {
      return true;
    }
  })();

  let bypassedUntilLandscape = false;
  let overlayEl = null;

  function isPortraitPhoneControllerRoute() {
    const path = window.location.pathname.toLowerCase();
    const hash = (window.location.hash || '').toLowerCase();
    return path.includes('cosmo_junk') && hash.startsWith('#/play/');
  }

  function injectStyles() {
    if (document.getElementById('neo-landscape-guard-styles')) return;
    const style = document.createElement('style');
    style.id = 'neo-landscape-guard-styles';
    style.textContent = `
      #neo-landscape-guard-overlay {
        position: fixed;
        inset: 0;
        z-index: 2147483600;
        background: radial-gradient(circle at 50% 38%, rgba(16, 26, 48, 0.97) 0%, rgba(5, 8, 16, 0.99) 85%);
        backdrop-filter: blur(18px);
        -webkit-backdrop-filter: blur(18px);
        color: #f8fafc;
        font-family: "Space Grotesk", "JetBrains Mono", "Trebuchet MS", system-ui, sans-serif;
        display: none;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 28px 22px;
        user-select: none;
        -webkit-user-select: none;
        touch-action: manipulation;
      }
      #neo-landscape-guard-overlay.active {
        display: flex !important;
      }
      .nlg-card {
        max-width: 340px;
        width: 100%;
        background: linear-gradient(165deg, rgba(19, 28, 46, 0.92) 0%, rgba(10, 14, 24, 0.96) 100%);
        border: 1.5px solid rgba(0, 229, 255, 0.45);
        border-radius: 20px;
        padding: 26px 20px 22px;
        box-shadow: 0 24px 60px rgba(0, 0, 0, 0.85), 0 0 36px rgba(0, 229, 255, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.16);
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .nlg-badge {
        font-family: "JetBrains Mono", monospace;
        font-size: 10px;
        font-weight: 800;
        letter-spacing: 0.14em;
        color: #00ff88;
        background: rgba(0, 255, 136, 0.12);
        border: 1px solid rgba(0, 255, 136, 0.4);
        padding: 4px 10px;
        border-radius: 999px;
        margin-bottom: 18px;
      }
      .nlg-icon-stage {
        position: relative;
        width: 108px;
        height: 108px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 16px;
      }
      .nlg-ring {
        position: absolute;
        inset: 4px;
        border-radius: 50%;
        border: 1.5px dashed rgba(0, 229, 255, 0.38);
        animation: nlgSpin 12s linear infinite;
      }
      .nlg-phone-svg {
        width: 68px;
        height: 68px;
        color: #00e5ff;
        filter: drop-shadow(0 0 14px rgba(0, 229, 255, 0.55));
        animation: nlgRotatePhone 2.3s cubic-bezier(0.35, 0, 0.2, 1) infinite;
      }
      @keyframes nlgRotatePhone {
        0%, 18% { transform: rotate(0deg) scale(0.96); color: #38bdf8; }
        52%, 78% { transform: rotate(-90deg) scale(1.05); color: #00ff88; }
        100% { transform: rotate(0deg) scale(0.96); color: #38bdf8; }
      }
      @keyframes nlgSpin {
        to { transform: rotate(360deg); }
      }
      .nlg-title {
        font-size: 17px;
        font-weight: 900;
        letter-spacing: 0.04em;
        line-height: 1.25;
        color: #ffffff;
        margin: 0 0 10px;
        text-transform: uppercase;
      }
      .nlg-sub {
        font-size: 12.5px;
        line-height: 1.5;
        color: #94a3b8;
        margin: 0 0 18px;
      }
      .nlg-actions {
        display: flex;
        flex-direction: column;
        gap: 9px;
        width: 100%;
      }
      .nlg-btn-primary {
        appearance: none;
        width: 100%;
        border: 1px solid rgba(0, 255, 136, 0.6);
        background: linear-gradient(135deg, #00ff88 0%, #00e5ff 100%);
        color: #020617;
        font-family: "JetBrains Mono", monospace;
        font-size: 12px;
        font-weight: 900;
        letter-spacing: 0.05em;
        padding: 12px 14px;
        border-radius: 11px;
        cursor: pointer;
        box-shadow: 0 8px 22px -4px rgba(0, 255, 136, 0.45);
      }
      .nlg-btn-secondary {
        appearance: none;
        width: 100%;
        border: 1px solid rgba(255, 255, 255, 0.16);
        background: rgba(15, 23, 42, 0.85);
        color: #cbd5e1;
        font-family: "JetBrains Mono", monospace;
        font-size: 11px;
        font-weight: 700;
        padding: 10px 14px;
        border-radius: 10px;
        cursor: pointer;
      }
    `;
    document.head.appendChild(style);
  }

  function ensureOverlay() {
    if (overlayEl) return overlayEl;
    injectStyles();
    overlayEl = document.createElement('div');
    overlayEl.id = 'neo-landscape-guard-overlay';
    overlayEl.setAttribute('role', 'dialog');
    overlayEl.setAttribute('aria-modal', 'true');
    overlayEl.setAttribute('aria-label', 'Поверните телефон горизонтально');
    overlayEl.innerHTML = `
      <div class="nlg-card">
        <div class="nlg-badge">NEO-CARTRIDGE // ГОРИЗОНТАЛЬНЫЙ РЕЖИМ</div>
        <div class="nlg-icon-stage" aria-hidden="true">
          <div class="nlg-ring"></div>
          <svg class="nlg-phone-svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <rect x="18" y="8" width="28" height="48" rx="5" fill="rgba(0, 229, 255, 0.1)" />
            <line x1="28" y1="13" x2="36" y2="13" stroke-width="2.2" />
            <circle cx="32" cy="50" r="2" fill="currentColor" stroke="none" />
            <path d="M51 24c3 3 4 9 1 14" stroke="#00ff88" stroke-width="2.4" />
            <polyline points="48 37 52 39 55 35" stroke="#00ff88" stroke-width="2.4" />
          </svg>
        </div>
        <h2 class="nlg-title">Поверните телефон горизонтально</h2>
        <p class="nlg-sub">Игровые картриджи разработаны для альбомной ориентации экрана. Переверните устройство для запуска игры.</p>
        <div class="nlg-actions">
          <button type="button" class="nlg-btn-primary" id="nlg-btn-lock">🔄 ПОВЕРНУТЬ ЭКРАН (АВТО)</button>
          ${
            isConsoleShell
              ? '<button type="button" class="nlg-btn-secondary" id="nlg-btn-exit">⏻ Вернуться к выбору картриджа</button>'
              : '<button type="button" class="nlg-btn-secondary" id="nlg-btn-bypass">Продолжить вертикально</button>'
          }
        </div>
      </div>
    `;
    document.body.appendChild(overlayEl);

    const lockBtn = overlayEl.querySelector('#nlg-btn-lock');
    if (lockBtn) {
      lockBtn.addEventListener('click', async () => {
        try {
          const targetEl = (isConsoleShell && document.getElementById('screen-housing')) || document.documentElement;
          const reqFs = targetEl.requestFullscreen || targetEl.webkitRequestFullscreen;
          if (reqFs && !document.fullscreenElement && !document.webkitFullscreenElement) {
            await Promise.resolve(reqFs.call(targetEl)).catch(() => {});
          }
          if (screen.orientation && screen.orientation.lock) {
            await screen.orientation.lock('landscape');
          }
        } catch {}
        evaluateOrientation();
      });
    }

    const exitBtn = overlayEl.querySelector('#nlg-btn-exit');
    if (exitBtn) {
      exitBtn.addEventListener('click', () => {
        if (window.App && typeof window.App.powerOffConsole === 'function') {
          window.App.powerOffConsole(true);
        }
        evaluateOrientation();
      });
    }

    const bypassBtn = overlayEl.querySelector('#nlg-btn-bypass');
    if (bypassBtn) {
      bypassBtn.addEventListener('click', () => {
        bypassedUntilLandscape = true;
        evaluateOrientation();
      });
    }

    return overlayEl;
  }

  function tryLockLandscape() {
    try {
      if (screen.orientation && typeof screen.orientation.lock === 'function') {
        screen.orientation.lock('landscape').catch(() => {});
      }
    } catch {}
  }

  function shouldRequireLandscape() {
    if (isEmbeddedSubframe || isPortraitPhoneControllerRoute()) return false;

    const vw = window.innerWidth || document.documentElement.clientWidth || 0;
    const vh = window.innerHeight || document.documentElement.clientHeight || 0;
    const isPortraitMobile = vh > vw && vw <= 900;

    if (!isPortraitMobile) {
      bypassedUntilLandscape = false;
      return false;
    }

    if (bypassedUntilLandscape) return false;

    if (isConsoleShell) {
      return !!(document.body && document.body.classList.contains('game-playing'));
    }

    return true;
  }

  function evaluateOrientation() {
    if (!document.body) return;
    const needed = shouldRequireLandscape();
    if (needed) {
      const el = ensureOverlay();
      el.classList.add('active');
    } else if (overlayEl) {
      overlayEl.classList.remove('active');
    }
  }

  function initGuard() {
    evaluateOrientation();
    window.addEventListener('resize', evaluateOrientation, { passive: true });
    window.addEventListener('hashchange', evaluateOrientation, { passive: true });
    window.addEventListener('orientationchange', () => {
      setTimeout(evaluateOrientation, 60);
      setTimeout(evaluateOrientation, 220);
    }, { passive: true });

    if (document.body) {
      const obs = new MutationObserver(() => evaluateOrientation());
      obs.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    }
  }

  window.NeoLandscapeGuard = {
    evaluate: evaluateOrientation,
    tryLockLandscape: tryLockLandscape
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGuard);
  } else {
    initGuard();
  }
})();
