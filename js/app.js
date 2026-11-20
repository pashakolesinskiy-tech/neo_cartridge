/**
 * NEO-CARTRIDGE // Главный контроллер ретро-консоли (App Orchestrator)
 * Slay-the-Spire Vertical Card Slider, Physical Slot Insertion/Ejection, CRT Shader & P2P
 */

const App = {
  currentCartridge: 'stick_fighting',
  deckIndex: 0,
  get carouselIndex() { return this.deckIndex; },
  set carouselIndex(v) { this.deckIndex = v; },
  carouselAngle: 0,
  cartridgeOrder: ['stick_fighting', 'pixel_drift', 'chrono_blade', 'mecha_siege', 'worms_armageddon', 'cosmo_junk'],
  isPoweredOn: false,
  isBooting: false,
  isPaused: false,

  // Slider State
  isDraggingDeck: false,
  didDragDeck: false,
  isDraggingThumb: false,
  dragStartY: 0,
  dragDeltaY: 0,
  dragStartTime: 0,
  touchStartX: 0,
  touchStartY: 0,

  cartridges: {
    stick_fighting: {
      id: "stick_fighting",
      name: "STICK_FIGHTING",
      genre: "2D Pixel Fighter (Phaser 3)",
      type: "iframe",
      src: "games/stick_fighting.html",
      preloaded: false,
      sizeKb: 0,
      desc: "Полноразмерный 2D файтинг: 3 бойца (Вихрь, Искра, Титан), 3 живые арены, комбо-система и WebRTC мультиплеер без сервера. Играйте против ИИ или с другом по сети!",
      controls: "Стрелки — Ходьба/Прыжок, J/K — Руки, U/I — Ноги, O — Спецприем, Space — Блок"
    },
    pixel_drift: {
      id: "pixel_drift",
      name: "PIXEL DRIFT: TURBO GP",
      genre: "Retro Arcade Drift GP",
      type: "iframe",
      src: "games/pixel_drift.html",
      preloaded: false,
      sizeKb: 0,
      desc: "Аркадные кольцевые гонки с физикой скольжения, дымом из-под колес, Web Audio синтезом звука мотора, прокачкой болидов и P2P/Room мультиплеером без сервера.",
      controls: "WASD / Стрелки — Газ/Тормоз/Руль, ПРОБЕЛ — Ручник (Drift), R — Сброс трассы"
    },
    chrono_blade: {
      id: "chrono_blade",
      name: "CHRONO BLADE: ZERO",
      genre: "Cyber-Stickman Slasher",
      type: "iframe",
      src: "games/chrono_blade.html",
      preloaded: false,
      sizeKb: 0,
      desc: "Высокоскоростной кибер-стикман слэшер в духе Xiao Xiao: отражение пуль катаной, рывки сквозь врагов, замедление времени (Bullet-Time), прокачка кибер-чипов и мультиплеер (Hot-Seat / WebRTC P2P).",
      controls: "WASD / Стрелки — Бег, J / Z / Пробел — Удар (Авто-прицел!), K / X — Рывок, L / C / Q — Замедление | Сенсорный джойстик на мобилках"
    },
    mecha_siege: {
      id: "mecha_siege",
      name: "MECHA SIEGE: ZERO",
      genre: "16-Bit Mech Tower Defense",
      type: "iframe",
      src: "games/mecha_siege.html",
      preloaded: false,
      sizeKb: 0,
      desc: "Тактический дизельпанк Tower Defense в 16-битном стиле: 5 типов мехо-турелей с апгрейдами, волны шагоходов и танков, орбитальное супер-оружие и Кооператив 2P (Hot-Seat / WebRTC P2P) без сервера.",
      controls: "WASD / Стрелки — Выбор слота, 1-5 / J-I — Быстрая стройка, Пробел — Апгрейд, Q/E/R — Супер-оружие | Сенсорный трей на смартфонах"
    },
    worms_armageddon: {
      id: "worms_armageddon",
      name: "WORMS ARMAGEDDON",
      genre: "2D Destructible Artillery (34 Weapons)",
      type: "iframe",
      src: "games/worms_armageddon.html",
      preloaded: false,
      sizeKb: 0,
      desc: "Полноценная пошаговая артиллерия в духе Worms Armageddon! Разрушаемый рельеф (4 биома), 34 вида оружия со спрайтами (Базука, Миномёт, Святая Граната, Овца, Супер-овца, Бешеные коровы, Напалм, Метеорит, Верёвка ниндзя, Дрель, Яд, Лёд и др.), баллистический ИИ, Hot-Seat до 4 команд и онлайн-комнаты по коду или QR.",
      controls: "←/→ Ходьба, ↑/↓ Прицел, Q Прыжок, E Кувырок, Space/Клик Заряд и огонь, Tab/ПКМ Арсенал | На телефоне: тач-пульт и мультитач"
    },
    cosmo_junk: {
      id: "cosmo_junk",
      name: "COSMO JUNK",
      genre: "Co-op Space Arena (Zero-Server + Crew Deck)",
      type: "iframe",
      src: "games/cosmo_junk.html",
      preloaded: false,
      sizeKb: 0,
      desc: "Кооперативная космическая арена: комнаты по коду, 4 роли экипажа (Пилот, Инженер, Стрелок, Штурман) с автозаменой ИИ-ботами, встроенный пульт управления прямо на экране и Зал Славы. Работает полностью автономно в браузере без внешнего сервера.",
      controls: "Создать корабль | Кнопка «🎮 ПУЛЬТ ЭКИПАЖА» сверху открывает встроенный пульт роли (P1–P4) | «↗ 2-Й ЭКРАН» — пульт в соседней вкладке"
    }
  },

  init() {
    Storage.init();
    Sound.init();

    Editor.init();
    P2P.init();

    this.setupDeckEvents();
    this.setupKeyboardShortcuts();
    this.setupCartridgeSlot();

    const backdrop = document.getElementById('console-backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', () => {
        document.querySelectorAll('.console-modal.open').forEach((m) => this.closeModal(m.id));
      });
    }

    const hintSpan = document.querySelector('.deck-hint-bar span');
    if (hintSpan && (window.innerWidth <= 899 || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0))) {
      hintSpan.textContent = 'Свайп вверх/вниз или кнопки ниже • Тап по карте — запуск';
    }

    const gameParam = new URLSearchParams(window.location.search).get('game');
    if (gameParam && this.cartridgeOrder.includes(gameParam)) {
      this.deckIndex = this.cartridgeOrder.indexOf(gameParam);
      this.currentCartridge = gameParam;
    }

    window.addEventListener('resize', () => {
      if (!this.isPoweredOn && !this.isBooting) {
        this.updateDeckDisplay();
      }
    });

    // Фоновая предзагрузка всех ROM-картриджей в память
    this.initPreloader();

    // Начальный запуск в режиме меню (консоль выключена, слайдер активен)
    this.updateDeckDisplay();
    this.updateDashboardInfo();
    this.updateSettingsUI();
    this.renderAchievementsModal();
  },

  setupDeckEvents() {
    const stage = document.getElementById('deck-stage') || document.getElementById('vertical-card-stack');
    const channel = document.getElementById('deck-slider-channel');
    const thumb = document.getElementById('deck-slider-thumb');
    if (!stage) return;

    // --- 1. DRAGGING THE CARDS VIEWPORT (Live 1:1 Motion with Touch & Mouse) ---
    const onDragStart = (clientY) => {
      if (this.isPoweredOn || this.isBooting) return;
      this.isDraggingDeck = true;
      this.didDragDeck = false;
      this.dragStartY = clientY;
      this.dragDeltaY = 0;
      this.dragStartTime = Date.now();
      stage.classList.add('is-dragging');
      document.body.classList.add('is-deck-dragging');
    };

    const onDragMove = (clientY) => {
      if (!this.isDraggingDeck) return;
      this.dragDeltaY = clientY - this.dragStartY;
      if (Math.abs(this.dragDeltaY) > 10) {
        this.didDragDeck = true;
      }
      this.updateDeckDisplay(true);
    };

    const onDragEnd = () => {
      if (!this.isDraggingDeck) return;
      this.isDraggingDeck = false;
      stage.classList.remove('is-dragging');
      document.body.classList.remove('is-deck-dragging');

      const dt = Math.max(1, Date.now() - this.dragStartTime);
      const velocity = this.dragDeltaY / dt; // px per ms

      let targetIndex = this.deckIndex;
      if (this.dragDeltaY < -35 || velocity < -0.32) {
        // Dragged up -> advance down to next card
        targetIndex = Math.min(this.cartridgeOrder.length - 1, this.deckIndex + 1);
      } else if (this.dragDeltaY > 35 || velocity > 0.32) {
        // Dragged down -> advance up to prev card
        targetIndex = Math.max(0, this.deckIndex - 1);
      }

      this.dragDeltaY = 0;
      this.setDeckIndex(targetIndex);
    };

    // Touch events for card dragging
    stage.addEventListener('touchstart', (e) => {
      if (e.target.closest('#deck-slider-rail')) return;
      onDragStart(e.touches[0].clientY);
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (this.isDraggingDeck) {
        if (e.cancelable) e.preventDefault();
        onDragMove(e.touches[0].clientY);
      }
    }, { passive: false });

    window.addEventListener('touchend', () => {
      if (this.isDraggingDeck) onDragEnd();
    });

    // Mouse events for card dragging
    stage.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return;
      if (e.target.closest('#deck-slider-rail')) return;
      onDragStart(e.clientY);
    });

    window.addEventListener('mousemove', (e) => {
      if (this.isDraggingDeck) {
        onDragMove(e.clientY);
      }
    });

    window.addEventListener('mouseup', () => {
      if (this.isDraggingDeck) onDragEnd();
    });

    // --- 2. SLIDER CHANNEL / THUMB DRAGGING & CLICKING ---
    if (channel) {
      const handleChannelClick = (e) => {
        if (this.isPoweredOn || this.isBooting) return;
        const rect = channel.getBoundingClientRect();
        const relY = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
        const targetIdx = Math.round(relY * (this.cartridgeOrder.length - 1));
        this.setDeckIndex(targetIdx);
      };

      channel.addEventListener('click', (e) => {
        if (e.target.closest('#deck-slider-thumb')) return;
        handleChannelClick(e);
      });
    }

    if (thumb) {
      thumb.addEventListener('mousedown', (e) => {
        if (this.isPoweredOn || this.isBooting) return;
        e.stopPropagation();
        this.isDraggingThumb = true;
        document.body.classList.add('is-thumb-dragging');
      });

      thumb.addEventListener('touchstart', (e) => {
        if (this.isPoweredOn || this.isBooting) return;
        e.stopPropagation();
        this.isDraggingThumb = true;
        document.body.classList.add('is-thumb-dragging');
      }, { passive: true });

      const onThumbMove = (clientY) => {
        if (!this.isDraggingThumb || !channel) return;
        const rect = channel.getBoundingClientRect();
        const relY = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
        const currentProg = relY * (this.cartridgeOrder.length - 1);

        const newIdx = Math.round(currentProg);
        if (newIdx !== this.deckIndex) {
          this.deckIndex = newIdx;
          this.currentCartridge = this.cartridgeOrder[this.deckIndex];
          Sound.playCarouselTick();
          this.updateDashboardInfo();
        }
        this.updateDeckDisplay(false);
      };

      window.addEventListener('mousemove', (e) => {
        if (this.isDraggingThumb) onThumbMove(e.clientY);
      });

      window.addEventListener('touchmove', (e) => {
        if (this.isDraggingThumb) {
          if (e.cancelable) e.preventDefault();
          onThumbMove(e.touches[0].clientY);
        }
      }, { passive: false });

      const onThumbEnd = () => {
        if (this.isDraggingThumb) {
          this.isDraggingThumb = false;
          document.body.classList.remove('is-thumb-dragging');
          this.updateDeckDisplay();
        }
      };

      window.addEventListener('mouseup', onThumbEnd);
      window.addEventListener('touchend', onThumbEnd);
    }

    // --- 3. MOUSE WHEEL SCROLLING ---
    let wheelDebounce = 0;
    stage.addEventListener('wheel', (e) => {
      if (this.isPoweredOn || this.isBooting) return;
      const now = Date.now();
      if (now - wheelDebounce < 200) return;
      wheelDebounce = now;
      if (e.deltaY > 0) this.rotateDeck(1);
      else if (e.deltaY < 0) this.rotateDeck(-1);
    }, { passive: true });
  },

  setupCarouselEvents() {
    this.setupDeckEvents();
  },

  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Закрытие модалок по Escape
      const activeModal = document.querySelector('.console-modal.open');
      if (e.key === 'Escape') {
        if (activeModal) {
          this.closeModal(activeModal.id);
          return;
        }
        // Если игра запущена — выключить/извлечь картридж
        if (this.isPoweredOn && !this.isBooting) {
          this.powerOffConsole();
          return;
        }
      }

      // Навигация по вертикальному слайдеру карт (только когда консоль в режиме меню)
      if (!this.isPoweredOn && !this.isBooting && !activeModal) {
        if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
          e.preventDefault();
          this.rotateDeck(-1);
        } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S' || e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
          e.preventDefault();
          this.rotateDeck(1);
        } else if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.powerOnCartridge();
        } else if (e.key === '1') {
          this.setDeckIndex(0);
        } else if (e.key === '2') {
          this.setDeckIndex(1);
        } else if (e.key === '3') {
          this.setDeckIndex(2);
        } else if (e.key === '4') {
          this.setDeckIndex(3);
        } else if (e.key === '5') {
          this.setDeckIndex(4);
        } else if (e.key === '6') {
          this.setDeckIndex(5);
        }
      }
    });
  },

  rotateDeck(direction) {
    if (this.isPoweredOn || this.isBooting) return;
    const total = this.cartridgeOrder.length;
    this.deckIndex = (this.deckIndex + direction + total) % total;
    this.currentCartridge = this.cartridgeOrder[this.deckIndex];
    Sound.playCarouselTick();
    this.updateDeckDisplay();
    this.updateDashboardInfo();
  },

  slideDeck(direction) {
    this.rotateDeck(direction);
  },

  rotateCarousel(direction) {
    this.rotateDeck(direction);
  },

  setDeckIndex(index) {
    if (this.isPoweredOn || this.isBooting) return;
    const total = this.cartridgeOrder.length;
    const targetIdx = Math.max(0, Math.min(total - 1, index));
    if (targetIdx === this.deckIndex) {
      this.updateDeckDisplay();
      return;
    }
    this.deckIndex = targetIdx;
    this.currentCartridge = this.cartridgeOrder[this.deckIndex];
    Sound.playCarouselTick();
    this.updateDeckDisplay();
    this.updateDashboardInfo();
    this.warmupActiveIframe();
  },

  setCarouselIndex(index) {
    this.setDeckIndex(index);
  },

  onCardClick(index) {
    if (this.isPoweredOn || this.isBooting) return;
    if (this.didDragDeck) {
      this.didDragDeck = false;
      return;
    }
    if (index === this.deckIndex) {
      // Клик по уже активной (центрированной) карте — вставляет в слот и включает консоль!
      this.powerOnCartridge();
    } else {
      // Клик по другой карте — плавно сдвигает слайдер к ней!
      this.setDeckIndex(index);
    }
  },

  updateDeckDisplay(isLiveDrag = false) {
    const cards = document.querySelectorAll('.sts-card');
    const totalCards = this.cartridgeOrder.length;
    const vw = window.innerWidth;
    const spacing = vw <= 480 ? 112 : (vw <= 768 ? 124 : 145);
    const baseScale = vw <= 420 ? 0.98 : (vw <= 600 ? 1.0 : 1.05);

    // Текущий непрерывный прогресс слайдера
    let currentProgress = this.deckIndex;
    if (isLiveDrag && this.isDraggingDeck) {
      currentProgress = this.deckIndex - (this.dragDeltaY / spacing);
      // Мягкое сопротивление на краях диапазона (rubber-band)
      if (currentProgress < 0) {
        currentProgress = currentProgress * 0.28;
      } else if (currentProgress > totalCards - 1) {
        currentProgress = (totalCards - 1) + (currentProgress - (totalCards - 1)) * 0.28;
      }
    }

    cards.forEach((card) => {
      const idx = parseInt(card.dataset.index, 10);
      const offset = idx - currentProgress;
      const absOffset = Math.abs(offset);

      // Физика вертикального 3D слайдера
      const posY = offset * spacing;
      const scale = Math.max(0.68, baseScale - absOffset * 0.16);
      const rotX = -offset * 6.5;
      const rotZ = offset * 2.2;
      const opacity = Math.max(0.12, 1.0 - absOffset * 0.44);
      const zIndex = Math.round(50 - absOffset * 10);
      const isCenter = absOffset < 0.35;
      const posX = vw <= 600 ? 0 : (isCenter ? 26 : 0);

      if (isLiveDrag) {
        card.style.transition = 'none';
      } else {
        card.style.transition = 'transform 0.36s cubic-bezier(0.18, 0.9, 0.25, 1.15), opacity 0.3s ease, filter 0.3s ease';
      }

      card.style.transform = `translate3d(${posX}px, ${posY}px, 0) scale(${scale}) rotateX(${rotX}deg) rotateZ(${rotZ}deg)`;
      card.style.opacity = opacity;
      card.style.zIndex = zIndex;
      card.classList.toggle('active', isCenter);
    });

    // Позиция бегунка слайдера на рельсе справа
    const thumb = document.getElementById('deck-slider-thumb');
    const channel = document.getElementById('deck-slider-channel');
    if (thumb && channel) {
      const clampedProg = Math.max(0, Math.min(totalCards - 1, currentProgress));
      const percent = (clampedProg / (totalCards - 1)) * 100;
      if (isLiveDrag) {
        thumb.style.transition = 'none';
      } else {
        thumb.style.transition = 'top 0.35s cubic-bezier(0.18, 0.9, 0.25, 1.15)';
      }
      thumb.style.top = `${percent}%`;
    }

    // Пагинация точками / засечками на рельсе
    const roundedIndex = Math.max(0, Math.min(totalCards - 1, Math.round(currentProgress)));
    document.querySelectorAll('#deck-dots .dot, #carousel-dots .dot').forEach((dot) => {
      const dIdx = parseInt(dot.dataset.index, 10);
      dot.classList.toggle('active', dIdx === roundedIndex);
    });

    // Синхронизация мобильной ленты быстрого выбора
    const strip = document.getElementById('mobile-rom-strip');
    document.querySelectorAll('.mobile-rom-chip').forEach((chip) => {
      const cIdx = parseInt(chip.dataset.index, 10);
      const isAct = cIdx === roundedIndex;
      chip.classList.toggle('active', isAct);
      if (isAct && !isLiveDrag && strip) {
        const targetLeft = chip.offsetLeft - (strip.clientWidth - chip.offsetWidth) / 2;
        try {
          strip.scrollTo({ left: Math.max(0, targetLeft), behavior: 'smooth' });
        } catch {
          strip.scrollLeft = Math.max(0, targetLeft);
        }
      }
    });

    // Подсветка картриджей на нижней полке и в док-панели
    document.querySelectorAll('.cartridge-item, .dock-card').forEach(item => {
      item.classList.toggle('active', item.dataset.game === this.cartridgeOrder[roundedIndex]);
    });
  },

  updateCarouselDisplay() {
    this.updateDeckDisplay();
  },

  updateDashboardInfo() {
    const cart = this.cartridges[this.currentCartridge];
    if (!cart) return;

    document.body.setAttribute('data-active-game', this.currentCartridge);

    const titleEl = document.getElementById('slot-game-title');
    const genreEl = document.getElementById('slot-game-genre');
    const descEl = document.getElementById('slot-game-desc');
    const controlsEl = document.getElementById('slot-game-controls');
    const recordEl = document.getElementById('slot-game-record');
    const romPillEl = document.getElementById('hero-rom-pill');

    if (titleEl) titleEl.textContent = cart.name;
    if (genreEl) genreEl.textContent = cart.genre;
    if (descEl) descEl.textContent = cart.desc;
    if (controlsEl) controlsEl.textContent = cart.controls;
    if (recordEl) recordEl.textContent = Storage.getHighscore(this.currentCartridge);
    if (romPillEl) romPillEl.textContent = `ROM #0${this.deckIndex + 1}`;
  },

  // =========================================================================
  // ROM PRELOADER ENGINE (Фоновая предзагрузка и кэширование игр)
  // =========================================================================
  initPreloader() {
    this.cartridgeOrder.forEach((gameId, idx) => {
      const cart = this.cartridges[gameId];
      if (!cart || !cart.src) return;

      const badge = document.getElementById(`preload-badge-${idx}`);
      if (badge) {
        badge.classList.remove('ready');
        badge.classList.add('loading');
        const textSpan = badge.querySelector('.preload-text');
        if (textSpan) textSpan.textContent = 'LOADING...';
      }

      // Асинхронный fetch с force-cache для прогрева дискового/оперативного кэша браузера
      fetch(cart.src, { cache: 'force-cache' })
        .then(res => {
          if (!res.ok) throw new Error('Fetch status ' + res.status);
          return res.text();
        })
        .then(content => {
          cart.preloaded = true;
          cart.sizeKb = Math.round(content.length / 1024);
          this.updateCartridgePreloadUI(gameId, idx);
        })
        .catch(() => {
          // Fallback если локальный file:// протокол блокирует fetch (CORS)
          cart.preloaded = true;
          this.updateCartridgePreloadUI(gameId, idx);
        });
    });

    // Предварительный прогрев скрытого iframe для текущего активного картриджа
    this.warmupActiveIframe();
  },

  updateCartridgePreloadUI(gameId, idx) {
    const badge = document.getElementById(`preload-badge-${idx}`);
    if (badge) {
      badge.classList.remove('loading');
      badge.classList.add('ready');
      const textSpan = badge.querySelector('.preload-text');
      if (textSpan) textSpan.textContent = 'PRELOADED';
    }

    const biosPreloadStatus = document.getElementById('bios-preload-status');
    if (biosPreloadStatus) {
      biosPreloadStatus.textContent = 'ROM CACHE: 100% PRE-LOADED [INSTANT BOOT]';
    }
  },

  warmupActiveIframe() {
    const iframeEl = document.getElementById('game-iframe');
    const cart = this.cartridges[this.currentCartridge];
    if (iframeEl && cart && !this.isPoweredOn && !this.isBooting) {
      if (!iframeEl.src || !iframeEl.src.endsWith(cart.src)) {
        iframeEl.src = cart.src;
      }
    }
  },

  // =========================================================================
  // НАСТОЯЩИЙ ЗАПУСК ПРИСТАВКИ: ВСТАВКА КАРТРИДЖА, ВКЛЮЧЕНИЕ ПИТАНИЯ, CRT И BIOS
  // =========================================================================
  powerOnCartridge(gameId) {
    if (this.isBooting || this.isPoweredOn) return;

    if (gameId && this.cartridgeOrder.includes(gameId)) {
      this.deckIndex = this.cartridgeOrder.indexOf(gameId);
      this.currentCartridge = gameId;
      this.updateDeckDisplay();
      this.updateDashboardInfo();
    }

    const cart = this.cartridges[this.currentCartridge];
    if (!cart) return;

    this.isBooting = true;
    document.body.classList.add('game-playing');
    if (window.PWA) PWA.hideInstallBanner();
    if (window.NeoLandscapeGuard) {
      NeoLandscapeGuard.tryLockLandscape();
      NeoLandscapeGuard.evaluate();
    }

    // 1. Звук механической вставки картриджа в слот (двухфазный щелчок)
    Sound.playCartridgeInsert();

    // 2. Визуальная анимация посадки картриджа в слот на панели консоли
    const insertedCart = document.getElementById('deck-inserted-cartridge');
    const emptySlotLabel = document.getElementById('deck-slot-empty-label');
    const insertedRom = document.getElementById('inserted-cart-rom');
    const insertedTitle = document.getElementById('inserted-cart-title');
    const readyTag = document.getElementById('deck-cart-ready-tag');

    if (insertedCart) {
      insertedCart.style.display = 'flex';
      if (insertedRom) insertedRom.textContent = `ROM #0${this.deckIndex + 1}`;
      if (insertedTitle) insertedTitle.textContent = cart.id.toUpperCase();
    }
    if (emptySlotLabel) emptySlotLabel.style.display = 'none';
    if (readyTag) {
      readyTag.textContent = 'АКТИВЕН В СЛОТЕ';
      readyTag.style.color = 'var(--crt-phosphor)';
    }

    // 3. Щелчок тумблера питания POWER и зажигание светодиода
    const powerBtn = document.getElementById('btn-console-power');
    const powerLed = document.getElementById('console-power-led');
    const powerText = document.getElementById('console-power-text');

    if (powerBtn) {
      powerBtn.classList.add('active');
      powerBtn.setAttribute('aria-checked', 'true');
    }
    if (powerLed) {
      powerLed.classList.remove('led-standby');
      powerLed.classList.add('led-active');
    }
    if (powerText) {
      powerText.textContent = 'ONLINE';
      powerText.style.color = 'var(--crt-phosphor)';
    }
    Sound.playPowerClick();

    // 4. Запуск ЭЛТ-развертки (CRT horizontal expand) и BIOS экрана
    const screenWrapper = document.getElementById('screen-canvas-wrapper');
    const biosScreen = document.getElementById('bios-boot-screen');
    const biosRomName = document.getElementById('bios-rom-name');

    if (screenWrapper) screenWrapper.classList.add('crt-turning-on');
    if (biosScreen) biosScreen.style.display = 'flex';
    if (biosRomName) biosRomName.textContent = `MOUNTING ROM #0${this.deckIndex + 1} [${cart.id.toUpperCase()}]...`;

    // 5. Ностальгический 16-битный chime запуска
    Sound.playBootJingle();

    // 6. Плавный переход от BIOS к запущенной игре
    setTimeout(() => {
      if (screenWrapper) screenWrapper.classList.remove('crt-turning-on');
      if (biosScreen) biosScreen.style.display = 'none';

      // Скрыть колоду карт и отобразить фрейм с игрой
      const deckView = document.getElementById('deck-view') || document.getElementById('carousel-view');
      const iframeEl = document.getElementById('game-iframe');

      if (deckView) deckView.style.display = 'none';
      if (window.Previews) Previews.pause();
      if (iframeEl) {
        iframeEl.style.display = 'block';
        if (!iframeEl.src || !iframeEl.src.endsWith(cart.src)) {
          iframeEl.src = cart.src;
        }
        iframeEl.focus();
      }

      // Переключение состояния кнопок в панели консоли
      const menuPowerWrap = document.getElementById('menu-power-btn-wrap');
      const gameControlsWrap = document.getElementById('game-active-controls-wrap');
      const screenRestartBtn = document.getElementById('screen-restart-btn');
      const screenFullscreenBtn = document.getElementById('screen-fullscreen-btn');
      const screenPowerOffBtn = document.getElementById('screen-poweroff-btn');
      const screenStatusLabel = document.getElementById('screen-status-label');
      const slotTagLabel = document.getElementById('slot-tag-label');

      if (menuPowerWrap) menuPowerWrap.style.display = 'none';
      if (gameControlsWrap) gameControlsWrap.style.display = 'flex';
      if (screenRestartBtn) screenRestartBtn.style.display = 'inline-flex';
      if (screenFullscreenBtn) screenFullscreenBtn.style.display = 'inline-flex';
      if (screenPowerOffBtn) screenPowerOffBtn.style.display = 'inline-flex';
      if (screenStatusLabel) screenStatusLabel.textContent = `// ACTIVE: ${cart.name}`;
      if (slotTagLabel) slotTagLabel.textContent = '// КАРТРИДЖ В СЛОТЕ: АКТИВЕН';

      // Ачивки и статистика
      if (cart.id === 'stick_fighting') Storage.unlock("STICK_WARRIOR");
      else if (cart.id === 'pixel_drift') Storage.unlock("DRIFT_KING");
      else if (cart.id === 'chrono_blade') Storage.unlock("CHRONO_MASTER");
      else if (cart.id === 'mecha_siege') Storage.unlock("MECHA_COMMANDER");
      else if (cart.id === 'worms_armageddon') Storage.unlock("WORM_ARMAGEDDON");
      else if (cart.id === 'cosmo_junk') Storage.unlock("COSMO_JUNKER");

      Storage.data.gamesPlayed++;
      Storage.save();

      this.isPoweredOn = true;
      this.isBooting = false;
    }, 950);
  },

  // =========================================================================
  // ВЫКЛЮЧЕНИЕ ПРИСТАВКИ И ИЗВЛЕЧЕНИЕ КАРТРИДЖА (CRT СХЛОПЫВАНИЕ + ВЫБРОС РОМА)
  // =========================================================================
  powerOffConsole() {
    if (!this.isPoweredOn || this.isBooting) return;

    // 1. Щелчок выключения питания и спад высокого напряжения кинескопа
    Sound.playPowerClick();
    Sound.playPowerOff();

    // 2. Эффект схлопывания кинескопа ЭЛТ в точку (CRT horizontal collapse to dot)
    const screenWrapper = document.getElementById('screen-canvas-wrapper');
    if (screenWrapper) screenWrapper.classList.add('crt-turning-off');

    // 3. Выключение тумблера питания и индикатора
    const powerBtn = document.getElementById('btn-console-power');
    const powerLed = document.getElementById('console-power-led');
    const powerText = document.getElementById('console-power-text');

    if (powerBtn) {
      powerBtn.classList.remove('active');
      powerBtn.setAttribute('aria-checked', 'false');
    }
    if (powerLed) {
      powerLed.classList.add('led-standby');
      powerLed.classList.remove('led-active');
    }
    if (powerText) {
      powerText.textContent = 'STANDBY';
      powerText.style.color = 'var(--text-dim)';
    }

    // 4. Пружинный выброс картриджа из слота
    setTimeout(() => {
      Sound.playCartridgeEject();

      const insertedCart = document.getElementById('deck-inserted-cartridge');
      const emptySlotLabel = document.getElementById('deck-slot-empty-label');
      const readyTag = document.getElementById('deck-cart-ready-tag');

      if (insertedCart) insertedCart.style.display = 'none';
      if (emptySlotLabel) emptySlotLabel.style.display = 'block';
      if (readyTag) {
        readyTag.textContent = 'ГОТОВ К ВКЛЮЧЕНИЮ';
        readyTag.style.color = 'var(--crt-phosphor)';
      }

      // Выключение фрейма с игрой (останавливает фоновую музыку и CPU игры)
      const iframeEl = document.getElementById('game-iframe');
      if (iframeEl) {
        iframeEl.src = 'about:blank';
        iframeEl.style.display = 'none';
      }

      // Возврат экрана выбора карт
      const deckView = document.getElementById('deck-view') || document.getElementById('carousel-view');
      if (deckView) deckView.style.display = 'flex';
      if (window.Previews) Previews.resume();
      if (screenWrapper) screenWrapper.classList.remove('crt-turning-off');

      // Переключение кнопок панели
      const menuPowerWrap = document.getElementById('menu-power-btn-wrap');
      const gameControlsWrap = document.getElementById('game-active-controls-wrap');
      const screenRestartBtn = document.getElementById('screen-restart-btn');
      const screenFullscreenBtn = document.getElementById('screen-fullscreen-btn');
      const screenPowerOffBtn = document.getElementById('screen-poweroff-btn');
      const screenStatusLabel = document.getElementById('screen-status-label');
      const slotTagLabel = document.getElementById('slot-tag-label');

      if (menuPowerWrap) menuPowerWrap.style.display = 'flex';
      if (gameControlsWrap) gameControlsWrap.style.display = 'none';
      if (screenRestartBtn) screenRestartBtn.style.display = 'none';
      if (screenFullscreenBtn) screenFullscreenBtn.style.display = 'none';
      if (screenPowerOffBtn) screenPowerOffBtn.style.display = 'none';
      if (screenStatusLabel) screenStatusLabel.textContent = '// MATRIX DISPLAY 60FPS';
      if (slotTagLabel) slotTagLabel.textContent = '// ВЫБОР РОМ-КАРТРИДЖА';

      document.body.classList.remove('game-playing', 'pseudo-fullscreen');
      if (window.NeoLandscapeGuard) NeoLandscapeGuard.evaluate();
      this.isPoweredOn = false;
      this.updateDeckDisplay();
      this.updateDashboardInfo();
      setTimeout(() => this.warmupActiveIframe(), 300);
    }, 320);
  },

  ejectCartridge() {
    this.powerOffConsole();
  },

  togglePower() {
    if (this.isPoweredOn) {
      this.powerOffConsole();
    } else {
      this.powerOnCartridge();
    }
  },

  selectCartridge(gameId) {
    if (this.cartridgeOrder.includes(gameId)) {
      if (!this.isPoweredOn) {
        this.setDeckIndex(this.cartridgeOrder.indexOf(gameId));
      } else {
        // Если приставка уже включена, смена картриджа перезапускает с новым ромом
        this.powerOffConsole();
        setTimeout(() => {
          this.powerOnCartridge(gameId);
        }, 380);
      }
    }
  },

  restartGame() {
    Sound.playClick();
    if (!this.isPoweredOn) {
      this.powerOnCartridge();
      return;
    }
    const cart = this.cartridges[this.currentCartridge];
    const iframeEl = document.getElementById('game-iframe');
    if (cart && iframeEl) {
      iframeEl.src = cart.src;
      iframeEl.focus();
    }
  },

  openFullscreenGame() {
    Sound.playClick();
    const screenWrap = document.getElementById('screen-housing');
    const fsEl = document.fullscreenElement || document.webkitFullscreenElement;
    if (fsEl) {
      const exitFn = document.exitFullscreen || document.webkitExitFullscreen;
      if (exitFn) exitFn.call(document).catch(() => {});
      document.body.classList.remove('pseudo-fullscreen');
      return;
    }

    const reqFn = screenWrap && (screenWrap.requestFullscreen || screenWrap.webkitRequestFullscreen);
    if (reqFn) {
      Promise.resolve(reqFn.call(screenWrap)).catch(() => {
        document.body.classList.toggle('pseudo-fullscreen');
      });
    } else {
      document.body.classList.toggle('pseudo-fullscreen');
    }
  },

  openStandaloneTab() {
    Sound.playClick();
    const cart = this.cartridges[this.currentCartridge];
    if (cart) {
      window.open(cart.src, '_blank');
    }
  },

  toggleCRT() {
    const screenWrap = document.getElementById('screen-housing');
    const indicator = document.getElementById('crt-status-indicator');
    if (screenWrap) {
      const active = screenWrap.classList.toggle('crt-active');
      Storage.data.settings.crtFilter = active;
      Storage.save();
      Sound.playClick();
      if (indicator) {
        indicator.textContent = active ? 'CRT FILTER: ACTIVE' : 'CRT FILTER: OFF';
      }
      this.updateSettingsUI();
      if (active) Storage.unlock("CRT_PURIST");
    }
  },

  toggleBGM() {
    const isPlaying = Sound.toggleBGM();
    this.updateSettingsUI();
    if (isPlaying) Storage.unlock("CHIPTUNE_FAN");
  },

  toggleAudioMute() {
    Sound.toggleMute();
    this.updateSettingsUI();
  },

  updateSettingsUI() {
    // CRT toggle
    const screenWrap = document.getElementById('screen-housing');
    const isCRT = screenWrap ? screenWrap.classList.contains('crt-active') : true;
    const btnCrt = document.getElementById('btn-setting-crt');
    const labelCrt = document.getElementById('label-setting-crt');
    if (btnCrt) btnCrt.classList.toggle('active', isCRT);
    if (labelCrt) labelCrt.textContent = isCRT ? 'ВКЛ' : 'ВЫКЛ';

    // BGM toggle
    const isBGM = Sound.isBGMPlaying || false;
    const btnBgm = document.getElementById('btn-setting-bgm');
    const labelBgm = document.getElementById('label-setting-bgm');
    if (btnBgm) btnBgm.classList.toggle('active', isBGM);
    if (labelBgm) labelBgm.textContent = isBGM ? 'ВКЛ' : 'ВЫКЛ';

    // Mute toggle
    const isMuted = Sound.isMuted || false;
    const btnMute = document.getElementById('btn-setting-mute');
    const labelMute = document.getElementById('label-setting-mute');
    if (btnMute) btnMute.classList.toggle('active', !isMuted);
    if (labelMute) labelMute.textContent = !isMuted ? 'ВКЛ' : 'ВЫКЛ';
  },

  setupCartridgeSlot() {
    // Интерактивная полка картриджей (если присутствует)
    document.querySelectorAll('.cartridge-item').forEach(item => {
      item.addEventListener('click', () => {
        const gameId = item.dataset.game;
        this.selectCartridge(gameId);
      });
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.selectCartridge(item.dataset.game);
        }
      });
    });
  },

  openModal(modalId) {
    Sound.playClick();
    if (modalId === 'settings-modal') {
      this.updateSettingsUI();
    }
    const modal = document.getElementById(modalId);
    const backdrop = document.getElementById('console-backdrop');
    if (modal && backdrop) {
      modal.classList.add('open');
      backdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  },

  closeModal(modalId) {
    Sound.playClick();
    const modal = document.getElementById(modalId);
    const backdrop = document.getElementById('console-backdrop');
    if (modal && backdrop) {
      modal.classList.remove('open');
      backdrop.classList.remove('open');
      document.body.style.overflow = '';
    }
  },

  renderAchievementsModal() {
    const list = document.getElementById('achievements-grid');
    if (!list) return;

    list.innerHTML = Storage.achievementsList.map(a => {
      const unlocked = !!Storage.data.achievements[a.id];
      return `
        <div class="achieve-card ${unlocked ? 'unlocked' : 'locked'}">
          <div class="achieve-card-icon">${a.icon}</div>
          <div class="achieve-card-body">
            <div class="achieve-card-title">${a.title}</div>
            <div class="achieve-card-desc">${a.desc}</div>
            <div class="achieve-card-status">${unlocked ? '✓ РАЗБЛОКИРОВАНО' : '🔒 ЗАБЛОКИРОВАНО'}</div>
          </div>
        </div>
      `;
    }).join('');
  }
};

window.App = App;

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
