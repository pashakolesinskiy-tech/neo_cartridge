/**
 * NEO-CARTRIDGE // Universal Hero Landing Screen (Stick Fighting Style)
 * Adds an atmospheric split-screen Hero Landing Page with live animated Worms-style
 * sprite showcase, bold pixel typography, primary CTA ("▶ ИГРАТЬ", "🌐 ПО СЕТИ",
 * "⚙ НАСТРОЙКИ / ГАРАЖ"), and an interactive 3-card Bottom Roster Bar to Games 2–6.
 */
(function () {
  if (window.__NEO_HERO_LANDING__) return;
  window.__NEO_HERO_LANDING__ = true;

  // Do not inject inside embedded controller slots (e.g. Cosmo Junk ?embed=1)
  const params = new URLSearchParams(window.location.search);
  if (params.get('embed') === '1') return;

  const path = window.location.pathname.toLowerCase();
  let gameKey = '';
  if (path.includes('pixel_drift')) gameKey = 'pixel_drift';
  else if (path.includes('chrono_blade')) gameKey = 'chrono_blade';
  else if (path.includes('mecha_siege')) gameKey = 'mecha_siege';
  else if (path.includes('worms_armageddon')) gameKey = 'worms_armageddon';
  else if (path.includes('cosmo_junk')) gameKey = 'cosmo_junk';

  if (!gameKey) return;

  // Auto-skip hero landing if URL has direct room/join/host query or active hash route
  const hasAutoRoom =
    params.has('room') ||
    params.has('join') ||
    params.has('host') ||
    (window.location.hash && window.location.hash.length > 3);

  const CONFIGS = {
    pixel_drift: {
      eyebrow: 'ОРИГИНАЛЬНЫЙ АРКАДНЫЙ ДРИФТ-РЕЙСИНГ',
      titleTop: 'PIXEL',
      titleBottom: 'DRIFT GP',
      accent: '#f59e0b',
      accentGlow: 'rgba(245, 158, 11, 0.35)',
      secondaryAccent: '#22d3ee',
      subtitle: 'Жги резину.\nДержи угол заноса.',
      description: 'Кольцевые трассы, цепные комбо дрифта, турбо-нитро, масляные ловушки голосом и сетевые заезды по QR-коду без сервера.',
      playLabel: 'НА СТАРТ',
      netLabel: 'По сети (QR)',
      setupLabel: 'Гараж и трассы',
      rosterEyebrow: 'ВЫБЕРИ СВОЙ БОЛИД',
      rosterHeading: 'Легенды\nдрифта.',
      sheetUrl: 'sprites/pixel_drift_sheet.png',
      cards: [
        {
          id: 0,
          name: 'AE-86 TRUENO',
          role: 'Баланс и угол заноса · 95% Дрифт',
          tag: 'ВЫБРАН БОЛИД',
          color: '#22d3ee',
          spriteCol: 0,
          spriteRow: 0
        },
        {
          id: 1,
          name: 'RX-7 FD3S APEX',
          role: 'Роторный турбо-монстр · 92% Скорость',
          tag: 'ВЫБРАТЬ БОЛИД',
          color: '#f59e0b',
          spriteCol: 1,
          spriteRow: 0
        },
        {
          id: 2,
          name: 'CYBER GT-R V8',
          role: 'Максимальный форсаж нитро · 98% Тяга',
          tag: 'ВЫБРАТЬ БОЛИД',
          color: '#ec4899',
          spriteCol: 2,
          spriteRow: 0
        }
      ]
    },
    chrono_blade: {
      eyebrow: 'ВЫСОКОСКОРОСТНОЙ КИБЕР-СЛЭШЕР',
      titleTop: 'CHRONO',
      titleBottom: 'BLADE',
      accent: '#00f3ff',
      accentGlow: 'rgba(0, 243, 255, 0.35)',
      secondaryAccent: '#ff0055',
      subtitle: 'Останови время.\nОтрази пулю клинком.',
      description: 'Молниеносные рывки сквозь врагов, замедление времени Bullet-Time, прокачка кибер-чипов и дуэли 1 на 1 по сети или на одном экране.',
      playLabel: 'В БОЙ',
      netLabel: 'По сети (P2P)',
      setupLabel: 'Режимы игры',
      rosterEyebrow: 'ВЫБЕРИ РЕЖИМ КЛИНКА',
      rosterHeading: 'Твой стиль\nбоя.',
      sheetUrl: 'sprites/chrono_blade_sheet.png',
      cards: [
        {
          id: 'campaign',
          name: 'КАМПАНИЯ ZERO',
          role: '5 секторов завода, чипы и 2 босса',
          tag: 'ОДИНОЧНЫЙ РЕЖИМ',
          color: '#00f3ff',
          spriteCol: 2,
          spriteRow: 0
        },
        {
          id: 'duel_local',
          name: 'ДУЭЛЬ HOT-SEAT',
          role: '2 ниндзя на одном экране',
          tag: '2 ИГРОКА',
          color: '#ff0055',
          spriteCol: 4,
          spriteRow: 0
        },
        {
          id: 'duel_net',
          name: 'СЕТЬ WEBRTC P2P',
          role: 'Онлайн-дуэль по коду комнаты',
          tag: 'ОНЛАЙН ДУЭЛЬ',
          color: '#00ff88',
          spriteCol: 3,
          spriteRow: 2
        }
      ]
    },
    mecha_siege: {
      eyebrow: '16-БИТНЫЙ ТАКТИЧЕСКИЙ TOWER DEFENSE',
      titleTop: 'MECHA',
      titleBottom: 'SIEGE',
      accent: '#ffb800',
      accentGlow: 'rgba(255, 184, 0, 0.35)',
      secondaryAccent: '#00f3ff',
      subtitle: 'Стальной рубеж.\nНи шагу назад.',
      description: 'Обороняй реакторное ядро от 15 волн шагоходов и боссов-колоссов: 5 типов турелей с ветками специализации, орбитальный напалм и кооператив.',
      playLabel: 'К ОБОРОНЕ',
      netLabel: 'Кооп по сети',
      setupLabel: 'Арсенал и база',
      rosterEyebrow: 'ТАКТИЧЕСКИЙ РЕЖИМ',
      rosterHeading: 'Выбери\nкомандование.',
      sheetUrl: 'sprites/mecha_siege_sheet.png',
      cards: [
        {
          id: 'solo',
          name: 'ОБОРОНА ЯДРА',
          role: '15 волн мехов и боссы-колоссы',
          tag: 'ОДИНОЧНАЯ КАМПАНИЯ',
          color: '#ffb800',
          spriteCol: 0,
          spriteRow: 0
        },
        {
          id: 'hotseat',
          name: 'КООП 2 ИГРОКА',
          role: 'Совместная стройка на 1 экране',
          tag: 'HOT-SEAT CO-OP',
          color: '#00f3ff',
          spriteCol: 2,
          spriteRow: 0
        },
        {
          id: 'armory',
          name: 'ТЕСЛА И КАТАЛОГ',
          role: '5 турелей + ЭМИ, Напалм и Форсаж',
          tag: 'СПРАВОЧНИК ОРУДИЙ',
          color: '#00ff88',
          spriteCol: 3,
          spriteRow: 0
        }
      ]
    },
    worms_armageddon: {
      eyebrow: 'ПОШАГОВАЯ АРТИЛЛЕРИЯ С РАЗРУШАЕМЫМ МИРОМ',
      titleTop: 'WORMS',
      titleBottom: 'ARMAGEDDON',
      accent: '#ffd32a',
      accentGlow: 'rgba(255, 211, 42, 0.35)',
      secondaryAccent: '#ff4757',
      subtitle: '34 вида оружия.\nПолное разрушение.',
      description: 'Базука, Святая Граната, Супер-Овца, Верёвка ниндзя, Напалм и Метеоритный шторм. Сражайся против баллистического ИИ, вчетвером на 1 экране или по сети.',
      playLabel: 'В БОЙ',
      netLabel: 'По сети (QR)',
      setupLabel: 'Настройка матча',
      rosterEyebrow: 'ВЫБЕРИ СЦЕНАРИЙ БИТВЫ',
      rosterHeading: 'Взрывной\nхаос.',
      sheetUrl: 'worms-armageddon/assets/worms-sheet.png',
      cards: [
        {
          id: '1p',
          name: '1P ПРОТИВ ИИ',
          role: 'Дуэль против баллистического ИИ',
          tag: 'БЫСТРЫЙ БОЙ',
          color: '#ff4757',
          spriteCol: 0,
          spriteRow: 0
        },
        {
          id: '2p',
          name: '2P HOT-SEAT',
          role: 'Битва вдвоём на одном устройстве',
          tag: '2 КОМАНДЫ',
          color: '#48dbfb',
          spriteCol: 4,
          spriteRow: 1
        },
        {
          id: '4p',
          name: '4-TEAM MAYHEM',
          role: 'Тотальная война 4 армий червяков',
          tag: '4 КОМАНДЫ',
          color: '#ffd32a',
          spriteCol: 1,
          spriteRow: 2
        }
      ]
    },
    cosmo_junk: {
      eyebrow: 'КООПЕРАТИВНЫЙ КОСМИЧЕСКИЙ СИМУЛЯТОР ЭКИПАЖА',
      titleTop: 'COSMO',
      titleBottom: 'JUNK',
      accent: '#57e6e6',
      accentGlow: 'rgba(87, 230, 230, 0.35)',
      secondaryAccent: '#ffb000',
      subtitle: 'Один корабль.\nЧетыре роли экипажа.',
      description: 'Пилот у штурвала, Инженер у реактора, Стрелок за турелью и Штурман с мануалом. Пустые кресла займут умные ИИ-боты, а встроенный пульт работает прямо на экране.',
      playLabel: 'СОЗДАТЬ КОРАБЛЬ',
      netLabel: 'Пульт экипажа',
      setupLabel: 'Лобби и Зал Славы',
      rosterEyebrow: 'РОЛИ БОРТОВОГО ЭКИПАЖА',
      rosterHeading: 'Выбери\nпост.',
      sheetUrl: 'sprites/cosmo_junk_sheet.png',
      cards: [
        {
          id: 'pilot',
          name: 'ПИЛОТ И ШТУРВАЛ',
          role: 'Манёвры между астероидами и гиперпрыжок',
          tag: 'СЛОТ P1 + ИИ-БОТЫ',
          color: '#ffb000',
          spriteCol: 0,
          spriteRow: 0
        },
        {
          id: 'engineer',
          name: 'ИНЖЕНЕР ТРЮМА',
          role: 'Тушение пожаров, предохранители и коды',
          tag: 'СЛОТ P2 + ИИ-БОТЫ',
          color: '#3bff8f',
          spriteCol: 1,
          spriteRow: 0
        },
        {
          id: 'gunner',
          name: 'КАНОНИР И ЩИТЫ',
          role: 'Отражение пиратских торпед в 4 секторах',
          tag: 'СЛОТ P3 + ИИ-БОТЫ',
          color: '#ff4bd8',
          spriteCol: 2,
          spriteRow: 0
        }
      ]
    }
  };

  const cfg = CONFIGS[gameKey];
  let selectedIdx = 0;
  let animFrame = 0;
  let sheetImg = null;
  let sheetLoaded = false;

  function loadSheet() {
    sheetImg = new Image();
    sheetImg.decoding = 'async';
    sheetImg.onload = () => {
      sheetLoaded = true;
      renderPortraits();
    };
    sheetImg.src = cfg.sheetUrl;
  }

  function injectStyles() {
    if (document.getElementById('neo-hero-landing-styles')) return;
    const style = document.createElement('style');
    style.id = 'neo-hero-landing-styles';
    style.textContent = `
      #neo-hero-landing {
        position: fixed;
        inset: 0;
        z-index: 15000;
        background: #111216;
        color: #f2f0ea;
        font-family: "Space Grotesk", "Rubik", "Trebuchet MS", Arial, sans-serif;
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        overflow-x: hidden;
        user-select: none;
        -webkit-user-select: none;
      }
      #neo-hero-landing.nhl-hidden {
        display: none !important;
      }
      .nhl-header {
        z-index: 5;
        background: #111216;
        border-bottom: 1px solid #27282c;
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 64px;
        min-height: 64px;
        padding: 0 4.5%;
        gap: 16px;
      }
      .nhl-brand {
        display: inline-flex;
        align-items: center;
        gap: 11px;
        font-family: "JetBrains Mono", Consolas, monospace;
        font-weight: 900;
        font-size: 15px;
        letter-spacing: 0.12em;
        color: #f4f0e6;
      }
      .nhl-brand-mark {
        width: 24px;
        height: 24px;
        border-radius: 5px;
        background: ${cfg.accent};
        color: #14151a;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-weight: 900;
        font-size: 13px;
        box-shadow: 0 0 14px ${cfg.accentGlow};
      }
      .nhl-nav {
        display: flex;
        align-items: stretch;
        gap: 24px;
        height: 100%;
      }
      .nhl-nav-btn {
        background: transparent;
        border: 0;
        color: #9b9c9f;
        font-size: 13px;
        font-weight: 600;
        padding: 0 4px;
        cursor: pointer;
        position: relative;
        transition: color 0.15s;
      }
      .nhl-nav-btn:hover,
      .nhl-nav-btn.active {
        color: ${cfg.accent};
      }
      .nhl-nav-btn.active::after {
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        bottom: -1px;
        height: 2px;
        background: ${cfg.accent};
      }
      .nhl-header-actions {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .nhl-settings-btn {
        background: #1b1c21;
        border: 1px solid #343439;
        color: #d4d0cb;
        padding: 8px 14px;
        font-size: 12px;
        font-weight: 600;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        transition: all 0.15s;
      }
      .nhl-settings-btn:hover {
        border-color: ${cfg.accent};
        color: #ffffff;
      }
      .nhl-stage {
        position: relative;
        flex: 1 0 auto;
        min-height: 410px;
        height: clamp(410px, 56dvh, 580px);
        width: 100%;
        overflow: hidden;
        background: #171922;
        isolation: isolate;
      }
      .nhl-stage-canvas {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        display: block;
        z-index: -2;
      }
      .nhl-hero-shade {
        position: absolute;
        inset: 0;
        z-index: -1;
        pointer-events: none;
        background:
          linear-gradient(90deg, #111216 0%, rgba(17, 18, 22, 0.94) 28%, rgba(17, 18, 22, 0.68) 54%, rgba(17, 18, 22, 0.12) 82%, transparent 100%),
          linear-gradient(180deg, transparent 68%, rgba(17, 18, 22, 0.72) 100%);
      }
      .nhl-hero-content {
        position: absolute;
        top: 10%;
        left: 5.4%;
        z-index: 2;
        max-width: 540px;
      }
      .nhl-eyebrow {
        display: flex;
        align-items: center;
        gap: 10px;
        font-family: "JetBrains Mono", Consolas, monospace;
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 1.8px;
        color: #c5b6a8;
      }
      .nhl-live-dot {
        width: 6px;
        height: 6px;
        background: ${cfg.accent};
        box-shadow: 0 0 10px ${cfg.accent};
        display: inline-block;
        flex-shrink: 0;
      }
      .nhl-title {
        margin: 18px 0 16px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 4px;
        font-family: "Press Start 2P", "JetBrains Mono", Consolas, monospace;
        font-weight: 900;
        font-size: clamp(30px, 4.4vw, 54px);
        line-height: 1.08;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        color: #f4f0e6;
        text-shadow: 4px 5px 0 rgba(8, 12, 24, 0.75);
      }
      .nhl-title-accent {
        color: ${cfg.accent};
      }
      .nhl-subtitle {
        margin: 0 0 10px;
        font-size: clamp(19px, 1.8vw, 25px);
        font-weight: 600;
        line-height: 1.28;
        color: #e8e3db;
        white-space: pre-line;
      }
      .nhl-description {
        margin: 0 0 22px;
        font-size: 12.5px;
        line-height: 1.6;
        color: #a39f9e;
        max-width: 470px;
      }
      .nhl-actions {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 12px;
      }
      .nhl-btn-primary {
        background: ${cfg.accent};
        color: #191412;
        border: 0;
        height: 48px;
        min-width: 196px;
        padding: 0 22px;
        font-family: "JetBrains Mono", Consolas, monospace;
        font-size: 13px;
        font-weight: 900;
        letter-spacing: 1.4px;
        display: inline-flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        cursor: pointer;
        box-shadow: 0 4px 0 rgba(0, 0, 0, 0.55), 0 0 24px ${cfg.accentGlow};
        transition: transform 0.14s, filter 0.14s;
      }
      .nhl-btn-primary:hover {
        filter: brightness(1.1);
        transform: translateY(-2px);
      }
      .nhl-btn-primary:active {
        transform: translateY(2px);
      }
      .nhl-btn-secondary {
        background: rgba(24, 24, 30, 0.72);
        border: 1px solid #4e4747;
        color: #d6cac2;
        height: 48px;
        padding: 0 18px;
        font-size: 12px;
        font-weight: 600;
        display: inline-flex;
        align-items: center;
        gap: 9px;
        cursor: pointer;
        backdrop-filter: blur(6px);
        transition: all 0.15s;
      }
      .nhl-btn-secondary:hover {
        border-color: ${cfg.accent};
        color: #ffffff;
        background: rgba(38, 36, 46, 0.88);
      }
      .nhl-roster {
        background: #15161b;
        border-top: 1px solid #323039;
        border-bottom: 1px solid #28282e;
        padding: 20px 5.4% 22px;
        display: flex;
        align-items: center;
        gap: 28px;
      }
      .nhl-roster-heading {
        flex: 0 0 19%;
      }
      .nhl-roster-heading .nhl-ro-eyebrow {
        font-family: "JetBrains Mono", Consolas, monospace;
        font-size: 9px;
        letter-spacing: 1.4px;
        color: #7d7c84;
        display: block;
      }
      .nhl-roster-heading h2 {
        margin: 7px 0 0;
        font-size: 22px;
        font-weight: 600;
        line-height: 1.15;
        color: #dedad2;
        white-space: pre-line;
      }
      .nhl-roster-options {
        display: flex;
        gap: 14px;
        width: 100%;
      }
      .nhl-roster-card {
        flex: 1;
        min-width: 0;
        background: rgba(24, 25, 32, 0.65);
        border: 1px solid transparent;
        border-bottom: 2px solid #323039;
        padding: 6px 14px 6px 6px;
        display: flex;
        align-items: center;
        gap: 10px;
        text-align: left;
        color: inherit;
        cursor: pointer;
        position: relative;
        transition: all 0.16s;
      }
      .nhl-roster-card:hover {
        background: #202128;
        border-bottom-color: var(--card-color);
      }
      .nhl-roster-card.selected {
        border-color: rgba(255, 255, 255, 0.16);
        border-bottom: 2px solid var(--card-color);
        background: linear-gradient(100deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.01));
      }
      .nhl-portrait {
        width: 78px;
        height: 68px;
        flex-shrink: 0;
        display: block;
      }
      .nhl-card-text {
        display: flex;
        flex-direction: column;
        gap: 5px;
        min-width: 0;
      }
      .nhl-card-text strong {
        font-family: "JetBrains Mono", Consolas, monospace;
        font-size: 15px;
        font-weight: 800;
        letter-spacing: 0.6px;
        color: #e5e1da;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .nhl-roster-card.selected .nhl-card-text strong {
        color: var(--card-color);
      }
      .nhl-card-text span {
        font-size: 10.5px;
        color: #96949c;
        line-height: 1.3;
      }
      .nhl-card-text small {
        font-family: "JetBrains Mono", Consolas, monospace;
        font-size: 8.5px;
        letter-spacing: 0.9px;
        color: #6d6e77;
      }
      .nhl-roster-card.selected .nhl-card-text small {
        color: var(--card-color);
      }
      .nhl-footer {
        padding: 14px 5.4%;
        font-size: 10px;
        color: #68676f;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #111216;
      }
      .nhl-footer span:last-child {
        font-family: "JetBrains Mono", Consolas, monospace;
        font-size: 9px;
        letter-spacing: 1.3px;
      }

      /* Mobile Portrait & Landscape Responsiveness */
      @media (max-width: 760px) {
        .nhl-header {
          height: 52px;
          min-height: 52px;
          padding: 0 4%;
        }
        .nhl-nav {
          display: none;
        }
        .nhl-stage {
          min-height: 360px;
          height: 410px;
        }
        .nhl-hero-content {
          top: 7%;
          left: 5%;
          right: 5%;
          max-width: 90%;
        }
        .nhl-title {
          font-size: clamp(24px, 7.5vw, 36px);
          margin: 12px 0;
        }
        .nhl-subtitle {
          font-size: 17px;
        }
        .nhl-description {
          font-size: 11px;
          margin-bottom: 16px;
        }
        .nhl-btn-primary {
          height: 42px;
          min-width: 160px;
          font-size: 12px;
          padding: 0 16px;
        }
        .nhl-btn-secondary {
          height: 42px;
          font-size: 11px;
          padding: 0 12px;
        }
        .nhl-roster {
          flex-direction: column;
          align-items: stretch;
          gap: 12px;
          padding: 16px 5%;
        }
        .nhl-roster-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .nhl-roster-heading h2 {
          font-size: 17px;
          margin: 0;
          white-space: normal;
        }
        .nhl-roster-options {
          flex-direction: column;
          gap: 8px;
        }
        .nhl-footer span:last-child {
          display: none;
        }
      }

      @media (orientation: landscape) and (max-height: 520px) {
        .nhl-header {
          height: 40px;
          min-height: 40px;
          padding: 0 3.5%;
        }
        .nhl-brand {
          font-size: 12px;
        }
        .nhl-brand-mark {
          width: 20px;
          height: 20px;
          font-size: 11px;
        }
        .nhl-settings-btn {
          padding: 5px 10px;
          font-size: 10px;
        }
        .nhl-stage {
          min-height: 215px;
          height: calc(100dvh - 134px);
        }
        .nhl-hero-content {
          top: 6%;
          left: 4%;
          max-width: 55%;
        }
        .nhl-eyebrow {
          font-size: 8.5px;
        }
        .nhl-title {
          font-size: clamp(20px, 3.2vw, 30px);
          margin: 6px 0 6px;
        }
        .nhl-subtitle {
          font-size: 14px;
          margin-bottom: 4px;
          white-space: normal;
        }
        .nhl-description {
          font-size: 10px;
          line-height: 1.35;
          margin-bottom: 10px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .nhl-actions {
          gap: 8px;
        }
        .nhl-btn-primary {
          height: 34px;
          min-width: 144px;
          padding: 0 14px;
          font-size: 11px;
        }
        .nhl-btn-secondary {
          height: 34px;
          padding: 0 12px;
          font-size: 10px;
        }
        .nhl-roster {
          padding: 8px 4%;
          gap: 14px;
          height: 94px;
          min-height: 94px;
        }
        .nhl-roster-heading {
          flex: 0 0 15%;
        }
        .nhl-roster-heading h2 {
          font-size: 14px;
          margin-top: 3px;
        }
        .nhl-roster-options {
          gap: 8px;
        }
        .nhl-roster-card {
          padding: 4px 8px 4px 4px;
          gap: 6px;
        }
        .nhl-portrait {
          width: 52px;
          height: 46px;
        }
        .nhl-card-text strong {
          font-size: 11.5px;
        }
        .nhl-card-text span {
          font-size: 8.5px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .nhl-card-text small {
          font-size: 7.5px;
        }
        .nhl-footer {
          display: none;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function drawSpriteCell(ctx, col, row, dx, dy, dw, dh, flipX) {
    if (!sheetLoaded || !sheetImg) return;
    const cellW = Math.floor((sheetImg.naturalWidth || 1152) / 6);
    const cellH = Math.floor((sheetImg.naturalHeight || 768) / 4);
    ctx.save();
    if (flipX) {
      ctx.translate(dx + dw, dy);
      ctx.scale(-1, 1);
      ctx.drawImage(sheetImg, col * cellW, row * cellH, cellW, cellH, 0, 0, dw, dh);
    } else {
      ctx.drawImage(sheetImg, col * cellW, row * cellH, cellW, cellH, dx, dy, dw, dh);
    }
    ctx.restore();
  }

  function renderPortraits() {
    const canvases = document.querySelectorAll('#neo-hero-landing .nhl-portrait');
    canvases.forEach((cv, idx) => {
      const card = cfg.cards[idx];
      if (!card) return;
      const ctx = cv.getContext('2d');
      ctx.clearRect(0, 0, cv.width, cv.height);
      // Subtle stage pedestal
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.beginPath();
      ctx.ellipse(cv.width / 2, cv.height - 10, 26, 6, 0, 0, Math.PI * 2);
      ctx.fill();
      if (sheetLoaded) {
        drawSpriteCell(ctx, card.spriteCol, card.spriteRow, (cv.width - 58) / 2, (cv.height - 58) / 2 - 2, 58, 58, false);
      }
    });
  }

  function animateStage(canvas) {
    const ctx = canvas.getContext('2d');
    const step = (now) => {
      const overlay = document.getElementById('neo-hero-landing');
      if (!overlay || overlay.classList.contains('nhl-hidden')) return;
      const rect = canvas.getBoundingClientRect();
      const w = Math.max(320, Math.round(rect.width));
      const h = Math.max(200, Math.round(rect.height));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      const t = now / 1000;
      ctx.clearRect(0, 0, w, h);

      // Rich atmospheric background
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      if (gameKey === 'pixel_drift') {
        grad.addColorStop(0, '#131829');
        grad.addColorStop(0.55, '#251c38');
        grad.addColorStop(1, '#12151f');
      } else if (gameKey === 'chrono_blade') {
        grad.addColorStop(0, '#0c1626');
        grad.addColorStop(0.6, '#18243c');
        grad.addColorStop(1, '#0e131d');
      } else if (gameKey === 'mecha_siege') {
        grad.addColorStop(0, '#1f1916');
        grad.addColorStop(0.6, '#2d231d');
        grad.addColorStop(1, '#141214');
      } else if (gameKey === 'worms_armageddon') {
        grad.addColorStop(0, '#182c44');
        grad.addColorStop(0.6, '#2e4a62');
        grad.addColorStop(1, '#18222e');
      } else {
        grad.addColorStop(0, '#070c1a');
        grad.addColorStop(0.6, '#121e38');
        grad.addColorStop(1, '#080c18');
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Glowing Sun / Moon / Reactor Core on the right side
      const orbX = w * 0.72;
      const orbY = h * 0.42;
      const orbR = Math.min(w, h) * 0.22;
      const orbGrad = ctx.createRadialGradient(orbX, orbY, orbR * 0.1, orbX, orbY, orbR * 1.6);
      orbGrad.addColorStop(0, cfg.accent);
      orbGrad.addColorStop(0.45, cfg.accentGlow);
      orbGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = orbGrad;
      ctx.beginPath();
      ctx.arc(orbX, orbY, orbR * 1.6, 0, Math.PI * 2);
      ctx.fill();

      // Perspective Grid / Horizon Floor
      const horizonY = h * 0.76;
      ctx.fillStyle = 'rgba(12, 15, 22, 0.85)';
      ctx.fillRect(0, horizonY, w, h - horizonY);
      ctx.strokeStyle = cfg.accent;
      ctx.globalAlpha = 0.25;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, horizonY);
      ctx.lineTo(w, horizonY);
      ctx.stroke();
      ctx.globalAlpha = 1;

      // Animated Hero Sprites on the right half of the stage
      if (sheetLoaded) {
        const card = cfg.cards[selectedIdx] || cfg.cards[0];
        const heroSize = Math.round(Math.min(w * 0.24, h * 0.52, 196));
        const bob1 = Math.sin(t * 3.5) * 6;
        const bob2 = Math.cos(t * 3.2) * 5;
        const hx1 = Math.round(w * 0.64 - heroSize / 2);
        const hy1 = Math.round(horizonY - heroSize * 0.82 + bob1);
        const hx2 = Math.round(w * 0.82 - heroSize / 2);
        const hy2 = Math.round(horizonY - heroSize * 0.78 + bob2);

        // Ground shadows
        ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
        ctx.beginPath();
        ctx.ellipse(hx1 + heroSize / 2, horizonY + 6, heroSize * 0.34, 10, 0, 0, Math.PI * 2);
        ctx.ellipse(hx2 + heroSize / 2, horizonY + 6, heroSize * 0.32, 9, 0, 0, Math.PI * 2);
        ctx.fill();

        const nextCard = cfg.cards[(selectedIdx + 1) % cfg.cards.length];
        drawSpriteCell(ctx, card.spriteCol, card.spriteRow, hx1, hy1, heroSize, heroSize, false);
        drawSpriteCell(ctx, nextCard.spriteCol, nextCard.spriteRow, hx2, hy2, Math.round(heroSize * 0.92), Math.round(heroSize * 0.92), true);
      }

      animFrame = requestAnimationFrame(step);
    };
    animFrame = requestAnimationFrame(step);
  }

  function hideHero() {
    const el = document.getElementById('neo-hero-landing');
    if (el) el.classList.add('nhl-hidden');
    if (animFrame) cancelAnimationFrame(animFrame);
  }

  function applyCardSelection(idx) {
    selectedIdx = idx;
    const cards = document.querySelectorAll('#neo-hero-landing .nhl-roster-card');
    cards.forEach((c, i) => c.classList.toggle('selected', i === idx));

    // Sync selection with underlying game state
    try {
      if (gameKey === 'pixel_drift') {
        // Click prev/next car button or set selectedCarIndex
        const prevBtn = document.getElementById('prevCarBtn');
        const nextBtn = document.getElementById('nextCarBtn');
        if (prevBtn && nextBtn) {
          // Reset to 0 then advance to idx
          for (let k = 0; k < 4; k++) prevBtn.click();
          for (let k = 0; k < idx; k++) nextBtn.click();
        }
      } else if (gameKey === 'worms_armageddon') {
        const presetId = cfg.cards[idx].id;
        const btn = document.querySelector(`.preset-btn[data-preset="${presetId}"]`);
        if (btn) btn.click();
      }
    } catch {}
  }

  function handlePrimaryPlay() {
    const card = cfg.cards[selectedIdx] || cfg.cards[0];
    hideHero();
    try {
      if (gameKey === 'pixel_drift') {
        const startBtn = document.getElementById('btnStartRace');
        if (startBtn) startBtn.click();
      } else if (gameKey === 'chrono_blade') {
        if (card.id === 'duel_net' && window.Game && Game.openNetworkModal) {
          Game.openNetworkModal();
        } else if (window.Game && Game.startMode) {
          Game.startMode(card.id === 'duel_local' ? 'duel_local' : 'campaign');
        }
      } else if (gameKey === 'mecha_siege') {
        if (card.id === 'armory' && window.Game && Game.switchMenuTab) {
          Game.switchMenuTab('armory');
        } else if (window.Game && Game.startMode) {
          Game.startMode(card.id === 'hotseat' ? 'hotseat' : 'solo');
        }
      } else if (gameKey === 'worms_armageddon') {
        const startBtn = document.getElementById('btn-start-match');
        if (startBtn) startBtn.click();
      } else if (gameKey === 'cosmo_junk') {
        // Find the primary "СОЗДАТЬ КОРАБЛЬ" button inside #root
        const createBtn = document.querySelector('#root button.pxl-btn.bg-amber-400');
        if (createBtn) createBtn.click();
      }
    } catch {}
  }

  function handleNetworkPlay() {
    hideHero();
    try {
      if (gameKey === 'pixel_drift') {
        const qrBtn = document.getElementById('menuQrNetBtn') || document.getElementById('btnTopQrNet');
        if (qrBtn) qrBtn.click();
      } else if (gameKey === 'chrono_blade') {
        if (window.Game && Game.openNetworkModal) Game.openNetworkModal();
      } else if (gameKey === 'mecha_siege') {
        if (window.Game && Game.openNetworkModal) Game.openNetworkModal();
      } else if (gameKey === 'worms_armageddon') {
        const onlineTab = document.getElementById('tab-online');
        if (onlineTab) onlineTab.click();
      } else if (gameKey === 'cosmo_junk') {
        const deckBtn = document.getElementById('cj-btn-deck');
        if (deckBtn) deckBtn.click();
      }
    } catch {}
  }

  function handleSetupOpen() {
    // Dismiss the Hero Landing to reveal the game's full Garage / Setup / Armory modal underneath
    hideHero();
  }

  function buildHeroDOM() {
    if (hasAutoRoom || document.getElementById('neo-hero-landing')) return;
    injectStyles();
    loadSheet();

    const wrap = document.createElement('div');
    wrap.id = 'neo-hero-landing';
    wrap.innerHTML = `
      <header class="nhl-header">
        <div class="nhl-brand">
          <span class="nhl-brand-mark">★</span>
          <span>${cfg.titleTop} ${cfg.titleBottom}</span>
        </div>
        <nav class="nhl-nav" aria-label="Главное меню">
          <button type="button" class="nhl-nav-btn active">Главная</button>
          <button type="button" class="nhl-nav-btn" id="nhl-nav-setup">${cfg.setupLabel}</button>
          <button type="button" class="nhl-nav-btn" id="nhl-nav-net">${cfg.netLabel}</button>
        </nav>
        <div class="nhl-header-actions">
          <button type="button" class="nhl-settings-btn" id="nhl-top-setup-btn">⚙ ${cfg.setupLabel}</button>
        </div>
      </header>

      <section class="nhl-stage">
        <canvas class="nhl-stage-canvas" id="nhl-stage-canvas"></canvas>
        <div class="nhl-hero-shade"></div>
        <div class="nhl-hero-content">
          <div class="nhl-eyebrow"><span class="nhl-live-dot"></span> ${cfg.eyebrow}</div>
          <h1 class="nhl-title">
            <span>${cfg.titleTop}</span>
            <span class="nhl-title-accent">${cfg.titleBottom}</span>
          </h1>
          <h2 class="nhl-subtitle">${cfg.subtitle}</h2>
          <p class="nhl-description">${cfg.description}</p>
          <div class="nhl-actions">
            <button type="button" class="nhl-btn-primary" id="nhl-btn-play">
              <span>▶ ${cfg.playLabel}</span>
              <span>→</span>
            </button>
            <button type="button" class="nhl-btn-secondary" id="nhl-btn-net">
              <span>🌐 ${cfg.netLabel}</span>
            </button>
            <button type="button" class="nhl-btn-secondary" id="nhl-btn-setup">
              <span>🎛 ${cfg.setupLabel}</span>
            </button>
          </div>
        </div>
      </section>

      <section class="nhl-roster" aria-label="Выбор режима или персонажа">
        <div class="nhl-roster-heading">
          <span class="nhl-ro-eyebrow">${cfg.rosterEyebrow}</span>
          <h2>${cfg.rosterHeading}</h2>
        </div>
        <div class="nhl-roster-options">
          ${cfg.cards
            .map(
              (c, i) => `
            <button type="button" class="nhl-roster-card ${i === 0 ? 'selected' : ''}" data-idx="${i}" style="--card-color: ${c.color}">
              <canvas class="nhl-portrait" width="78" height="68"></canvas>
              <span class="nhl-card-text">
                <strong>${c.name}</strong>
                <span>${c.role}</span>
                <small>${c.tag}</small>
              </span>
            </button>
          `
            )
            .join('')}
        </div>
      </section>

      <footer class="nhl-footer">
        <span>Без загрузок. Без регистрации. Полный автономный Zero-Server режим.</span>
        <span>NEO-CARTRIDGE // WORMS EDITION</span>
      </footer>
    `;

    document.body.appendChild(wrap);

    wrap.querySelector('#nhl-btn-play').addEventListener('click', handlePrimaryPlay);
    wrap.querySelector('#nhl-btn-net').addEventListener('click', handleNetworkPlay);
    wrap.querySelector('#nhl-btn-setup').addEventListener('click', handleSetupOpen);
    wrap.querySelector('#nhl-top-setup-btn').addEventListener('click', handleSetupOpen);
    wrap.querySelector('#nhl-nav-setup').addEventListener('click', handleSetupOpen);
    wrap.querySelector('#nhl-nav-net').addEventListener('click', handleNetworkPlay);

    wrap.querySelectorAll('.nhl-roster-card').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-idx') || '0', 10);
        applyCardSelection(idx);
      });
    });

    const stageCanvas = wrap.querySelector('#nhl-stage-canvas');
    if (stageCanvas) animateStage(stageCanvas);
    renderPortraits();
  }

  window.NeoHeroLanding = {
    show: () => {
      const el = document.getElementById('neo-hero-landing');
      if (el) {
        el.classList.remove('nhl-hidden');
        const stageCanvas = el.querySelector('#nhl-stage-canvas');
        if (stageCanvas) animateStage(stageCanvas);
      }
    },
    hide: hideHero
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildHeroDOM);
  } else {
    buildHeroDOM();
  }
})();
