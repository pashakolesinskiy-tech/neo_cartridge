/**
 * NEO-CARTRIDGE // PWA Controller
 * Регистрация Service Worker, установка на домашний экран (Android/Desktop + iOS Safari),
 * офлайн-кэширование всех 6 игр и уведомление об обновлениях.
 */

const PWA = {
  CACHE_NAME: 'neo-cartridge-pwa-v3',
  DISMISS_KEY: 'neo_pwa_banner_dismissed',
  OFFLINE_READY_KEY: 'neo_pwa_offline_ready',
  deferredPrompt: null,
  registration: null,
  waitingWorker: null,
  isStandalone: false,
  isIOS: false,
  isCaching: false,
  userRequestedReload: false,

  init() {
    this.isStandalone =
      (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
      window.navigator.standalone === true;

    this.isIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.updateInstallUI();
      this.maybeShowMobileBanner();
    });

    window.addEventListener('appinstalled', () => {
      this.deferredPrompt = null;
      this.isStandalone = true;
      this.hideInstallBanner();
      this.updateInstallUI();
      if (window.Sound && Sound.playPowerup) Sound.playPowerup();
    });

    window.addEventListener('online', () => this.updateOnlineStatus());
    window.addEventListener('offline', () => this.updateOnlineStatus());

    if (window.matchMedia) {
      try {
        window
          .matchMedia('(display-mode: standalone)')
          .addEventListener('change', (e) => {
            this.isStandalone = e.matches || window.navigator.standalone === true;
            this.updateInstallUI();
          });
      } catch {}
    }

    this.registerServiceWorker();
    this.updateInstallUI();
    this.updateOfflineUI();
    this.updateOnlineStatus();

    // На iOS Safari событие beforeinstallprompt отсутствует — показываем кнопку и мягкий баннер установки
    if (this.isIOS && !this.isStandalone) {
      setTimeout(() => this.maybeShowMobileBanner(), 2500);
    }
  },

  registerServiceWorker() {
    if (!('serviceWorker' in navigator)) return;
    if (location.protocol !== 'http:' && location.protocol !== 'https:') return;

    const hadController = !!navigator.serviceWorker.controller;

    navigator.serviceWorker.addEventListener('message', (event) => {
      const msg = event.data;
      if (!msg || typeof msg !== 'object') return;
      if (msg.type === 'PWA_CACHE_PROGRESS') {
        this.onCacheProgress(msg.done, msg.total);
      } else if (msg.type === 'PWA_CACHE_DONE') {
        this.onCacheDone(msg.done, msg.total, msg.failed);
      }
    });

    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (this.userRequestedReload) {
        window.location.reload();
      }
    });

    navigator.serviceWorker
      .register('./sw.js', { scope: './' })
      .then((reg) => {
        this.registration = reg;
        if (reg.waiting && hadController) {
          this.waitingWorker = reg.waiting;
          this.showUpdateToast();
        }
        reg.addEventListener('updatefound', () => {
          const nw = reg.installing;
          if (!nw) return;
          nw.addEventListener('statechange', () => {
            if (nw.state === 'installed' && hadController && navigator.serviceWorker.controller) {
              this.waitingWorker = nw;
              this.showUpdateToast();
            }
          });
        });
      })
      .catch(() => {
        // Игнорируем в средах без поддержки SW
      });
  },

  canShowInstallAction() {
    if (this.isStandalone) return false;
    return !!this.deferredPrompt || this.isIOS;
  },

  updateInstallUI() {
    const topBtn = document.getElementById('btn-pwa-install');
    const settingBtn = document.getElementById('btn-setting-pwa-install');
    const settingDesc = document.getElementById('pwa-install-desc');

    if (this.isStandalone) {
      if (topBtn) topBtn.style.display = 'none';
      if (settingBtn) {
        settingBtn.disabled = true;
        settingBtn.classList.add('active');
        settingBtn.innerHTML = '<span>✓ УСТАНОВЛЕНО</span>';
      }
      if (settingDesc) {
        settingDesc.textContent = 'Запущено в режиме отдельного приложения (Standalone PWA)';
      }
      return;
    }

    if (topBtn) {
      topBtn.style.display = this.canShowInstallAction() ? 'inline-flex' : 'none';
    }

    if (settingBtn) {
      settingBtn.classList.remove('active');
      if (this.deferredPrompt) {
        settingBtn.disabled = false;
        settingBtn.innerHTML = '<span>📲 УСТАНОВИТЬ</span>';
        if (settingDesc) {
          settingDesc.textContent = 'Добавить иконку на рабочий стол / главный экран телефона';
        }
      } else if (this.isIOS) {
        settingBtn.disabled = false;
        settingBtn.innerHTML = '<span>📲 НА ЭКРАН «ДОМОЙ»</span>';
        if (settingDesc) {
          settingDesc.textContent = 'Откройте инструкцию установки через Safari «Поделиться»';
        }
      } else {
        settingBtn.disabled = false;
        settingBtn.innerHTML = '<span>📲 КАК УСТАНОВИТЬ</span>';
        if (settingDesc) {
          settingDesc.textContent = 'Установите через меню браузера «Установить приложение»';
        }
      }
    }
  },

  maybeShowMobileBanner() {
    if (this.isStandalone || window.innerWidth > 899) return;
    if (!this.canShowInstallAction()) return;

    try {
      const raw = localStorage.getItem(this.DISMISS_KEY);
      if (raw) {
        const ts = parseInt(raw, 10);
        if (!Number.isNaN(ts) && Date.now() - ts < 7 * 86400000) {
          return;
        }
      }
    } catch {}

    setTimeout(() => {
      if (this.isStandalone || document.body.classList.contains('game-playing')) return;
      const banner = document.getElementById('pwa-install-banner');
      if (banner) banner.classList.add('open');
    }, 2500);
  },

  dismissInstallBanner() {
    this.hideInstallBanner();
    try {
      localStorage.setItem(this.DISMISS_KEY, String(Date.now()));
    } catch {}
    if (window.Sound && Sound.playClick) Sound.playClick();
  },

  hideInstallBanner() {
    const banner = document.getElementById('pwa-install-banner');
    if (banner) banner.classList.remove('open');
  },

  async promptInstall() {
    if (window.Sound && Sound.playClick) Sound.playClick();
    this.hideInstallBanner();

    if (this.deferredPrompt) {
      const promptEv = this.deferredPrompt;
      this.deferredPrompt = null;
      try {
        await promptEv.prompt();
        await promptEv.userChoice;
      } catch {}
      this.updateInstallUI();
      return;
    }

    if (this.isIOS && window.App) {
      App.openModal('pwa-ios-modal');
      return;
    }

    if (window.App) {
      App.openModal('pwa-ios-modal');
    }
  },

  updateOfflineUI() {
    const btn = document.getElementById('btn-setting-offline-cache');
    const desc = document.getElementById('pwa-offline-desc');
    let isReady = false;
    try {
      isReady = localStorage.getItem(this.OFFLINE_READY_KEY) === '1';
    } catch {}

    if (btn && !this.isCaching) {
      if (isReady) {
        btn.classList.add('active');
        btn.innerHTML = '<span>✓ ВСЕ 6 ИГР ОФЛАЙН</span>';
      } else {
        btn.classList.remove('active');
        btn.innerHTML = '<span>📥 СКАЧАТЬ ВСЕ 6 ИГР</span>';
      }
    }
    if (desc && !this.isCaching) {
      desc.textContent = isReady
        ? 'Все картриджи и текстуры сохранены для игры без интернета'
        : 'Сохранить все 6 игр и спрайты Worms на устройство (~10 МБ)';
    }
  },

  onCacheProgress(done, total) {
    const btn = document.getElementById('btn-setting-offline-cache');
    if (btn) {
      btn.innerHTML = `<span>📥 КЭШ: ${done}/${total}...</span>`;
    }
  },

  onCacheDone(done, total, failed) {
    this.isCaching = false;
    const btn = document.getElementById('btn-setting-offline-cache');
    const desc = document.getElementById('pwa-offline-desc');

    if (failed === 0) {
      try {
        localStorage.setItem(this.OFFLINE_READY_KEY, '1');
      } catch {}
      if (btn) {
        btn.disabled = false;
        btn.classList.add('active');
        btn.innerHTML = '<span>✓ ВСЕ 6 ИГР ОФЛАЙН</span>';
      }
      if (desc) {
        desc.textContent = `Сохранено файлов: ${done}/${total}. Готово к работе без интернета.`;
      }
      if (window.Sound && Sound.playPowerup) Sound.playPowerup();
    } else {
      if (btn) {
        btn.disabled = false;
        btn.classList.remove('active');
        btn.innerHTML = '<span>↻ ПОВТОРИТЬ</span>';
      }
      if (desc) {
        desc.textContent = `Кэшировано ${done - failed} из ${total} (проверьте сеть)`;
      }
    }
  },

  async cacheAllGames() {
    if (this.isCaching) return;
    if (window.Sound && Sound.playClick) Sound.playClick();

    this.isCaching = true;
    const btn = document.getElementById('btn-setting-offline-cache');
    const desc = document.getElementById('pwa-offline-desc');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<span>📥 ЗАГРУЗКА...</span>';
    }
    if (desc) {
      desc.textContent = 'Загружаем ROM-картриджи и спрайты в кэш устройства...';
    }

    if (navigator.serviceWorker && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'CACHE_ALL_GAMES' });
      return;
    }

    // Fallback: прямое кэширование через Cache Storage API, если SW ещё активируется
    if (!('caches' in window)) {
      this.onCacheDone(0, 1, 1);
      return;
    }

    const fallbackAssets = [
      './',
      './index.html',
      './manifest.webmanifest',
      './css/console.css',
      './css/components.css',
      './js/app.js',
      './js/audio.js',
      './js/editor.js',
      './js/p2p.js',
      './js/previews.js',
      './js/storage.js',
      './js/pwa.js',
      './games/stick_fighting.html',
      './games/pixel_drift.html',
      './games/chrono_blade.html',
      './games/mecha_siege.html',
      './games/worms_armageddon.html',
      './games/cosmo_junk.html',
      './games/worms-armageddon/assets/worms-sheet.png',
      './games/worms-armageddon/assets/items-sheet.png',
      './games/worms-armageddon/assets/plane.png',
      './games/cosmo-junk-game-concept/standalone/assets/app.js',
      './games/cosmo-junk-game-concept/standalone/assets/app.css',
      './games/cosmo-junk-game-concept/standalone/assets/icon.svg',
    ];

    try {
      const cache = await caches.open(this.CACHE_NAME);
      let done = 0;
      let failed = 0;
      for (const asset of fallbackAssets) {
        try {
          const res = await fetch(asset, { cache: 'reload' });
          if (res && res.ok) {
            await cache.put(asset, res);
          } else {
            failed++;
          }
        } catch {
          failed++;
        }
        done++;
        this.onCacheProgress(done, fallbackAssets.length);
      }
      this.onCacheDone(done, fallbackAssets.length, failed);
    } catch {
      this.onCacheDone(0, fallbackAssets.length, fallbackAssets.length);
    }
  },

  updateOnlineStatus() {
    const pill = document.getElementById('pwa-online-pill');
    if (!pill) return;
    const dot = pill.querySelector('.dot');
    const label = pill.querySelector('span:last-child');
    if (navigator.onLine) {
      if (dot) {
        dot.style.background = 'var(--crt-phosphor)';
        dot.style.boxShadow = '0 0 6px var(--crt-phosphor)';
      }
      if (label) label.textContent = 'ZERO-SERVER: 100% CLIENT';
    } else {
      if (dot) {
        dot.style.background = 'var(--crt-cyan)';
        dot.style.boxShadow = '0 0 6px var(--crt-cyan)';
      }
      if (label) label.textContent = 'OFFLINE MODE: READY';
    }
  },

  showUpdateToast() {
    const toast = document.getElementById('pwa-update-toast');
    if (toast) toast.classList.add('open');
  },

  applyUpdate() {
    this.userRequestedReload = true;
    const toast = document.getElementById('pwa-update-toast');
    if (toast) toast.classList.remove('open');
    const target = this.waitingWorker || (this.registration && this.registration.waiting);
    if (target && target.state !== 'activated') {
      target.postMessage({ type: 'SKIP_WAITING' });
      setTimeout(() => window.location.reload(), 600);
    } else {
      window.location.reload();
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  PWA.init();
});
