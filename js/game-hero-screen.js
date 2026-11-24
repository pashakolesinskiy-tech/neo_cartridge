/**
 * NEO-CARTRIDGE // Universal Hero Landing Screen (Stick Fighting Style)
 * Unified, responsive split-screen Hero Landing Page with Retina sprite stage,
 * working direct Launch / Car & Role selection sync, keyboard lock & clean routing.
 */
(function () {
  if (window.__NEO_HERO_LANDING__) return;
  window.__NEO_HERO_LANDING__ = true;

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

  const hasAutoRoom = () =>
    params.has('room') ||
    params.has('join') ||
    params.has('host') ||
    (window.location.hash && window.location.hash.length > 3);

  const CONFIGS = {
    pixel_drift: {
      eyebrow: 'ОРИГИНАЛЬНЫЙ АРКАДНЫЙ ДРИФТ-РЕЙСИНГ',
      titleTop: 'PIXEL',
      titleBottom: 'DRIFT GP',
      editionLabel: 'PIXEL DRIFT EDITION',
      accent: '#f59e0b',
      accentGlow: 'rgba(245, 158, 11, 0.35)',
      subtitle: 'Жги резину.\nДержи угол заноса.',
      description: 'Кольцевые трассы, цепные комбо дрифта, турбо-нитро, масляные ловушки по кнопке или голосу и сетевые заезды по QR-коду без сервера.',
      playLabel: 'НА СТАРТ',
      netLabel: 'По сети (QR)',
      setupLabel: 'Гараж и трассы',
      rosterEyebrow: 'ВЫБЕРИ СВОЙ БОЛИД',
      rosterHeading: 'Легенды\nдрифта.',
      sheetUrl: 'sprites/pixel_drift_sheet.png',
      stageMode: 'topdown',
      cards: [
        { id: 0, name: 'AE-86 TRUENO', role: 'Баланс и угол заноса', tag: 'КЛАССИКА', color: '#22d3ee', spriteCol: 0, spriteRow: 0 },
        { id: 1, name: 'RX-7 ROTARY', role: 'Маневры в шпильках', tag: 'РОТОРНЫЙ', color: '#ec4899', spriteCol: 5, spriteRow: 0 },
        { id: 2, name: 'SKYLINE GT-R34', role: 'Ровный тяговый дрифт', tag: 'ТУРБО 4WD', color: '#38bdf8', spriteCol: 4, spriteRow: 0 },
        { id: 3, name: 'CYBER-V8 NEON', role: 'Максимум нитро', tag: 'ПРОТОТИП', color: '#f59e0b', spriteCol: 2, spriteRow: 0 }
      ]
    },
    chrono_blade: {
      eyebrow: 'ВЫСОКОСКОРОСТНОЙ КИБЕР-СЛЭШЕР',
      titleTop: 'CHRONO',
      titleBottom: 'BLADE',
      editionLabel: 'CHRONO BLADE EDITION',
      accent: '#00f3ff',
      accentGlow: 'rgba(0, 243, 255, 0.35)',
      subtitle: 'Останови время.\nОтрази пулю клинком.',
      description: 'Молниеносные рывки сквозь врагов, замедление времени Bullet-Time, прокачка кибер-чипов и дуэли 1 на 1 по сети или на одном экране.',
      playLabel: 'В БОЙ',
      netLabel: 'По сети (P2P)',
      setupLabel: 'Режимы игры',
      rosterEyebrow: 'ВЫБЕРИ РЕЖИМ КЛИНКА',
      rosterHeading: 'Твой стиль\nбоя.',
      sheetUrl: 'sprites/chrono_blade_sheet.png',
      stageMode: 'ground',
      opponentSprite: { col: 2, row: 2 },
      cards: [
        { id: 'campaign', name: 'КАМПАНИЯ ZERO', role: '5 секторов, чипы и боссы', tag: 'ОДИНОЧНЫЙ РЕЖИМ', color: '#00f3ff', spriteCol: 0, spriteRow: 0 },
        { id: 'duel_local', name: 'ДУЭЛЬ HOT-SEAT', role: '2 ниндзя на одном экране', tag: '2 ИГРОКА', color: '#ff0055', spriteCol: 2, spriteRow: 1 },
        { id: 'duel_net', name: 'СЕТЬ WEBRTC P2P', role: 'Онлайн-дуэль по коду', tag: 'ОНЛАЙН ДУЭЛЬ', color: '#00ff88', spriteCol: 2, spriteRow: 2 }
      ]
    },
    mecha_siege: {
      eyebrow: '16-БИТНЫЙ ТАКТИЧЕСКИЙ TOWER DEFENSE',
      titleTop: 'MECHA',
      titleBottom: 'SIEGE',
      editionLabel: 'MECHA SIEGE EDITION',
      accent: '#ffb800',
      accentGlow: 'rgba(255, 184, 0, 0.35)',
      subtitle: 'Стальной рубеж.\nНи шагу назад.',
      description: 'Обороняй реакторное ядро от 15 волн шагоходов и боссов-колоссов: 5 типов турелей со специализациями, орбитальный напалм и кооператив.',
      playLabel: 'К ОБОРОНЕ',
      netLabel: 'Кооп по сети',
      setupLabel: 'Арсенал и база',
      rosterEyebrow: 'ТАКТИЧЕСКИЙ РЕЖИМ',
      rosterHeading: 'Выбери\nкомандование.',
      sheetUrl: 'sprites/mecha_siege_sheet.png',
      stageMode: 'topdown',
      opponentSprite: { col: 2, row: 2 },
      cards: [
        { id: 'solo', name: 'ОБОРОНА ЯДРА', role: '15 волн и боссы-колоссы', tag: 'КАМПАНИЯ', color: '#ffb800', spriteCol: 0, spriteRow: 0 },
        { id: 'hotseat', name: 'КООП 2 ИГРОКА', role: 'Совместно на 1 экране', tag: 'HOT-SEAT CO-OP', color: '#00f3ff', spriteCol: 2, spriteRow: 0 },
        { id: 'armory', name: 'АРСЕНАЛ ТУРЕЛЕЙ', role: '5 турелей + ЭМИ и Напалм', tag: 'СПРАВОЧНИК', color: '#00ff88', spriteCol: 3, spriteRow: 0 }
      ]
    },
    worms_armageddon: {
      eyebrow: 'ПОШАГОВАЯ АРТИЛЛЕРИЯ С РАЗРУШАЕМЫМ МИРОМ',
      titleTop: 'WORMS',
      titleBottom: 'ARMAGEDDON',
      editionLabel: 'WORMS EDITION',
      accent: '#ffd32a',
      accentGlow: 'rgba(255, 211, 42, 0.35)',
      subtitle: '34 вида оружия.\nПолное разрушение.',
      description: 'Базука, Святая Граната, Супер-Овца, Верёвка ниндзя, Напалм и Метеоритный шторм. Сражайся против ИИ, вчетвером на одном экране или по сети.',
      playLabel: 'В БОЙ',
      netLabel: 'По сети (QR)',
      setupLabel: 'Настройка матча',
      rosterEyebrow: 'ВЫБЕРИ СЦЕНАРИЙ БИТВЫ',
      rosterHeading: 'Взрывной\nхаос.',
      sheetUrl: 'worms-armageddon/assets/worms-sheet.png',
      stageMode: 'ground',
      opponentRect: [61, 43, 153, 185],
      cards: [
        { id: '1p', name: '1P ПРОТИВ ИИ', role: 'Дуэль против баллистического ИИ', tag: 'БЫСТРЫЙ БОЙ', color: '#ff4757', spriteRect: [41, 567, 180, 172] },
        { id: '2p', name: '2P HOT-SEAT', role: 'Битва вдвоём на одном устройстве', tag: '2 КОМАНДЫ', color: '#48dbfb', spriteRect: [287, 533, 218, 206] },
        { id: '4p', name: '4-TEAM MAYHEM', role: 'Тотальная война 4 армий червяков', tag: '4 КОМАНДЫ', color: '#ffd32a', spriteRect: [1055, 526, 168, 210] }
      ]
    },
    cosmo_junk: {
      eyebrow: 'КООПЕРАТИВНЫЙ КОСМИЧЕСКИЙ СИМУЛЯТОР ЭКИПАЖА',
      titleTop: 'COSMO',
      titleBottom: 'JUNK',
      editionLabel: 'COSMO JUNK EDITION',
      accent: '#57e6e6',
      accentGlow: 'rgba(87, 230, 230, 0.35)',
      subtitle: 'Один корабль.\nЧетыре роли экипажа.',
      description: 'Пилот у штурвала, Инженер у реактора, Стрелок за турелью и Штурман с мануалом. Пустые кресла займут умные ИИ-боты, а встроенный пульт работает прямо на экране.',
      playLabel: 'СОЗДАТЬ КОРАБЛЬ',
      netLabel: 'Пульт экипажа',
      setupLabel: 'Лобби и Зал Славы',
      rosterEyebrow: 'РОЛИ БОРТОВОГО ЭКИПАЖА',
      rosterHeading: 'Выбери\nпост.',
      sheetUrl: 'sprites/cosmo_junk_sheet.png',
      stageMode: 'space',
      cards: [
        { id: 'pilot', name: 'ПИЛОТ', role: 'Штурвал и гиперпрыжок', tag: 'СЛОТ P1 + БОТЫ', color: '#ffb000', spriteCol: 0, spriteRow: 2 },
        { id: 'engineer', name: 'ИНЖЕНЕР', role: 'Пожары и предохранители', tag: 'СЛОТ P2 + БОТЫ', color: '#3bff8f', spriteCol: 1, spriteRow: 2 },
        { id: 'gunner', name: 'КАНОНИР', role: 'Турели и щиты от торпед', tag: 'СЛОТ P3 + БОТЫ', color: '#ff4bd8', spriteCol: 2, spriteRow: 2 },
        { id: 'navigator', name: 'ШТУРМАН', role: 'Расшифровка кодов угроз', tag: 'СЛОТ P4 + БОТЫ', color: '#57e6e6', spriteCol: 3, spriteRow: 2 }
      ]
    }
  };

  const cfg = CONFIGS[gameKey];
  let selectedIdx = 0;
  let animFrame = 0;
  let sheetImg = null;
  let stageSizeObserver = null;
  let stageWidth = 0;
  let stageHeight = 0;
  let lastStageFrame = 0;
  let stageDpr = Math.min(window.devicePixelRatio || 1, 2);
  const STAGE_FRAME_INTERVAL = 1000 / 45;
  let sheetLoaded = false;

  function loadFonts() {
    if (document.getElementById('nhl-google-fonts')) return;
    const link = document.createElement('link');
    link.id = 'nhl-google-fonts';
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@600;700;800&family=Press+Start+2P&family=Space+Grotesk:wght@500;600;700;900&display=swap';
    document.head.appendChild(link);
  }

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
      html.nhl-locked,
      body.nhl-locked {
        overflow: hidden !important;
        height: 100dvh !important;
      }
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
        height: 58px;
        min-height: 58px;
        padding: 0 4.5%;
        gap: 16px;
      }
      .nhl-brand {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        font-family: "JetBrains Mono", Consolas, monospace;
        font-weight: 900;
        font-size: 14px;
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
        gap: 20px;
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
      .nhl-stage {
        position: relative;
        flex: 1 0 auto;
        min-height: 390px;
        height: clamp(390px, 56dvh, 560px);
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
          linear-gradient(90deg, #111216 0%, rgba(17, 18, 22, 0.94) 30%, rgba(17, 18, 22, 0.68) 54%, rgba(17, 18, 22, 0.12) 82%, transparent 100%),
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
        margin: 16px 0 14px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 4px;
        font-family: "Press Start 2P", "JetBrains Mono", Consolas, monospace;
        font-weight: 900;
        font-size: clamp(28px, 4.2vw, 52px);
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
        font-size: clamp(18px, 1.8vw, 24px);
        font-weight: 600;
        line-height: 1.28;
        color: #e8e3db;
        white-space: pre-line;
      }
      .nhl-description {
        margin: 0 0 20px;
        font-size: 12.5px;
        line-height: 1.55;
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
        height: 46px;
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
        background: rgba(24, 24, 30, 0.78);
        border: 1px solid #4e4747;
        color: #d6cac2;
        height: 46px;
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
        background: rgba(38, 36, 46, 0.92);
      }
      .nhl-roster {
        background: #15161b;
        border-top: 1px solid #323039;
        border-bottom: 1px solid #28282e;
        padding: 18px 5.4%;
        display: flex;
        align-items: center;
        gap: 24px;
      }
      .nhl-roster-heading {
        flex: 0 0 17%;
        min-width: 0;
      }
      .nhl-roster-heading .nhl-ro-eyebrow {
        font-family: "JetBrains Mono", Consolas, monospace;
        font-size: 9px;
        letter-spacing: 1.4px;
        color: #7d7c84;
        display: block;
      }
      .nhl-roster-heading h2 {
        margin: 6px 0 0;
        font-size: 20px;
        font-weight: 600;
        line-height: 1.15;
        color: #dedad2;
        white-space: pre-line;
      }
      .nhl-roster-options {
        flex: 1;
        min-width: 0;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
        gap: 12px;
      }
      .nhl-roster-card {
        min-width: 0;
        overflow: hidden;
        background: rgba(24, 25, 32, 0.65);
        border: 1px solid transparent;
        border-bottom: 2px solid #323039;
        padding: 6px 12px 6px 6px;
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
        background: linear-gradient(100deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.01));
      }
      .nhl-portrait {
        width: 72px;
        height: 64px;
        flex-shrink: 0;
        display: block;
      }
      .nhl-card-text {
        display: flex;
        flex-direction: column;
        gap: 4px;
        min-width: 0;
        flex: 1;
      }
      .nhl-card-text strong {
        font-family: "JetBrains Mono", Consolas, monospace;
        font-size: 13.5px;
        font-weight: 800;
        letter-spacing: 0.4px;
        color: #e5e1da;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .nhl-roster-card.selected .nhl-card-text strong {
        color: var(--card-color);
      }
      .nhl-card-text span {
        font-size: 10px;
        color: #96949c;
        line-height: 1.25;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .nhl-card-text small {
        font-family: "JetBrains Mono", Consolas, monospace;
        font-size: 8.5px;
        letter-spacing: 0.7px;
        color: #6d6e77;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .nhl-roster-card.selected .nhl-card-text small {
        color: var(--card-color);
      }
      .nhl-footer {
        padding: 12px 5.4%;
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

      @media (max-width: 760px) {
        .nhl-header {
          height: 48px;
          min-height: 48px;
          padding: 0 4%;
        }
        .nhl-nav {
          gap: 10px;
        }
        .nhl-nav-btn {
          font-size: 11px;
        }
        .nhl-stage {
          min-height: 320px;
          height: 360px;
        }
        .nhl-hero-content {
          top: 7%;
          left: 5%;
          right: 5%;
          max-width: 90%;
        }
        .nhl-title {
          font-size: clamp(22px, 7vw, 34px);
          margin: 10px 0;
        }
        .nhl-subtitle {
          font-size: 16px;
        }
        .nhl-description {
          font-size: 11px;
          margin-bottom: 14px;
        }
        .nhl-btn-primary,
        .nhl-btn-secondary {
          height: 40px;
          font-size: 11.5px;
        }
        .nhl-roster {
          flex-direction: column;
          align-items: stretch;
          gap: 10px;
          padding: 14px 5%;
        }
        .nhl-roster-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .nhl-roster-heading h2 {
          font-size: 16px;
          margin: 0;
          white-space: normal;
        }
        .nhl-roster-options {
          grid-template-columns: 1fr;
          gap: 8px;
        }
        .nhl-footer span:last-child {
          display: none;
        }
      }

      @media (orientation: landscape) and (max-height: 520px) {
        .nhl-header {
          height: 38px;
          min-height: 38px;
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
        .nhl-nav {
          gap: 14px;
        }
        .nhl-nav-btn {
          font-size: 11px;
        }
        .nhl-stage {
          min-height: 200px;
          height: calc(100dvh - 126px);
        }
        .nhl-hero-content {
          top: 5%;
          left: 4%;
          max-width: 56%;
        }
        .nhl-eyebrow {
          font-size: 8.5px;
        }
        .nhl-title {
          font-size: clamp(19px, 3vw, 28px);
          margin: 5px 0;
        }
        .nhl-subtitle {
          font-size: 13.5px;
          margin-bottom: 4px;
          white-space: normal;
        }
        .nhl-description {
          font-size: 10px;
          line-height: 1.3;
          margin-bottom: 8px;
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
          min-width: 138px;
          padding: 0 12px;
          font-size: 10.5px;
        }
        .nhl-btn-secondary {
          height: 34px;
          padding: 0 12px;
          font-size: 10px;
        }
        .nhl-roster {
          padding: 6px 3.5%;
          gap: 10px;
          height: 88px;
          min-height: 88px;
        }
        .nhl-roster-heading {
          flex: 0 0 13%;
        }
        .nhl-roster-heading h2 {
          font-size: 13px;
          margin-top: 2px;
        }
        .nhl-roster-options {
          gap: 6px;
        }
        .nhl-roster-card {
          padding: 4px 6px;
          gap: 5px;
        }
        .nhl-portrait {
          width: 42px;
          height: 40px;
        }
        .nhl-card-text strong {
          font-size: 10.5px;
        }
        .nhl-card-text span {
          font-size: 8px;
        }
        .nhl-card-text small {
          display: none;
        }
        .nhl-footer {
          display: none;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function setBackgroundInert(locked) {
    document.documentElement.classList.toggle('nhl-locked', locked);
    if (document.body) {
      document.body.classList.toggle('nhl-locked', locked);
      Array.from(document.body.children).forEach((child) => {
        if (child.id === 'neo-hero-landing' || child.id === 'neo-landscape-guard-overlay') return;
        try {
          child.inert = locked;
        } catch {}
      });
    }
  }

  function drawSpriteCard(ctx, cardOrRect, dx, dy, dw, dh, flipX, fallbackCol, fallbackRow) {
    if (!sheetLoaded || !sheetImg) return;
    let sx, sy, sw, sh;
    if (cardOrRect && Array.isArray(cardOrRect.spriteRect || cardOrRect)) {
      const rect = cardOrRect.spriteRect || cardOrRect;
      [sx, sy, sw, sh] = rect;
    } else {
      const col = cardOrRect ? cardOrRect.spriteCol : fallbackCol;
      const row = cardOrRect ? cardOrRect.spriteRow : fallbackRow;
      sw = Math.floor((sheetImg.naturalWidth || 1152) / 6);
      sh = Math.floor((sheetImg.naturalHeight || 768) / 4);
      sx = col * sw;
      sy = row * sh;
    }
    const aspect = Math.min(dw / sw, dh / sh);
    const w = sw * aspect;
    const h = sh * aspect;
    const ox = dx + (dw - w) * 0.5;
    const oy = dy + (dh - h) * 0.5;

    ctx.save();
    ctx.imageSmoothingEnabled = true;
    if (flipX) {
      ctx.translate(ox + w, oy);
      ctx.scale(-1, 1);
      ctx.drawImage(sheetImg, sx, sy, sw, sh, 0, 0, w, h);
    } else {
      ctx.drawImage(sheetImg, sx, sy, sw, sh, ox, oy, w, h);
    }
    ctx.restore();
  }

  function renderPortraits() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const canvases = document.querySelectorAll('#neo-hero-landing .nhl-portrait');
    canvases.forEach((cv, idx) => {
      const card = cfg.cards[idx];
      if (!card) return;
      const cw = 72;
      const ch = 64;
      if (cv.width !== cw * dpr || cv.height !== ch * dpr) {
        cv.width = cw * dpr;
        cv.height = ch * dpr;
      }
      const ctx = cv.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cw, ch);
      if (cfg.stageMode === 'ground') {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
        ctx.beginPath();
        ctx.ellipse(cw / 2, ch - 8, 22, 5, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      if (sheetLoaded) {
        drawSpriteCard(ctx, card, 7, 3, 58, 56, false);
      }
    });
  }

  function measureStage(canvas) {
    const rect = canvas.getBoundingClientRect();
    stageWidth = Math.max(320, Math.round(rect.width));
    stageHeight = Math.max(180, Math.round(rect.height));
    stageDpr = Math.min(window.devicePixelRatio || 1, 2);
    const pixelWidth = Math.round(stageWidth * stageDpr);
    const pixelHeight = Math.round(stageHeight * stageDpr);
    if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
      canvas.width = pixelWidth;
      canvas.height = pixelHeight;
    }
  }

  function animateStage(canvas) {
    if (animFrame) {
      cancelAnimationFrame(animFrame);
      animFrame = 0;
    }
    if (stageSizeObserver) stageSizeObserver.disconnect();
    measureStage(canvas);
    if (typeof ResizeObserver === 'function') {
      stageSizeObserver = new ResizeObserver(() => measureStage(canvas));
      stageSizeObserver.observe(canvas);
    } else {
      const measureOnResize = () => measureStage(canvas);
      window.addEventListener('resize', measureOnResize, { passive: true });
    }
    const ctx = canvas.getContext('2d');
    const step = (now) => {
      const overlay = document.getElementById('neo-hero-landing');
      if (!overlay || overlay.classList.contains('nhl-hidden')) {
        animFrame = 0;
        return;
      }
      if (document.hidden) {
        animFrame = requestAnimationFrame(step);
        return;
      }
      if (now - lastStageFrame < STAGE_FRAME_INTERVAL) {
        animFrame = requestAnimationFrame(step);
        return;
      }
      lastStageFrame = now;
      const dpr = stageDpr;
      const w = stageWidth;
      const h = stageHeight;
      if (!w || !h) {
        animFrame = requestAnimationFrame(step);
        return;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const t = now / 1000;
      ctx.clearRect(0, 0, w, h);

      const grad = ctx.createLinearGradient(0, 0, 0, h);
      if (gameKey === 'pixel_drift') {
        grad.addColorStop(0, '#09111f');
        grad.addColorStop(0.6, '#161b33');
        grad.addColorStop(1, '#0b0e18');
      } else if (gameKey === 'chrono_blade') {
        grad.addColorStop(0, '#0b1424');
        grad.addColorStop(0.6, '#19223b');
        grad.addColorStop(1, '#0c101a');
      } else if (gameKey === 'mecha_siege') {
        grad.addColorStop(0, '#1c1512');
        grad.addColorStop(0.6, '#261e19');
        grad.addColorStop(1, '#100e11');
      } else if (gameKey === 'worms_armageddon') {
        grad.addColorStop(0, '#182c44');
        grad.addColorStop(0.6, '#2b4760');
        grad.addColorStop(1, '#16212e');
      } else {
        grad.addColorStop(0, '#050a18');
        grad.addColorStop(0.6, '#0d1933');
        grad.addColorStop(1, '#060a14');
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      const orbX = w * 0.74;
      const orbY = h * 0.44;
      const orbR = Math.min(w, h) * 0.24;
      const orbGrad = ctx.createRadialGradient(orbX, orbY, orbR * 0.1, orbX, orbY, orbR * 1.7);
      orbGrad.addColorStop(0, cfg.accent);
      orbGrad.addColorStop(0.45, cfg.accentGlow);
      orbGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = orbGrad;
      ctx.beginPath();
      ctx.arc(orbX, orbY, orbR * 1.7, 0, Math.PI * 2);
      ctx.fill();

      // Perspective stage treatment matches game perspective (space/top-down vs ground horizon)
      const horizonY = h * 0.78;
      if (cfg.stageMode === 'space') {
        for (let i = 0; i < 42; i++) {
          const sx = ((i * 97 + t * (10 + (i % 5) * 6)) % (w + 20)) - 10;
          const sy = (i * 59) % h;
          ctx.fillStyle = i % 3 === 0 ? 'rgba(186, 230, 253, 0.75)' : 'rgba(125, 211, 252, 0.35)';
          ctx.fillRect(w - sx, sy, i % 5 === 0 ? 2 : 1.5, i % 5 === 0 ? 2 : 1.5);
        }
      } else if (cfg.stageMode === 'topdown') {
        ctx.strokeStyle = cfg.accentGlow;
        ctx.lineWidth = 1;
        const stepGrid = 36;
        const gxOff = (t * 28) % stepGrid;
        for (let gx = w * 0.42 - gxOff; gx < w; gx += stepGrid) {
          ctx.beginPath();
          ctx.moveTo(gx, 0);
          ctx.lineTo(gx, h);
          ctx.stroke();
        }
        for (let gy = 0; gy < h; gy += stepGrid) {
          ctx.beginPath();
          ctx.moveTo(w * 0.42, gy);
          ctx.lineTo(w, gy);
          ctx.stroke();
        }
      } else {
        ctx.fillStyle = 'rgba(12, 15, 22, 0.85)';
        ctx.fillRect(0, horizonY, w, h - horizonY);
        ctx.strokeStyle = cfg.accent;
        ctx.globalAlpha = 0.3;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, horizonY);
        ctx.lineTo(w, horizonY);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      if (sheetLoaded) {
        const card = cfg.cards[selectedIdx] || cfg.cards[0];
        const heroSize = Math.round(Math.min(w * 0.22, h * 0.56, 196));
        const bob1 = Math.sin(t * 3.4) * 6;
        const bob2 = Math.cos(t * 3.1) * 5;

        if (gameKey === 'cosmo_junk') {
          const sx1 = Math.round(w * 0.65 - heroSize / 2);
          const sy1 = Math.round(h * 0.48 - heroSize / 2 + bob1);
          const px2 = Math.round(w * 0.85 - heroSize * 0.42);
          const py2 = Math.round(h * 0.42 - heroSize * 0.42 + bob2);
          drawSpriteCard(ctx, { spriteCol: 1, spriteRow: 1 }, w * 0.77, h * 0.70 + bob2 * 0.6, 56, 56, false);
          drawSpriteCard(ctx, { spriteCol: 1, spriteRow: 0 }, sx1, sy1, heroSize, heroSize, false);
          drawSpriteCard(ctx, { spriteCol: 2, spriteRow: 0 }, px2, py2, heroSize * 0.82, heroSize * 0.82, true);
        } else {
          const hx1 = Math.round(w * 0.65 - heroSize / 2);
          const hx2 = Math.round(w * 0.85 - heroSize / 2);
          const hy1 = cfg.stageMode === 'ground' ? Math.round(horizonY - heroSize * 0.84 + bob1) : Math.round(h * 0.50 - heroSize * 0.5 + bob1);
          const hy2 = cfg.stageMode === 'ground' ? Math.round(horizonY - heroSize * 0.80 + bob2) : Math.round(h * 0.48 - heroSize * 0.5 + bob2);

          if (cfg.stageMode === 'ground') {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
            ctx.beginPath();
            ctx.ellipse(hx1 + heroSize / 2, horizonY + 6, heroSize * 0.34, 9, 0, 0, Math.PI * 2);
            ctx.ellipse(hx2 + heroSize / 2, horizonY + 6, heroSize * 0.32, 9, 0, 0, Math.PI * 2);
            ctx.fill();
          }

          drawSpriteCard(ctx, card, hx1, hy1, heroSize, heroSize, false);
          const opp = cfg.opponentRect
            ? cfg.opponentRect
            : cfg.opponentSprite
              ? { spriteCol: cfg.opponentSprite.col, spriteRow: cfg.opponentSprite.row }
              : cfg.cards[(selectedIdx + 1) % cfg.cards.length];
          drawSpriteCard(ctx, opp, hx2, hy2, Math.round(heroSize * 0.92), Math.round(heroSize * 0.92), true);
        }
      }

      animFrame = requestAnimationFrame(step);
    };
    animFrame = requestAnimationFrame(step);
  }

  function showHero() {
    const el = document.getElementById('neo-hero-landing');
    if (el) {
      el.classList.remove('nhl-hidden');
      setBackgroundInert(true);
      const stageCanvas = el.querySelector('#nhl-stage-canvas');
      if (stageCanvas) animateStage(stageCanvas);
    }
  }

  function hideHero() {
    const el = document.getElementById('neo-hero-landing');
    if (el) el.classList.add('nhl-hidden');
    setBackgroundInert(false);
    if (animFrame) {
      cancelAnimationFrame(animFrame);
      animFrame = 0;
    }
    if (stageSizeObserver) {
      stageSizeObserver.disconnect();
      stageSizeObserver = null;
    }
  }

  function applyCardSelection(idx) {
    selectedIdx = idx;
    const cards = document.querySelectorAll('#neo-hero-landing .nhl-roster-card');
    cards.forEach((c, i) => c.classList.toggle('selected', i === idx));

    try {
      if (gameKey === 'pixel_drift') {
        if (window.PixelDriftHeroAPI && window.PixelDriftHeroAPI.selectCar) {
          window.PixelDriftHeroAPI.selectCar(idx);
        }
      } else if (gameKey === 'worms_armageddon') {
        const presetId = cfg.cards[idx].id;
        const btn = document.querySelector(`.preset-btn[data-preset="${presetId}"]`);
        if (btn) btn.click();
      } else if (gameKey === 'cosmo_junk') {
        try {
          window.sessionStorage.setItem('cj_preferred_role', cfg.cards[idx].id);
        } catch {}
      }
    } catch {}
  }

  function handlePrimaryPlay() {
    const card = cfg.cards[selectedIdx] || cfg.cards[0];
    hideHero();
    try {
      if (gameKey === 'pixel_drift') {
        if (window.PixelDriftHeroAPI) {
          window.PixelDriftHeroAPI.selectCar(selectedIdx);
          window.PixelDriftHeroAPI.startRace();
        }
      } else if (gameKey === 'chrono_blade') {
        if (window.Game) {
          if (card.id === 'duel_net' && Game.openNetworkModal) Game.openNetworkModal();
          else if (Game.startMode) Game.startMode(card.id === 'duel_local' ? 'duel_local' : 'campaign');
        }
      } else if (gameKey === 'mecha_siege') {
        if (window.Game) {
          if (card.id === 'armory' && Game.openArmory) Game.openArmory();
          else if (Game.startMode) Game.startMode(card.id === 'hotseat' ? 'hotseat' : 'solo');
        }
      } else if (gameKey === 'worms_armageddon') {
        const startBtn = document.getElementById('btn-start-match');
        if (startBtn) startBtn.click();
      } else if (gameKey === 'cosmo_junk') {
        if (window.CosmoJunkHeroAPI && window.CosmoJunkHeroAPI.startShip) {
          window.CosmoJunkHeroAPI.startShip(card.id);
        } else {
          const createBtn = document.querySelector('#root button.pxl-btn.bg-amber-400');
          if (createBtn) createBtn.click();
        }
      }
    } catch {}
  }

  function handleNetworkPlay() {
    hideHero();
    try {
      if (gameKey === 'pixel_drift') {
        if (window.PixelDriftHeroAPI) window.PixelDriftHeroAPI.openNetwork();
      } else if (gameKey === 'chrono_blade') {
        if (window.Game && Game.openNetworkModal) Game.openNetworkModal();
      } else if (gameKey === 'mecha_siege') {
        if (window.Game && Game.openNetworkModal) Game.openNetworkModal();
      } else if (gameKey === 'worms_armageddon') {
        const onlineTab = document.getElementById('tab-online');
        if (onlineTab) onlineTab.click();
      } else if (gameKey === 'cosmo_junk') {
        if (window.CosmoJunkHeroAPI && window.CosmoJunkHeroAPI.openDeck) {
          window.CosmoJunkHeroAPI.openDeck();
        } else {
          const deckBtn = document.getElementById('cj-btn-deck');
          if (deckBtn) deckBtn.click();
        }
      }
    } catch {}
  }

  function handleSetupOpen() {
    hideHero();
    try {
      if (gameKey === 'mecha_siege' && window.Game && Game.openArmory) {
        Game.openArmory();
      } else if (gameKey === 'cosmo_junk' && window.CosmoJunkHeroAPI && window.CosmoJunkHeroAPI.openLobby) {
        window.CosmoJunkHeroAPI.openLobby();
      }
    } catch {}
  }

  function buildHeroDOM() {
    if (hasAutoRoom() || document.getElementById('neo-hero-landing')) return;
    loadFonts();
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
              <canvas class="nhl-portrait" width="72" height="64"></canvas>
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
        <span>NEO-CARTRIDGE // ${cfg.editionLabel}</span>
      </footer>
    `;

    document.body.appendChild(wrap);
    setBackgroundInert(true);

    wrap.querySelector('#nhl-btn-play').addEventListener('click', handlePrimaryPlay);
    wrap.querySelector('#nhl-btn-net').addEventListener('click', handleNetworkPlay);
    wrap.querySelector('#nhl-nav-setup').addEventListener('click', handleSetupOpen);
    wrap.querySelector('#nhl-nav-net').addEventListener('click', handleNetworkPlay);

    wrap.querySelectorAll('.nhl-roster-card').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-idx') || '0', 10);
        applyCardSelection(idx);
      });
    });

    window.addEventListener('keydown', (e) => {
      const hero = document.getElementById('neo-hero-landing');
      if (!hero || hero.classList.contains('nhl-hidden')) return;
      if (e.key === 'Enter') {
        e.preventDefault();
        e.stopImmediatePropagation();
        handlePrimaryPlay();
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        e.stopImmediatePropagation();
        const dir = e.key === 'ArrowRight' ? 1 : -1;
        applyCardSelection((selectedIdx + dir + cfg.cards.length) % cfg.cards.length);
      } else if (e.key === ' ') {
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    }, true);

    window.addEventListener('hashchange', () => {
      if (hasAutoRoom()) hideHero();
    });

    const stageCanvas = wrap.querySelector('#nhl-stage-canvas');
    if (stageCanvas) animateStage(stageCanvas);
    renderPortraits();
  }

  window.NeoHeroLanding = {
    show: () => {
      const el = document.getElementById('neo-hero-landing');
      if (el) {
        showHero();
      } else {
        buildHeroDOM();
      }
    },
    hide: hideHero
  };
  window.NeoHeroScreen = window.NeoHeroLanding;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildHeroDOM);
  } else {
    buildHeroDOM();
  }
})();
