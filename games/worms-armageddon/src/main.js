import { PHASES, TEAM_PALETTES, WORLD_H, WORLD_W } from './constants.js';
import { GameEngine } from './game.js';
import { OnlineClient } from './net.js';
import { renderQRToCanvas } from './qr.js';
import { Renderer } from './renderer.js';
import { sprites } from './sprites.js';
import { Terrain } from './terrain.js';
import { WEAPON_MAP, WEAPONS } from './weapons.js';

const canvas = document.getElementById('game-canvas');
const minimapCanvas = document.getElementById('minimap-canvas');
const previewCanvas = document.getElementById('preview-canvas');
const qrCanvas = document.getElementById('qr-canvas');

const hudTop = document.getElementById('hud-top');
const hudBottom = document.getElementById('hud-bottom');
const turnBanner = document.getElementById('turn-banner');
const weaponPanel = document.getElementById('weapon-panel');
const weaponGrid = document.getElementById('weapon-grid');
const weaponDescTitle = document.getElementById('weapon-desc-title');
const weaponDescText = document.getElementById('weapon-desc-text');

const setupOverlay = document.getElementById('setup-overlay');
const helpModal = document.getElementById('help-modal');
const pauseModal = document.getElementById('pause-modal');
const btnPause = document.getElementById('btn-pause');
const gameoverModal = document.getElementById('gameover-modal');

const hudTeamDot = document.getElementById('hud-team-dot');
const hudActiveTeam = document.getElementById('hud-active-team');
const hudActiveWorm = document.getElementById('hud-active-worm');
const hudWeaponChip = document.getElementById('hud-weapon-chip');
const hudWeaponIcon = document.getElementById('hud-weapon-icon');
const hudWeaponName = document.getElementById('hud-weapon-name');
const hudWeaponAmmo = document.getElementById('hud-weapon-ammo');
const hudFuseControls = document.getElementById('hud-fuse-controls');
const hudJetpackFuel = document.getElementById('hud-jetpack-fuel');
const hudFuelFill = document.getElementById('hud-fuel-fill');

const hudPhaseLabel = document.getElementById('hud-phase-label');
const hudTimer = document.getElementById('hud-timer');
const hudWindVal = document.getElementById('hud-wind-val');
const hudWindFill = document.getElementById('hud-wind-fill');
const hudSuddenDeath = document.getElementById('hud-sudden-death');
const hudOnlineBadge = document.getElementById('hud-online-badge');
const teamBarsEl = document.getElementById('team-bars');
const mobileSpecialBar = document.getElementById('mobile-special-bar');
const btnMinimapToggle = document.getElementById('btn-minimap-toggle');
const btnMobileMenu = document.getElementById('btn-mobile-menu');
const minimapFrame = document.querySelector('.minimap-frame');
const toolbarBtns = document.querySelector('.toolbar-btns');

const teamRosterEl = document.getElementById('team-roster');
const teamCountLabel = document.getElementById('team-count-label');

// Online & Mode UI elements
const tabLocal = document.getElementById('tab-local');
const tabOnline = document.getElementById('tab-online');
const localSection = document.getElementById('local-section');
const onlineSection = document.getElementById('online-section');
const subtabHost = document.getElementById('subtab-host');
const subtabJoin = document.getElementById('subtab-join');
const onlineHostPane = document.getElementById('online-host-pane');
const onlineJoinPane = document.getElementById('online-join-pane');
const onlineHostNameInput = document.getElementById('online-host-name');
const onlineGuestNameInput = document.getElementById('online-guest-name');
const btnCreateRoom = document.getElementById('btn-create-room');
const hostRoomCard = document.getElementById('host-room-card');
const roomCodeDisplay = document.getElementById('room-code-display');
const btnCopyCode = document.getElementById('btn-copy-code');
const onlineAddrSelect = document.getElementById('online-addr-select');
const inviteLinkText = document.getElementById('invite-link-text');
const btnCopyLink = document.getElementById('btn-copy-link');
const btnCloseRoom = document.getElementById('btn-close-room');
const hostStatusEl = document.getElementById('host-status');
const joinCodeInput = document.getElementById('join-code-input');
const btnJoinRoom = document.getElementById('btn-join-room');
const btnLeaveRoom = document.getElementById('btn-leave-room');
const joinStatusEl = document.getElementById('join-status');
const setupTipsEl = document.getElementById('setup-tips');
const btnStartMatch = document.getElementById('btn-start-match');
const btnPlayAgain = document.getElementById('btn-play-again');
const btnRerollMap = document.getElementById('btn-reroll-map');

// Setup state
const setupState = {
  mode: 'local', // 'local' | 'online'
  onlineSubMode: 'host', // 'host' | 'join'
  theme: 'meadow',
  seed: 42069,
  teamCount: 2,
  guestName: 'Синий взвод',
  hostName: 'Красная бригада',
  hasSameOriginApi: false,
  networkAddresses: [{ name: 'Текущий сервер', url: window.location.origin, kind: 'local' }],
  teams: [
    { name: TEAM_PALETTES[0].name, control: 'human' },
    { name: TEAM_PALETTES[1].name, control: 'ai-normal' },
    { name: TEAM_PALETTES[2].name, control: 'ai-normal' },
    { name: TEAM_PALETTES[3].name, control: 'ai-hard' },
  ],
};

const renderer = new Renderer(canvas);
const online = new OnlineClient();
const game = new GameEngine({
  onHudUpdate: updateHud,
  onGameOver: showGameOver,
  onNetEvent: (msg) => {
    if (online.role === 'host') {
      online.send(msg);
    }
  },
});

window.__WORMS_GAME__ = game;
window.__WORMS_NET__ = online;

// --- Network / Online Setup Helpers ---
function extractRoomCode(raw) {
  const s = String(raw || '').trim();
  const match = s.match(/[?&]room=([A-Za-z0-9]+)/i);
  if (match) return match[1].toUpperCase().slice(0, 8);
  return s.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 8);
}

function getInviteUrl() {
  const base = (onlineAddrSelect.value || window.location.origin).replace(/\/$/, '');
  const code = online.roomCode || '';
  if (setupState.hasSameOriginApi || (online.serverUrl && !online.serverUrl.startsWith(window.location.origin))) {
    return `${base}/?room=${code}`;
  }
  return `${base}${window.location.pathname}?room=${code}`;
}

function refreshInviteAndQR() {
  if (online.role !== 'host' || !online.roomCode) return;
  const url = getInviteUrl();
  roomCodeDisplay.textContent = online.roomCode;
  inviteLinkText.textContent = url;
  try {
    renderQRToCanvas(qrCanvas, url, 4);
  } catch {
    const ctx = qrCanvas.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, qrCanvas.width, qrCanvas.height);
  }
}

async function loadNetworkAddresses() {
  let loaded = false;
  const proto = window.location.protocol;
  const host = window.location.hostname || '';
  const isLocalHost =
    proto === 'file:' ||
    host === 'localhost' ||
    host === '127.0.0.1' ||
    /^(192\.168\.|10\.|172\.(1[6-9]|2\d|3[0-1])\.)/.test(host);

  if (isLocalHost && proto !== 'file:' && (window.location.pathname === '/' || window.location.pathname === '/index.html')) {
    try {
      const res = await fetch('/api/network-info', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.addresses) && data.addresses.length > 0) {
          setupState.networkAddresses = data.addresses;
          setupState.hasSameOriginApi = true;
          online.serverUrl = null;
          loaded = true;
        }
      }
    } catch {
      // Fall through to WebRTC P2P / local probe
    }
  }

  if (!loaded && proto === 'file:') {
    online.serverUrl = 'http://127.0.0.1:4174';
    setupState.networkAddresses = [
      { name: 'Local Worms Server', ip: '127.0.0.1', url: 'http://127.0.0.1:4174', kind: 'local' },
    ];
  } else if (!loaded) {
    online.serverUrl = null;
    setupState.networkAddresses = [
      { name: window.location.host || 'WebRTC P2P', ip: window.location.host || 'p2p', url: window.location.origin, kind: 'web' },
    ];
  }

  onlineAddrSelect.innerHTML = '';
  for (const item of setupState.networkAddresses) {
    const opt = document.createElement('option');
    opt.value = item.url;
    const tag = item.kind === 'lan' ? 'Wi-Fi / LAN' : item.kind === 'vpn' ? 'VPN' : item.kind === 'web' ? 'WebRTC P2P' : 'Локальный';
    opt.textContent = `[${tag}] ${item.name} (${item.ip || item.url})`;
    onlineAddrSelect.appendChild(opt);
  }
  refreshInviteAndQR();
}

function getLobbyState() {
  return {
    hostName: onlineHostNameInput.value.trim() || TEAM_PALETTES[0].name,
    theme: setupState.theme,
    seed: setupState.seed,
    wormsPerTeam: Number(document.getElementById('opt-worms').value),
    startHp: Number(document.getElementById('opt-hp').value),
    turnTime: Number(document.getElementById('opt-turn').value),
    suddenDeathTurns: Number(document.getElementById('opt-sd').value),
  };
}

function applyLobbyStateToGuestUI(lobby) {
  if (!lobby) return;
  if (lobby.hostName) setupState.hostName = lobby.hostName;
  if (lobby.theme) {
    setupState.theme = lobby.theme;
    document.querySelectorAll('.theme-btn').forEach((b) => {
      b.classList.toggle('active', b.dataset.theme === setupState.theme);
    });
  }
  if (typeof lobby.seed === 'number') setupState.seed = lobby.seed;
  if (lobby.wormsPerTeam) document.getElementById('opt-worms').value = String(lobby.wormsPerTeam);
  if (lobby.startHp) document.getElementById('opt-hp').value = String(lobby.startHp);
  if (lobby.turnTime) document.getElementById('opt-turn').value = String(lobby.turnTime);
  if (lobby.suddenDeathTurns !== undefined) document.getElementById('opt-sd').value = String(lobby.suddenDeathTurns);
  renderMapPreview();
}

function syncLobbyIfHost() {
  if (online.role === 'host') {
    online.send({ type: 'lobby_state', lobbyState: getLobbyState() });
  }
}

function updateSetupControlsState() {
  const isOnline = setupState.mode === 'online';
  const isHostTab = isOnline && setupState.onlineSubMode === 'host';
  const isJoinTab = isOnline && setupState.onlineSubMode === 'join';

  tabLocal.classList.toggle('active', !isOnline);
  tabOnline.classList.toggle('active', isOnline);
  localSection.classList.toggle('hidden', isOnline);
  onlineSection.classList.toggle('hidden', !isOnline);
  setupTipsEl.classList.toggle('hidden', isOnline);

  subtabHost.classList.toggle('active', isHostTab);
  subtabJoin.classList.toggle('active', isJoinTab);
  onlineHostPane.classList.toggle('hidden', !isHostTab);
  onlineJoinPane.classList.toggle('hidden', !isJoinTab);

  // Lock map/options on Guest join screen so Host controls match settings
  const lockSettings = isJoinTab;
  document.querySelectorAll('.theme-btn').forEach((b) => (b.disabled = lockSettings));
  btnRerollMap.disabled = lockSettings;
  document.getElementById('opt-worms').disabled = lockSettings;
  document.getElementById('opt-hp').disabled = lockSettings;
  document.getElementById('opt-turn').disabled = lockSettings;
  document.getElementById('opt-sd').disabled = lockSettings;

  if (!isOnline) {
    btnStartMatch.textContent = 'НАЧАТЬ БОЙ';
    btnStartMatch.disabled = false;
  } else if (isHostTab) {
    btnStartMatch.textContent = 'НАЧАТЬ СЕТЕВОЙ БОЙ';
    btnStartMatch.disabled = !(online.role === 'host' && online.peerConnected);
    btnCreateRoom.classList.toggle('hidden', online.role === 'host');
    hostRoomCard.classList.toggle('hidden', online.role !== 'host');
  } else {
    btnStartMatch.textContent = online.role === 'guest' ? 'ЖДЁМ СТАРТ ХОСТА...' : 'СНАЧАЛА ВОЙДИТЕ В КОМНАТУ';
    btnStartMatch.disabled = true;
    btnJoinRoom.classList.toggle('hidden', online.role === 'guest');
    btnLeaveRoom.classList.toggle('hidden', online.role !== 'guest');
  }
}

function setStatusBox(el, text, mode = 'info') {
  el.textContent = text;
  el.classList.remove('hidden', 'ready', 'error');
  if (mode === 'ready') el.classList.add('ready');
  if (mode === 'error') el.classList.add('error');
}

function copyText(text, btn, originalLabel) {
  const finish = () => {
    btn.textContent = 'Скопировано!';
    setTimeout(() => {
      btn.textContent = originalLabel;
    }, 1300);
  };
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).then(finish).catch(() => {});
  } else {
    const tmp = document.createElement('textarea');
    tmp.value = text;
    document.body.appendChild(tmp);
    tmp.select();
    try {
      document.execCommand('copy');
      finish();
    } catch {
      // Ignore fallback error
    }
    tmp.remove();
  }
}

tabLocal.addEventListener('click', () => {
  if (online.role !== 'none') {
    online.closeRoom();
    game.setNetworkMode('local', -1);
  }
  setupState.mode = 'local';
  updateSetupControlsState();
});

tabOnline.addEventListener('click', () => {
  setupState.mode = 'online';
  updateSetupControlsState();
});

subtabHost.addEventListener('click', () => {
  if (online.role === 'guest') {
    online.closeRoom();
    game.setNetworkMode('local', -1);
  }
  setupState.onlineSubMode = 'host';
  updateSetupControlsState();
});

subtabJoin.addEventListener('click', () => {
  if (online.role === 'host') {
    online.closeRoom();
    game.setNetworkMode('local', -1);
  }
  setupState.onlineSubMode = 'join';
  updateSetupControlsState();
});

onlineAddrSelect.addEventListener('change', refreshInviteAndQR);
onlineHostNameInput.addEventListener('input', syncLobbyIfHost);
['opt-worms', 'opt-hp', 'opt-turn', 'opt-sd'].forEach((id) => {
  document.getElementById(id).addEventListener('change', syncLobbyIfHost);
});

btnCreateRoom.addEventListener('click', async () => {
  game.sound.unlock();
  const hostName = onlineHostNameInput.value.trim() || TEAM_PALETTES[0].name;
  setupState.hostName = hostName;
  if (!setupState.hasSameOriginApi && !online.serverUrl && window.location.protocol === 'file:') {
    await loadNetworkAddresses();
  }
  online.preferLocalWs = Boolean(setupState.hasSameOriginApi);
  try {
    await online.createRoom(hostName, getLobbyState());
    game.setNetworkMode('host', 0);
    setStatusBox(hostStatusEl, 'Ожидаем игрока 2 по коду или QR...', 'info');
    refreshInviteAndQR();
    updateSetupControlsState();
  } catch (err) {
    setStatusBox(hostStatusEl, `Не удалось создать комнату: ${err.message}`, 'error');
    hostRoomCard.classList.remove('hidden');
  }
});

btnCloseRoom.addEventListener('click', () => {
  online.closeRoom();
  game.setNetworkMode('local', -1);
  updateSetupControlsState();
});

btnCopyCode.addEventListener('click', () => {
  if (online.roomCode) copyText(online.roomCode, btnCopyCode, 'Копировать код');
});

btnCopyLink.addEventListener('click', () => {
  if (online.roomCode) copyText(getInviteUrl(), btnCopyLink, 'Копировать ссылку');
});

async function handleJoinRoom() {
  game.sound.unlock();
  const code = extractRoomCode(joinCodeInput.value);
  if (!code) {
    setStatusBox(joinStatusEl, 'Введите корректный 6-значный код комнаты.', 'error');
    return;
  }
  joinCodeInput.value = code;
  const guestName = onlineGuestNameInput.value.trim() || TEAM_PALETTES[1].name;
  setupState.guestName = guestName;
  setStatusBox(joinStatusEl, `Подключение к комнате ${code}...`, 'info');
  if (!setupState.hasSameOriginApi && !online.serverUrl && window.location.protocol === 'file:') {
    await loadNetworkAddresses();
  }
  online.preferLocalWs = Boolean(setupState.hasSameOriginApi);
  try {
    const res = await online.joinRoom(code, guestName);
    game.setNetworkMode('guest', 1);
    setupState.hostName = res.hostName || TEAM_PALETTES[0].name;
    if (res.lobbyState) applyLobbyStateToGuestUI(res.lobbyState);
    setStatusBox(
      joinStatusEl,
      `Подключено к ${setupState.hostName} (${res.code})! Ждём старт хоста...`,
      'ready'
    );
    updateSetupControlsState();
  } catch (err) {
    setStatusBox(joinStatusEl, `Не удалось войти: ${err.message}`, 'error');
    updateSetupControlsState();
  }
}

btnJoinRoom.addEventListener('click', handleJoinRoom);
btnLeaveRoom.addEventListener('click', () => {
  online.closeRoom();
  game.setNetworkMode('local', -1);
  joinStatusEl.classList.add('hidden');
  updateSetupControlsState();
});

onlineGuestNameInput.addEventListener('input', () => {
  if (online.role === 'guest') {
    const guestName = onlineGuestNameInput.value.trim() || TEAM_PALETTES[1].name;
    setupState.guestName = guestName;
    online.send({ type: 'guest_info', guestName });
  }
});

// Handle incoming WebSocket events
online.onMessage = (msg) => {
  switch (msg.type) {
    case 'guest_joined':
      setupState.guestName = msg.guestName || TEAM_PALETTES[1].name;
      setStatusBox(hostStatusEl, `Игрок 2 подключён: ${setupState.guestName}! Можно начинать.`, 'ready');
      syncLobbyIfHost();
      updateSetupControlsState();
      break;
    case 'guest_info':
      if (msg.guestName) {
        setupState.guestName = msg.guestName;
        setStatusBox(hostStatusEl, `Игрок 2 подключён: ${setupState.guestName}! Можно начинать.`, 'ready');
      }
      break;
    case 'guest_left':
      setStatusBox(hostStatusEl, 'Игрок 2 отключился. Ожидаем переподключения...', 'error');
      if (game.phase !== PHASES.SETUP && game.phase !== PHASES.GAME_OVER) {
        game.showBanner('Игрок 2 отключился!', '#ff4757', 3.0);
      }
      updateSetupControlsState();
      break;
    case 'lobby_state':
      if (online.role === 'guest') {
        applyLobbyStateToGuestUI(msg.lobbyState);
      }
      break;
    case 'room_closed':
      game.setNetworkMode('local', -1);
      if (game.phase === PHASES.SETUP) {
        setStatusBox(joinStatusEl, 'Хост закрыл комнату.', 'error');
        updateSetupControlsState();
      } else {
        returnToSetupScreen('Хост закрыл комнату.');
      }
      break;
    case 'match_start':
      if (online.role === 'guest' && msg.config) {
        enterBattleScreen();
        game.startGuestMatch(msg.config);
        renderWeaponGrid();
        updateHud(game);
      }
      break;
    case 'terrain_op':
      if (online.role === 'guest') {
        game.applyTerrainOp(msg);
      }
      break;
    case 'fx_event':
      if (online.role === 'guest') {
        game.applyFxEvent(msg.fx);
      }
      break;
    case 'state':
      if (online.role === 'guest') {
        game.applySnapshot(msg.snap);
      }
      break;
    case 'game_over':
      if (online.role === 'guest') {
        game.applyRemoteGameOver(msg);
      }
      break;
    case 'input_state':
      if (online.role === 'host') {
        game.applyRemoteInput(msg.input);
      }
      break;
    case 'aim':
      if (online.role === 'host') {
        game.applyRemoteAim(msg);
      }
      break;
    case 'action':
      if (online.role === 'host') {
        game.applyRemoteAction(msg.action);
      }
      break;
    default:
      break;
  }
};

online.onClose = () => {
  if (game.netRole !== 'local') {
    game.setNetworkMode('local', -1);
    if (game.phase === PHASES.SETUP) {
      updateSetupControlsState();
    } else {
      returnToSetupScreen('Соединение потеряно.');
    }
  }
};

// --- Setup Screen UI ---
function renderMapPreview() {
  const terrain = new Terrain(WORLD_W, WORLD_H, setupState.theme, setupState.seed);
  const ctx = previewCanvas.getContext('2d');
  const w = previewCanvas.width;
  const h = previewCanvas.height;

  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, terrain.theme.skyTop);
  grad.addColorStop(0.6, terrain.theme.skyMid);
  grad.addColorStop(1, terrain.theme.skyBottom);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  if (terrain.canvas) {
    ctx.drawImage(terrain.canvas, 0, 0, w, h);
  }
  ctx.fillStyle = terrain.theme.waterTop;
  const wy = (815 / WORLD_H) * h;
  ctx.fillRect(0, wy, w, h - wy);
}

function renderTeamRoster() {
  teamCountLabel.textContent = String(setupState.teamCount);
  teamRosterEl.innerHTML = '';

  for (let i = 0; i < setupState.teamCount; i++) {
    const t = setupState.teams[i];
    const palette = TEAM_PALETTES[i];
    const row = document.createElement('div');
    row.className = 'team-row';

    const swatch = document.createElement('span');
    swatch.className = 'team-swatch';
    swatch.style.background = palette.color;

    const input = document.createElement('input');
    input.type = 'text';
    input.maxLength = 18;
    input.value = t.name;
    input.addEventListener('input', () => {
      t.name = input.value.trim() || palette.name;
    });

    const select = document.createElement('select');
    const options = [
      { val: 'human', label: 'Игрок' },
      { val: 'ai-easy', label: 'ИИ (Лёгкий)' },
      { val: 'ai-normal', label: 'ИИ (Средний)' },
      { val: 'ai-hard', label: 'ИИ (Сложный)' },
    ];
    for (const o of options) {
      const opt = document.createElement('option');
      opt.value = o.val;
      opt.textContent = o.label;
      if (o.val === t.control) opt.selected = true;
      select.appendChild(opt);
    }
    select.addEventListener('change', () => {
      t.control = select.value;
    });

    row.append(swatch, input, select);
    teamRosterEl.appendChild(row);
  }

  document.querySelectorAll('.small-btn[data-teams]').forEach((btn) => {
    btn.classList.toggle('active', Number(btn.dataset.teams) === setupState.teamCount);
  });
}

document.querySelectorAll('.preset-btn[data-preset]').forEach((btn) => {
  btn.addEventListener('click', () => {
    game.sound.unlock();
    const p = btn.dataset.preset;
    document.querySelectorAll('.preset-btn[data-preset]').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');

    if (p === '1p') {
      setupState.teamCount = 2;
      setupState.teams[0].control = 'human';
      setupState.teams[1].control = 'ai-normal';
    } else if (p === '2p') {
      setupState.teamCount = 2;
      setupState.teams[0].control = 'human';
      setupState.teams[1].control = 'human';
    } else {
      setupState.teamCount = 4;
      setupState.teams[0].control = 'human';
      setupState.teams[1].control = 'ai-normal';
      setupState.teams[2].control = 'ai-normal';
      setupState.teams[3].control = 'ai-hard';
    }
    renderTeamRoster();
  });
});

document.querySelectorAll('.small-btn[data-teams]').forEach((btn) => {
  btn.addEventListener('click', () => {
    setupState.teamCount = Number(btn.dataset.teams);
    renderTeamRoster();
  });
});

document.querySelectorAll('.theme-btn[data-theme]').forEach((btn) => {
  btn.addEventListener('click', () => {
    setupState.theme = btn.dataset.theme;
    document.querySelectorAll('.theme-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    renderMapPreview();
    syncLobbyIfHost();
  });
});

btnRerollMap.addEventListener('click', () => {
  setupState.seed = Math.floor(Math.random() * 9999999);
  renderMapPreview();
  syncLobbyIfHost();
});

function buildMatchConfigFromSetup(newSeed = false) {
  if (newSeed) {
    setupState.seed = Math.floor(Math.random() * 9999999);
  }
  if (online.role === 'host') {
    const hostName = onlineHostNameInput.value.trim() || TEAM_PALETTES[0].name;
    const guestName = setupState.guestName || TEAM_PALETTES[1].name;
    return {
      theme: setupState.theme,
      seed: setupState.seed,
      wormsPerTeam: Number(document.getElementById('opt-worms').value),
      startHp: Number(document.getElementById('opt-hp').value),
      turnTime: Number(document.getElementById('opt-turn').value),
      suddenDeathTurns: Number(document.getElementById('opt-sd').value),
      teams: [
        { name: hostName, isAI: false, aiDifficulty: 'normal' },
        { name: guestName, isAI: false, aiDifficulty: 'normal' },
      ],
    };
  }
  const teams = [];
  for (let i = 0; i < setupState.teamCount; i++) {
    const c = setupState.teams[i].control;
    teams.push({
      name: setupState.teams[i].name || TEAM_PALETTES[i].name,
      isAI: c !== 'human',
      aiDifficulty: c.startsWith('ai-') ? c.slice(3) : 'normal',
    });
  }
  return {
    theme: setupState.theme,
    seed: setupState.seed,
    wormsPerTeam: Number(document.getElementById('opt-worms').value),
    startHp: Number(document.getElementById('opt-hp').value),
    turnTime: Number(document.getElementById('opt-turn').value),
    suddenDeathTurns: Number(document.getElementById('opt-sd').value),
    teams,
  };
}

function isCompactViewport() {
  return (
    window.innerWidth <= 920 ||
    window.innerHeight <= 520 ||
    Boolean(window.matchMedia?.('(pointer: coarse)')?.matches)
  );
}

function closeMobileOverlays() {
  minimapFrame?.classList.remove('mobile-open');
  toolbarBtns?.classList.remove('mobile-open');
  btnMinimapToggle?.classList.remove('active');
  btnMobileMenu?.classList.remove('active');
}

function syncModalBodyClass() {
  const isOpen =
    !weaponPanel.classList.contains('hidden') ||
    !helpModal.classList.contains('hidden') ||
    (pauseModal && !pauseModal.classList.contains('hidden')) ||
    !gameoverModal.classList.contains('hidden');
  document.body.classList.toggle('modal-open', isOpen);
}

function setPaused(paused) {
  if (paused && (game.phase === PHASES.SETUP || game.phase === PHASES.GAME_OVER)) return;
  if (!pauseModal) return;
  if (paused) {
    closeMobileOverlays();
    weaponPanel.classList.add('hidden');
    clearDirectionalInputs();
    const restartBtn = document.getElementById('btn-pause-restart');
    if (restartBtn) restartBtn.disabled = game.netRole === 'guest';
    pauseModal.classList.remove('hidden');
    game.paused = game.netRole === 'local';
  } else {
    pauseModal.classList.add('hidden');
    game.paused = false;
  }
  syncModalBodyClass();
}

function enterBattleScreen() {
  document.body.classList.add('in-battle');
  document.body.classList.remove('four-teams');
  setupOverlay.classList.add('hidden');
  gameoverModal.classList.add('hidden');
  helpModal.classList.add('hidden');
  pauseModal?.classList.add('hidden');
  weaponPanel.classList.add('hidden');
  game.paused = false;
  closeMobileOverlays();
  syncModalBodyClass();
  hudTop.classList.remove('hidden');
  hudBottom.classList.remove('hidden');
  const startZoom = window.innerWidth <= 640 || window.innerHeight <= 460 ? 0.72 : 1.0;
  game.camera.zoom = startZoom;
  game.camera.targetZoom = startZoom;
  game.camera.resize(canvas.clientWidth || window.innerWidth, canvas.clientHeight || window.innerHeight);
}

function returnToSetupScreen(notice = null) {
  document.body.classList.remove('in-battle', 'my-turn', 'four-teams', 'modal-open');
  clearDirectionalInputs();
  gameoverModal.classList.add('hidden');
  weaponPanel.classList.add('hidden');
  helpModal.classList.add('hidden');
  pauseModal?.classList.add('hidden');
  game.paused = false;
  closeMobileOverlays();
  hudTop.classList.add('hidden');
  hudBottom.classList.add('hidden');
  setupOverlay.classList.remove('hidden');
  game.phase = PHASES.SETUP;
  if (notice && setupState.mode === 'online') {
    setStatusBox(
      setupState.onlineSubMode === 'host' ? hostStatusEl : joinStatusEl,
      notice,
      'error'
    );
  }
  updateSetupControlsState();
  renderMapPreview();
}

function launchMatch(newSeed = false) {
  game.sound.unlock();
  if (setupState.mode === 'online' && online.role !== 'host') return;
  if (online.role === 'host' && !online.peerConnected) return;

  enterBattleScreen();
  const cfg = buildMatchConfigFromSetup(newSeed);
  if (online.role === 'host') {
    game.setNetworkMode('host', 0);
    game.startMatch(cfg);
    online.send({ type: 'match_start', config: cfg });
    online.send({ type: 'state', snap: game.getSnapshot() });
  } else {
    game.setNetworkMode('local', -1);
    game.startMatch(cfg);
  }
  renderWeaponGrid();
  updateHud(game);
}

btnStartMatch.addEventListener('click', () => launchMatch(false));
btnPlayAgain.addEventListener('click', () => launchMatch(true));
document.getElementById('btn-back-setup').addEventListener('click', () => {
  if (online.role !== 'none') {
    online.closeRoom();
    game.setNetworkMode('local', -1);
  }
  returnToSetupScreen();
});

function renderWeaponIconHtml(weapon) {
  if (sprites.isReady() && weapon?.spriteIcon) {
    const html = sprites.getIconHtml(weapon.spriteIcon.sheet, weapon.spriteIcon.key, 28);
    if (html) return html;
  }
  return weapon?.iconSvg || '';
}

function sendOrRunAction(action, localFn) {
  if (!game.canLocalPlayerControl()) return;
  if (game.netRole === 'guest') {
    online.send({ type: 'action', action });
  } else {
    localFn();
  }
}

// --- Weapon Panel ---
function renderWeaponGrid() {
  const activeTeam = game.teams[game.activeTeamIndex];
  const inv = activeTeam?.inventory || {};
  weaponGrid.innerHTML = '';

  for (const w of WEAPONS) {
    const ammo = inv[w.id] ?? 0;
    const slot = document.createElement('button');
    slot.type = 'button';
    slot.className = 'weapon-slot';
    slot.dataset.weapon = w.id;
    if (game.selectedWeaponId === w.id) slot.classList.add('selected');
    if (ammo <= 0) slot.disabled = true;

    const ammoText = ammo === Infinity ? '∞' : String(ammo);
    slot.innerHTML = `
      ${renderWeaponIconHtml(w)}
      <span class="weapon-slot-name">${w.name}</span>
      <span class="weapon-slot-ammo">${ammoText}</span>
    `;

    slot.addEventListener('mouseenter', () => {
      weaponDescTitle.textContent = w.name;
      weaponDescText.textContent = w.description;
    });
    slot.addEventListener('click', () => {
      game.sound.unlock();
      if (game.phase !== PHASES.PLAYER_TURN || !game.canLocalPlayerControl()) return;
      sendOrRunAction(
        { kind: 'select_weapon', weaponId: w.id },
        () => game.selectWeapon(w.id)
      );
      weaponPanel.classList.add('hidden');
      syncModalBodyClass();
      renderWeaponGrid();
    });
    weaponGrid.appendChild(slot);
  }
}

function toggleWeaponPanel(forceState = null) {
  if (game.phase !== PHASES.PLAYER_TURN || !game.canLocalPlayerControl()) return;

  const shouldOpen = forceState !== null ? forceState : weaponPanel.classList.contains('hidden');
  if (shouldOpen) {
    closeMobileOverlays();
    renderWeaponGrid();
    const cur = WEAPON_MAP[game.selectedWeaponId] || WEAPONS[0];
    weaponDescTitle.textContent = cur.name;
    weaponDescText.textContent = cur.description;
    weaponPanel.classList.remove('hidden');
  } else {
    weaponPanel.classList.add('hidden');
  }
  syncModalBodyClass();
}

btnMinimapToggle?.addEventListener('click', (e) => {
  e.stopPropagation();
  const next = !minimapFrame.classList.contains('mobile-open');
  closeMobileOverlays();
  if (next) {
    weaponPanel.classList.add('hidden');
    syncModalBodyClass();
    minimapFrame.classList.add('mobile-open');
    btnMinimapToggle.classList.add('active');
  }
});

btnMobileMenu?.addEventListener('click', (e) => {
  e.stopPropagation();
  const next = !toolbarBtns.classList.contains('mobile-open');
  closeMobileOverlays();
  if (next) {
    weaponPanel.classList.add('hidden');
    syncModalBodyClass();
    toolbarBtns.classList.add('mobile-open');
    btnMobileMenu.classList.add('active');
  }
});

window.addEventListener('pointerdown', (e) => {
  const t = e.target;
  if (
    toolbarBtns?.classList.contains('mobile-open') &&
    !toolbarBtns.contains(t) &&
    !btnMobileMenu?.contains(t)
  ) {
    toolbarBtns.classList.remove('mobile-open');
    btnMobileMenu?.classList.remove('active');
  }
  if (
    minimapFrame?.classList.contains('mobile-open') &&
    !minimapFrame.contains(t) &&
    !btnMinimapToggle?.contains(t)
  ) {
    minimapFrame.classList.remove('mobile-open');
    btnMinimapToggle?.classList.remove('active');
  }
});

mobileSpecialBar?.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-special-act]');
  if (!btn || !game.canLocalPlayerControl() || game.phase !== PHASES.PLAYER_TURN) return;
  const act = btn.dataset.specialAct;
  if (act === 'girder-left' || act === 'girder-right') {
    const delta = act === 'girder-left' ? -Math.PI / 8 : Math.PI / 8;
    game.girderAngle += delta;
    if (game.netRole === 'guest') {
      online.send({ type: 'action', action: { kind: 'rotate_girder', delta } });
    }
  } else if (act === 'plane-left' || act === 'plane-right') {
    const dir = act === 'plane-left' ? -1 : 1;
    game.airstrikeDir = dir;
    if (game.netRole === 'guest') {
      online.send({ type: 'action', action: { kind: 'airstrike_dir', dir } });
    }
    updateHud(game);
  }
});

hudWeaponChip.addEventListener('click', () => toggleWeaponPanel());
document.getElementById('btn-arsenal').addEventListener('click', () => toggleWeaponPanel());
document.getElementById('btn-close-weapons').addEventListener('click', () => toggleWeaponPanel(false));

document.querySelectorAll('.fuse-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const sec = Number(btn.dataset.fuse);
    sendOrRunAction({ kind: 'set_fuse', sec }, () => game.setFuseSeconds(sec));
  });
});

// Toolbar controls
document.getElementById('btn-center').addEventListener('click', () => {
  closeMobileOverlays();
  const w = game.getActiveWorm();
  if (w) {
    game.camera.clearManualHold();
    game.camera.focus(w.x, w.y - 16, false);
  }
});

const btnMute = document.getElementById('btn-mute');
function syncMuteUi() {
  if (btnMute) btnMute.textContent = game.sound.muted ? 'ЗВУК: ВЫКЛ' : 'ЗВУК: ВКЛ';
}
btnMute.addEventListener('click', () => {
  closeMobileOverlays();
  game.sound.unlock();
  game.sound.setMuted(!game.sound.muted);
  syncMuteUi();
});

window.addEventListener('message', (e) => {
  if (e.data && e.data.type === 'NEO_SET_MUTE') {
    game.sound.setMuted(Boolean(e.data.muted));
    syncMuteUi();
  }
});

btnPause?.addEventListener('click', () => {
  closeMobileOverlays();
  const isOpen = pauseModal && !pauseModal.classList.contains('hidden');
  setPaused(!isOpen);
});
document.getElementById('btn-pause-resume')?.addEventListener('click', () => setPaused(false));
document.getElementById('btn-pause-restart')?.addEventListener('click', () => {
  if (game.netRole === 'guest') return;
  setPaused(false);
  launchMatch(true);
});
document.getElementById('btn-pause-setup')?.addEventListener('click', () => {
  setPaused(false);
  if (online.role !== 'none') {
    online.closeRoom();
    game.setNetworkMode('local', -1);
  }
  returnToSetupScreen();
});
document.getElementById('btn-pause-hero')?.addEventListener('click', () => {
  setPaused(false);
  if (online.role !== 'none') {
    online.closeRoom();
    game.setNetworkMode('local', -1);
  }
  returnToSetupScreen();
  window.NeoHeroLanding?.show?.();
});
document.getElementById('btn-back-hero')?.addEventListener('click', () => {
  setPaused(false);
  if (online.role !== 'none') {
    online.closeRoom();
    game.setNetworkMode('local', -1);
  }
  returnToSetupScreen();
  window.NeoHeroLanding?.show?.();
});

document.getElementById('btn-help').addEventListener('click', () => {
  closeMobileOverlays();
  helpModal.classList.toggle('hidden');
  syncModalBodyClass();
});
document.getElementById('btn-close-help').addEventListener('click', () => {
  helpModal.classList.add('hidden');
  syncModalBodyClass();
});
document.getElementById('btn-setup').addEventListener('click', () => {
  closeMobileOverlays();
  setPaused(false);
  if (online.role !== 'none') {
    online.closeRoom();
    game.setNetworkMode('local', -1);
  }
  returnToSetupScreen();
});

// --- HUD Updates ---
function canShowTouchControls(engine) {
  if (!engine.canLocalPlayerControl()) return false;
  if (
    engine.phase === PHASES.PLAYER_TURN ||
    engine.phase === PHASES.CHARGING ||
    engine.phase === PHASES.RETREAT ||
    engine.phase === PHASES.JETPACK ||
    engine.phase === PHASES.BLOWTORCH ||
    engine.phase === PHASES.ROPE ||
    engine.phase === PHASES.DRILL
  ) {
    return true;
  }
  if (engine.phase === PHASES.PROJECTILE_ACTIVE) {
    return engine.walkers.some((wk) => wk.alive && (wk.kind === 'sheep' || wk.kind === 'supersheep'));
  }
  return false;
}

function updateHud(engine) {
  if (engine.phase === PHASES.SETUP) return;

  document.body.classList.toggle('four-teams', engine.teams.length > 2);
  const myTurnControls = canShowTouchControls(engine);
  const hadControls = document.body.classList.contains('my-turn');
  document.body.classList.toggle('my-turn', myTurnControls);
  if (hadControls && !myTurnControls) {
    clearDirectionalInputs();
    weaponPanel.classList.add('hidden');
    syncModalBodyClass();
  }

  const team = engine.teams[engine.activeTeamIndex];
  const worm = engine.getActiveWorm();
  const weapon = WEAPON_MAP[engine.selectedWeaponId] || WEAPONS[0];

  if (team) {
    hudTeamDot.style.background = team.palette.color;
    hudTeamDot.style.color = team.palette.color;
    hudActiveTeam.textContent = team.isAI ? `${team.name} (ИИ)` : team.name;
    hudActiveWorm.textContent = worm ? `${worm.name} • ${Math.ceil(worm.hp)} HP` : '—';

    const ammo = team.inventory[weapon.id] ?? 0;
    const readyFlag = (sprites.isReady() ? '1' : '0') + (sprites.sheets.plane?.naturalWidth > 0 ? '1' : '0');
    if (hudWeaponIcon.dataset.weaponId !== weapon.id || hudWeaponIcon.dataset.spriteReady !== readyFlag) {
      hudWeaponIcon.dataset.weaponId = weapon.id;
      hudWeaponIcon.dataset.spriteReady = readyFlag;
      hudWeaponIcon.innerHTML = renderWeaponIconHtml(weapon);
    }
    hudWeaponName.textContent = weapon.name;
    hudWeaponAmmo.textContent = ammo === Infinity ? '∞' : `×${ammo}`;
  }

  // Contextual mobile controls for Girder rotation and Air/Napalm Strike direction
  if (mobileSpecialBar) {
    const showSpecial = isCompactViewport() && engine.phase === PHASES.PLAYER_TURN && engine.canLocalPlayerControl();
    if (showSpecial && weapon.id === 'girder') {
      if (mobileSpecialBar.dataset.mode !== 'girder') {
        mobileSpecialBar.dataset.mode = 'girder';
        mobileSpecialBar.innerHTML =
          '<button type="button" class="hud-btn" data-special-act="girder-left">⟲ Поворот</button>' +
          '<button type="button" class="hud-btn" data-special-act="girder-right">Поворот ⟳</button>';
      }
      mobileSpecialBar.classList.remove('hidden');
    } else if (showSpecial && (weapon.id === 'airstrike' || weapon.id === 'napalm')) {
      const dirMode = `plane:${engine.airstrikeDir >= 0 ? 'R' : 'L'}`;
      if (mobileSpecialBar.dataset.mode !== dirMode) {
        mobileSpecialBar.dataset.mode = dirMode;
        mobileSpecialBar.innerHTML =
          `<button type="button" class="hud-btn ${engine.airstrikeDir < 0 ? 'active' : ''}" data-special-act="plane-left">← Самолёт</button>` +
          `<button type="button" class="hud-btn ${engine.airstrikeDir >= 0 ? 'active' : ''}" data-special-act="plane-right">Самолёт →</button>`;
      }
      mobileSpecialBar.classList.remove('hidden');
    } else {
      mobileSpecialBar.dataset.mode = '';
      mobileSpecialBar.classList.add('hidden');
    }
  }

  // Fuse pills visibility
  if (weapon.fuseable && engine.phase === PHASES.PLAYER_TURN && engine.canLocalPlayerControl()) {
    hudFuseControls.classList.remove('hidden');
    hudFuseControls.querySelectorAll('.fuse-btn').forEach((b) => {
      b.classList.toggle('active', Number(b.dataset.fuse) === engine.fuseSeconds);
    });
  } else {
    hudFuseControls.classList.add('hidden');
  }

  // Jetpack fuel
  if (engine.phase === PHASES.JETPACK) {
    hudJetpackFuel.classList.remove('hidden');
    hudFuelFill.style.width = `${Math.max(0, engine.jetpackFuel)}%`;
  } else {
    hudJetpackFuel.classList.add('hidden');
  }

  // Timer & phase label
  let timeDisplay = Math.ceil(engine.turnTimer);
  let label = 'ХОД';
  if (engine.phase === PHASES.RETREAT) {
    label = 'ОТХОД';
    timeDisplay = Math.ceil(engine.retreatTimer);
  } else if (engine.phase === PHASES.BLOWTORCH) {
    label = 'ГОРЕЛКА';
    timeDisplay = Math.ceil(engine.blowtorchTimer);
  } else if (engine.phase === PHASES.ROPE) {
    label = 'ВЕРЁВКА';
    timeDisplay = '•';
  } else if (engine.phase === PHASES.DRILL) {
    label = 'БУР';
    timeDisplay = Math.ceil(engine.drillTimer);
  } else if (engine.phase === PHASES.PROJECTILE_ACTIVE || engine.phase === PHASES.RESOLVING) {
    label = 'ВЫСТРЕЛ';
    timeDisplay = '•';
  }
  hudPhaseLabel.textContent = label;
  hudTimer.textContent = String(timeDisplay);
  hudTimer.classList.toggle(
    'urgent',
    typeof timeDisplay === 'number' && timeDisplay <= 5 && engine.phase === PHASES.PLAYER_TURN
  );

  // Wind
  hudWindVal.textContent = engine.wind === 0 ? 'ШТИЛЬ' : engine.wind > 0 ? `${engine.wind} →` : `← ${Math.abs(engine.wind)}`;
  const pct = Math.min(50, Math.abs(engine.wind) * 0.5);
  if (engine.wind >= 0) {
    hudWindFill.style.left = '50%';
    hudWindFill.style.width = `${pct}%`;
  } else {
    hudWindFill.style.left = `${50 - pct}%`;
    hudWindFill.style.width = `${pct}%`;
  }

  hudSuddenDeath.classList.toggle('hidden', !engine.suddenDeathActive);

  // Online badge
  if (engine.netRole === 'host' || engine.netRole === 'guest') {
    const roleLabel = engine.netRole === 'host' ? 'ХОСТ' : 'ГОСТЬ';
    const turnLabel = engine.canLocalPlayerControl() ? (window.innerWidth <= 640 ? 'Ход' : 'Ваш ход') : 'Ждите';
    hudOnlineBadge.textContent =
      window.innerWidth <= 640 ? `${roleLabel} • ${turnLabel}` : `${roleLabel} • ${online.roomCode || ''} • ${turnLabel}`;
    hudOnlineBadge.classList.remove('hidden');
  } else {
    hudOnlineBadge.classList.add('hidden');
  }

  // Turn banner
  if (engine.bannerTimer > 0 && engine.bannerText) {
    turnBanner.textContent = engine.bannerText;
    turnBanner.style.borderColor = engine.bannerColor;
    turnBanner.style.color = '#ffffff';
    turnBanner.classList.remove('hidden');
  } else {
    turnBanner.classList.add('hidden');
  }

  // Team health bars
  const maxTeamHp = engine.config ? engine.config.wormsPerTeam * engine.config.startHp : 300;
  teamBarsEl.innerHTML = '';
  for (const t of engine.teams) {
    const totalHp = engine.getTeamTotalHp(t.index);
    const card = document.createElement('div');
    card.className = 'team-bar-card';
    if (t.index === engine.activeTeamIndex) card.classList.add('active');
    if (totalHp <= 0) card.classList.add('dead');

    const ratio = Math.max(0, Math.min(100, (totalHp / maxTeamHp) * 100));
    card.innerHTML = `
      <div class="team-bar-top">
        <span style="color:${t.palette.light}">${t.name}</span>
        <span>${Math.ceil(totalHp)}</span>
      </div>
      <div class="team-hp-track">
        <div class="team-hp-fill" style="width:${ratio}%;background:${t.palette.color}"></div>
      </div>
    `;
    teamBarsEl.appendChild(card);
  }
}

function showGameOver(engine) {
  document.body.classList.remove('my-turn');
  clearDirectionalInputs();
  weaponPanel.classList.add('hidden');
  pauseModal?.classList.add('hidden');
  game.paused = false;
  const titleEl = document.getElementById('gameover-title');
  const subEl = document.getElementById('gameover-subtitle');
  const statsEl = document.getElementById('gameover-stats');
  const awardsEl = document.getElementById('gameover-awards');

  if (engine.winnerTeamIndex >= 0) {
    const winTeam = engine.teams[engine.winnerTeamIndex];
    const trophyUrl = sprites.isReady() ? sprites.getIconDataUrl('items', 'trophy', 64) : null;
    titleEl.innerHTML = trophyUrl
      ? `<img class="victory-trophy-icon" src="${trophyUrl}" alt="" /> ПОБЕДА!`
      : 'ПОБЕДА!';
    titleEl.style.color = winTeam.palette.color;
    subEl.textContent = `${winTeam.name} побеждает за ${engine.matchStats.totalTurns} ход.!`;
  } else {
    titleEl.textContent = 'НИЧЬЯ!';
    titleEl.style.color = '#ffd32a';
    subEl.textContent = 'Все червяки ушли на дно или погибли в бою!';
  }

  statsEl.innerHTML = '';
  let bestHumanScore = 0;
  for (const t of engine.teams) {
    const remHp = Math.ceil(engine.getTeamTotalHp(t.index));
    if (!t.isAI) {
      const s = Math.round(t.damageDealt + t.kills * 120 + remHp + (t.index === engine.winnerTeamIndex ? 500 : 0));
      if (s > bestHumanScore) bestHumanScore = s;
    }
    const row = document.createElement('div');
    row.className = 'gameover-stat-row';
    row.innerHTML = `
      <span style="color:${t.palette.light}">${t.name}</span>
      <span>Урон: ${Math.round(t.damageDealt)} • Фраги: ${t.kills} • Ост. HP: ${remHp}</span>
    `;
    statsEl.appendChild(row);
  }
  if (bestHumanScore > 0 && window.parent && window.parent !== window) {
    try {
      window.parent.postMessage({ type: 'NEO_HIGHSCORE', game: 'worms_armageddon', score: bestHumanScore }, '*');
    } catch {}
  }

  const topDamager = [...engine.teams].sort((a, b) => b.damageDealt - a.damageDealt)[0];
  const awards = [
    `Мастер разрушений: ${topDamager?.name || '-'} (${Math.round(topDamager?.damageDealt || 0)} ур.)`,
    `Мощный удар: ${engine.matchStats.biggestHit.wormName} (${engine.matchStats.biggestHit.damage} ур.)`,
    `Собрано ящиков: ${engine.matchStats.cratePickups}`,
  ];
  awardsEl.innerHTML = awards.map((a) => `<span class="award-pill">${a}</span>`).join('');

  if (engine.netRole === 'guest') {
    btnPlayAgain.disabled = true;
    btnPlayAgain.textContent = 'ЖДЁМ ХОСТА...';
  } else {
    btnPlayAgain.disabled = false;
    btnPlayAgain.textContent = 'ИГРАТЬ СНОВА (НОВАЯ КАРТА)';
  }
  gameoverModal.classList.remove('hidden');
  syncModalBodyClass();
}

// --- Input Handling (Keyboard + Mouse + Minimap + Touch) ---
let isPanning = false;
let panButton = -1;
let panMoved = false;
let lastMouseX = 0;
let lastMouseY = 0;
let pointerDownX = 0;
let pointerDownY = 0;
let lastRemoteAimSent = 0;
let lastTouchTime = 0;

let touchMode = 'none'; // 'none' | 'pan' | 'pinch'
let touchStartX = 0;
let touchStartY = 0;
let touchLastX = 0;
let touchLastY = 0;
let touchMoved = false;
let pinchLastDist = 0;
let pinchLastMidX = 0;
let pinchLastMidY = 0;

const guestInput = { left: false, right: false, up: false, down: false };

function setDirectionalInput(key, pressed) {
  if (game.netRole === 'guest') {
    if (guestInput[key] === pressed) return;
    guestInput[key] = pressed;
    if (game.canLocalPlayerControl()) {
      online.send({ type: 'input_state', input: { ...guestInput } });
    }
  } else {
    game.input[key] = pressed;
  }
}

function clearDirectionalInputs() {
  if (game.netRole === 'guest') {
    const hadAny = guestInput.left || guestInput.right || guestInput.up || guestInput.down;
    guestInput.left = false;
    guestInput.right = false;
    guestInput.up = false;
    guestInput.down = false;
    if (hadAny) online.send({ type: 'input_state', input: { ...guestInput } });
  } else {
    game.input.left = false;
    game.input.right = false;
    game.input.up = false;
    game.input.down = false;
  }
}

function isTypingTarget(el) {
  return el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT');
}

window.addEventListener('keydown', (e) => {
  if (isTypingTarget(e.target)) return;

  if (e.code === 'Escape') {
    if (!helpModal.classList.contains('hidden')) {
      helpModal.classList.add('hidden');
      syncModalBodyClass();
    } else if (!weaponPanel.classList.contains('hidden')) {
      weaponPanel.classList.add('hidden');
      syncModalBodyClass();
    } else if (pauseModal && !pauseModal.classList.contains('hidden')) {
      setPaused(false);
    } else if (game.phase === PHASES.JETPACK && game.canLocalPlayerControl()) {
      sendOrRunAction({ kind: 'stop_jetpack' }, () => game.stopJetpack());
    } else if (game.phase === PHASES.ROPE && game.canLocalPlayerControl()) {
      sendOrRunAction({ kind: 'stop_rope' }, () => game.stopRope());
    } else if (game.phase === PHASES.DRILL && game.canLocalPlayerControl()) {
      sendOrRunAction({ kind: 'stop_drill' }, () => game.stopDrill());
    } else if (game.phase !== PHASES.SETUP && game.phase !== PHASES.GAME_OVER) {
      setPaused(true);
    }
    return;
  }

  if (game.phase === PHASES.SETUP || game.phase === PHASES.GAME_OVER) {
    if (e.code === 'Enter' && setupOverlay && !setupOverlay.classList.contains('hidden')) {
      if (setupState.mode === 'local' || (online.role === 'host' && online.peerConnected)) {
        e.preventDefault();
        launchMatch(false);
      }
    }
    return;
  }

  const gameplayKeys = [
    'ArrowLeft',
    'ArrowRight',
    'ArrowUp',
    'ArrowDown',
    'Space',
    'Tab',
    'Backspace',
  ];
  if (gameplayKeys.includes(e.code)) {
    e.preventDefault();
  }

  game.sound.unlock();

  if (e.code === 'KeyH' || e.key === '?') {
    helpModal.classList.toggle('hidden');
    return;
  }

  if (e.code === 'Tab') {
    toggleWeaponPanel();
    return;
  }

  if (e.code === 'KeyC') {
    const w = game.getActiveWorm();
    if (w) {
      game.camera.clearManualHold();
      game.camera.focus(w.x, w.y - 16, false);
    }
    return;
  }

  if (!game.canLocalPlayerControl()) return;

  if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
    setDirectionalInput('left', true);
    if (game.selectedWeaponId === 'airstrike' || game.selectedWeaponId === 'napalm') {
      game.airstrikeDir = -1;
      if (game.netRole === 'guest') online.send({ type: 'action', action: { kind: 'airstrike_dir', dir: -1 } });
    }
  }
  if (e.code === 'ArrowRight' || e.code === 'KeyD') {
    setDirectionalInput('right', true);
    if (game.selectedWeaponId === 'airstrike' || game.selectedWeaponId === 'napalm') {
      game.airstrikeDir = 1;
      if (game.netRole === 'guest') online.send({ type: 'action', action: { kind: 'airstrike_dir', dir: 1 } });
    }
  }
  if (e.code === 'ArrowUp' || e.code === 'KeyW') setDirectionalInput('up', true);
  if (e.code === 'ArrowDown' || e.code === 'KeyS') setDirectionalInput('down', true);

  if (!e.repeat) {
    if (e.code === 'KeyQ' || e.code === 'Enter') {
      if (game.selectedWeaponId === 'girder' && game.phase === PHASES.PLAYER_TURN) {
        game.girderAngle -= Math.PI / 8;
        if (game.netRole === 'guest') {
          online.send({ type: 'action', action: { kind: 'rotate_girder', delta: -Math.PI / 8 } });
        }
      } else if (game.phase === PHASES.PLAYER_TURN || game.phase === PHASES.RETREAT) {
        sendOrRunAction({ kind: 'jump' }, () => {
          if (game.getActiveWorm()?.jump()) game.sound.playJump();
        });
      }
    }

    if (e.code === 'KeyE' || e.code === 'Backspace') {
      if (game.selectedWeaponId === 'girder' && game.phase === PHASES.PLAYER_TURN) {
        game.girderAngle += Math.PI / 8;
        if (game.netRole === 'guest') {
          online.send({ type: 'action', action: { kind: 'rotate_girder', delta: Math.PI / 8 } });
        }
      } else if (game.phase === PHASES.PLAYER_TURN || game.phase === PHASES.RETREAT) {
        sendOrRunAction({ kind: 'backflip' }, () => {
          if (game.getActiveWorm()?.backflip()) game.sound.playJump();
        });
      }
    }

    if (e.key >= '1' && e.key <= '5') {
      const sec = Number(e.key);
      sendOrRunAction({ kind: 'set_fuse', sec }, () => game.setFuseSeconds(sec));
    }

    if (e.code === 'Space') {
      if (game.phase === PHASES.JETPACK) {
        sendOrRunAction({ kind: 'stop_jetpack' }, () => game.stopJetpack());
      } else if (game.phase === PHASES.ROPE) {
        sendOrRunAction({ kind: 'stop_rope' }, () => game.stopRope());
      } else if (game.phase === PHASES.DRILL) {
        sendOrRunAction({ kind: 'stop_drill' }, () => game.stopDrill());
      } else if (game.phase === PHASES.PROJECTILE_ACTIVE) {
        sendOrRunAction({ kind: 'trigger_active' }, () => game.triggerActiveSpecial());
      } else if (game.phase === PHASES.PLAYER_TURN) {
        weaponPanel.classList.add('hidden');
        sendOrRunAction({ kind: 'begin_charge' }, () => game.beginCharge());
      }
    }
  }
});

window.addEventListener('keyup', (e) => {
  if (e.code === 'ArrowLeft' || e.code === 'KeyA') setDirectionalInput('left', false);
  if (e.code === 'ArrowRight' || e.code === 'KeyD') setDirectionalInput('right', false);
  if (e.code === 'ArrowUp' || e.code === 'KeyW') setDirectionalInput('up', false);
  if (e.code === 'ArrowDown' || e.code === 'KeyS') setDirectionalInput('down', false);

  if (e.code === 'Space' && game.phase === PHASES.CHARGING && game.canLocalPlayerControl()) {
    sendOrRunAction({ kind: 'release_charge' }, () => game.releaseCharge());
  }
});

window.addEventListener('blur', clearDirectionalInputs);

canvas.addEventListener('contextmenu', (e) => {
  e.preventDefault();
});

canvas.addEventListener('mousedown', (e) => {
  if (Date.now() - lastTouchTime < 500) return;
  closeMobileOverlays();
  game.sound.unlock();
  const rect = canvas.getBoundingClientRect();
  const sx = e.clientX - rect.left;
  const sy = e.clientY - rect.top;
  const worldPt = game.camera.screenToWorld(sx, sy);

  pointerDownX = sx;
  pointerDownY = sy;
  lastMouseX = sx;
  lastMouseY = sy;

  if (e.button === 2 || e.button === 1 || (e.button === 0 && e.shiftKey)) {
    isPanning = true;
    panButton = e.button;
    panMoved = false;
    return;
  }

  if (e.button !== 0) return;

  if (!weaponPanel.classList.contains('hidden')) {
    weaponPanel.classList.add('hidden');
    return;
  }

  if (!game.canLocalPlayerControl()) return;

  if (game.phase === PHASES.JETPACK) {
    sendOrRunAction({ kind: 'stop_jetpack' }, () => game.stopJetpack());
    return;
  }
  if (game.phase === PHASES.ROPE) {
    sendOrRunAction({ kind: 'stop_rope' }, () => game.stopRope());
    return;
  }
  if (game.phase === PHASES.DRILL) {
    sendOrRunAction({ kind: 'stop_drill' }, () => game.stopDrill());
    return;
  }
  if (game.phase === PHASES.PROJECTILE_ACTIVE) {
    sendOrRunAction({ kind: 'trigger_active' }, () => game.triggerActiveSpecial());
    return;
  }

  if (game.phase !== PHASES.PLAYER_TURN) return;
  const weapon = WEAPON_MAP[game.selectedWeaponId];
  if (!weapon) return;

  if (weapon.targetMode === 'mapClick' || weapon.targetMode === 'girder') {
    if (game.netRole === 'guest') {
      online.send({
        type: 'action',
        action: {
          kind: 'map_click',
          wx: worldPt.x,
          wy: worldPt.y,
          girderAngle: game.girderAngle,
          airstrikeDir: game.airstrikeDir,
        },
      });
    } else {
      game.setPendingMapTarget(worldPt.x, worldPt.y);
      if (
        weapon.id === 'airstrike' ||
        weapon.id === 'napalm' ||
        weapon.id === 'meteor' ||
        weapon.id === 'magnet' ||
        weapon.id === 'teleport' ||
        weapon.id === 'girder'
      ) {
        game.fireWeapon();
      } else if (weapon.id === 'homing') {
        game.showBanner('Target locked! Aim & hold Click/Space to launch', '#48dbfb', 1.8);
      }
    }
    return;
  }

  if (game.netRole === 'guest') {
    online.send({
      type: 'action',
      action: { kind: 'begin_charge', wx: worldPt.x, wy: worldPt.y },
    });
  } else {
    game.getActiveWorm()?.setAimFromWorldPoint(worldPt.x, worldPt.y);
    game.beginCharge();
  }
});

window.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  const sx = e.clientX - rect.left;
  const sy = e.clientY - rect.top;

  if (isPanning) {
    const dx = sx - lastMouseX;
    const dy = sy - lastMouseY;
    if (Math.hypot(sx - pointerDownX, sy - pointerDownY) > 5) {
      panMoved = true;
    }
    game.camera.panByScreenDelta(dx, dy);
    lastMouseX = sx;
    lastMouseY = sy;
    return;
  }

  const worldPt = game.camera.screenToWorld(sx, sy);
  game.hoverWorldX = worldPt.x;
  game.hoverWorldY = worldPt.y;

  const movedEnough = Math.hypot(sx - lastMouseX, sy - lastMouseY) > 1.5;
  lastMouseX = sx;
  lastMouseY = sy;

  if (
    movedEnough &&
    game.phase === PHASES.PLAYER_TURN &&
    weaponPanel.classList.contains('hidden') &&
    helpModal.classList.contains('hidden') &&
    game.canLocalPlayerControl()
  ) {
    const weapon = WEAPON_MAP[game.selectedWeaponId];
    if (weapon && (weapon.targetMode === 'aim' || weapon.targetMode === 'instant' || (weapon.id === 'homing' && game.pendingMapTarget))) {
      if (game.netRole === 'guest') {
        const now = performance.now();
        if (now - lastRemoteAimSent >= 40) {
          lastRemoteAimSent = now;
          online.send({ type: 'aim', wx: worldPt.x, wy: worldPt.y });
        }
      } else {
        game.getActiveWorm()?.setAimFromWorldPoint(worldPt.x, worldPt.y);
      }
    }
  }
});

window.addEventListener('mouseup', (e) => {
  if (Date.now() - lastTouchTime < 500) return;
  if (isPanning && e.button === panButton) {
    isPanning = false;
    if (panButton === 2 && !panMoved) {
      toggleWeaponPanel();
    }
    return;
  }
  if (e.button === 0 && game.phase === PHASES.CHARGING && game.canLocalPlayerControl()) {
    sendOrRunAction({ kind: 'release_charge' }, () => game.releaseCharge());
  }
});

canvas.addEventListener(
  'wheel',
  (e) => {
    e.preventDefault();
    if (game.selectedWeaponId === 'girder' && game.phase === PHASES.PLAYER_TURN && game.canLocalPlayerControl()) {
      const delta = e.deltaY > 0 ? Math.PI / 8 : -Math.PI / 8;
      game.girderAngle += delta;
      if (game.netRole === 'guest') {
        online.send({ type: 'action', action: { kind: 'rotate_girder', delta } });
      }
      return;
    }
    const rect = canvas.getBoundingClientRect();
    const factor = e.deltaY < 0 ? 1.1 : 0.91;
    game.camera.adjustZoom(factor, e.clientX - rect.left, e.clientY - rect.top);
  },
  { passive: false }
);

// Multi-touch canvas pan / pinch-zoom / tap-to-aim or tap-map-target
canvas.addEventListener(
  'touchstart',
  (e) => {
    e.preventDefault();
    lastTouchTime = Date.now();
    game.sound.unlock();
    const rect = canvas.getBoundingClientRect();

    if (e.touches.length === 1) {
      const t = e.touches[0];
      touchMode = 'pan';
      touchStartX = t.clientX - rect.left;
      touchStartY = t.clientY - rect.top;
      touchLastX = touchStartX;
      touchLastY = touchStartY;
      touchMoved = false;
    } else if (e.touches.length >= 2) {
      touchMode = 'pinch';
      touchMoved = true;
      const t0 = e.touches[0];
      const t1 = e.touches[1];
      const x0 = t0.clientX - rect.left;
      const y0 = t0.clientY - rect.top;
      const x1 = t1.clientX - rect.left;
      const y1 = t1.clientY - rect.top;
      pinchLastDist = Math.max(10, Math.hypot(x1 - x0, y1 - y0));
      pinchLastMidX = (x0 + x1) * 0.5;
      pinchLastMidY = (y0 + y1) * 0.5;
    }
  },
  { passive: false }
);

canvas.addEventListener(
  'touchmove',
  (e) => {
    e.preventDefault();
    lastTouchTime = Date.now();
    const rect = canvas.getBoundingClientRect();

    if (e.touches.length >= 2) {
      const t0 = e.touches[0];
      const t1 = e.touches[1];
      const x0 = t0.clientX - rect.left;
      const y0 = t0.clientY - rect.top;
      const x1 = t1.clientX - rect.left;
      const y1 = t1.clientY - rect.top;
      const dist = Math.max(10, Math.hypot(x1 - x0, y1 - y0));
      const midX = (x0 + x1) * 0.5;
      const midY = (y0 + y1) * 0.5;
      if (touchMode !== 'pinch') {
        touchMode = 'pinch';
        pinchLastDist = dist;
        pinchLastMidX = midX;
        pinchLastMidY = midY;
      } else {
        const factor = dist / Math.max(10, pinchLastDist);
        game.camera.adjustZoom(factor, midX, midY);
        game.camera.panByScreenDelta(midX - pinchLastMidX, midY - pinchLastMidY);
        pinchLastDist = dist;
        pinchLastMidX = midX;
        pinchLastMidY = midY;
      }
      touchMoved = true;
      return;
    }

    if (e.touches.length === 1 && touchMode === 'pan') {
      const t = e.touches[0];
      const sx = t.clientX - rect.left;
      const sy = t.clientY - rect.top;
      if (Math.hypot(sx - touchStartX, sy - touchStartY) > 8) {
        touchMoved = true;
        closeMobileOverlays();
      }
      if (touchMoved) {
        game.camera.panByScreenDelta(sx - touchLastX, sy - touchLastY);
      }
      touchLastX = sx;
      touchLastY = sy;
    }
  },
  { passive: false }
);

canvas.addEventListener(
  'touchend',
  (e) => {
    e.preventDefault();
    lastTouchTime = Date.now();
    if (e.touches.length > 0) return;

    const wasTap = touchMode === 'pan' && !touchMoved;
    touchMode = 'none';
    if (!wasTap) return;

    if (!weaponPanel.classList.contains('hidden')) {
      weaponPanel.classList.add('hidden');
      return;
    }
    if (minimapFrame?.classList.contains('mobile-open') || toolbarBtns?.classList.contains('mobile-open')) {
      closeMobileOverlays();
      return;
    }

    if (!game.canLocalPlayerControl()) return;
    if (game.phase === PHASES.PROJECTILE_ACTIVE) {
      sendOrRunAction({ kind: 'trigger_active' }, () => game.triggerActiveSpecial());
      return;
    }
    if (game.phase !== PHASES.PLAYER_TURN) return;

    const worldPt = game.camera.screenToWorld(touchStartX, touchStartY);
    game.hoverWorldX = worldPt.x;
    game.hoverWorldY = worldPt.y;
    const weapon = WEAPON_MAP[game.selectedWeaponId];
    if (!weapon) return;

    if (weapon.targetMode === 'mapClick' || weapon.targetMode === 'girder') {
      if (game.netRole === 'guest') {
        online.send({
          type: 'action',
          action: {
            kind: 'map_click',
            wx: worldPt.x,
            wy: worldPt.y,
            girderAngle: game.girderAngle,
            airstrikeDir: game.airstrikeDir,
          },
        });
      } else {
        game.setPendingMapTarget(worldPt.x, worldPt.y);
        if (
          weapon.id === 'airstrike' ||
          weapon.id === 'napalm' ||
          weapon.id === 'meteor' ||
          weapon.id === 'magnet' ||
          weapon.id === 'teleport' ||
          weapon.id === 'girder'
        ) {
          game.fireWeapon();
        } else if (weapon.id === 'homing') {
          game.showBanner('Target locked! Hold FIRE to launch', '#48dbfb', 1.8);
        }
      }
      return;
    }

    // Standard aim weapons: tap sets aim direction without accidental discharge
    if (game.netRole === 'guest') {
      online.send({ type: 'aim', wx: worldPt.x, wy: worldPt.y });
    } else {
      game.getActiveWorm()?.setAimFromWorldPoint(worldPt.x, worldPt.y);
    }
  },
  { passive: false }
);

canvas.addEventListener('touchcancel', () => {
  touchMode = 'none';
});

window.addEventListener('resize', () => {
  const w = canvas.clientWidth || window.innerWidth;
  const h = canvas.clientHeight || window.innerHeight;
  game.camera.resize(w, h);
  if (game.phase !== PHASES.SETUP) {
    if ((w <= 640 || h <= 460) && game.camera.targetZoom > 0.9) {
      game.camera.targetZoom = 0.72;
    }
    updateHud(game);
  }
});

window.addEventListener('blur', clearDirectionalInputs);

// Touch controls wiring (for QR phone players)
document.querySelectorAll('#touch-controls [data-touch]').forEach((btn) => {
  const kind = btn.dataset.touch;
  const onDown = (e) => {
    e.preventDefault();
    try {
      btn.setPointerCapture(e.pointerId);
    } catch {}
    game.sound.unlock();
    if (kind === 'arsenal') {
      toggleWeaponPanel();
      return;
    }
    if (!game.canLocalPlayerControl()) return;
    if (kind === 'left' || kind === 'right' || kind === 'up' || kind === 'down') {
      setDirectionalInput(kind, true);
    } else if (kind === 'jump') {
      sendOrRunAction({ kind: 'jump' }, () => {
        if (game.getActiveWorm()?.jump()) game.sound.playJump();
      });
    } else if (kind === 'backflip') {
      sendOrRunAction({ kind: 'backflip' }, () => {
        if (game.getActiveWorm()?.backflip()) game.sound.playJump();
      });
    } else if (kind === 'fire') {
      if (game.phase === PHASES.JETPACK) {
        sendOrRunAction({ kind: 'stop_jetpack' }, () => game.stopJetpack());
      } else if (game.phase === PHASES.ROPE) {
        sendOrRunAction({ kind: 'stop_rope' }, () => game.stopRope());
      } else if (game.phase === PHASES.DRILL) {
        sendOrRunAction({ kind: 'stop_drill' }, () => game.stopDrill());
      } else if (game.phase === PHASES.PROJECTILE_ACTIVE) {
        sendOrRunAction({ kind: 'trigger_active' }, () => game.triggerActiveSpecial());
      } else if (game.phase === PHASES.PLAYER_TURN) {
        sendOrRunAction({ kind: 'begin_charge' }, () => game.beginCharge());
      }
    }
  };
  const onUp = (e) => {
    e.preventDefault();
    if (kind === 'left' || kind === 'right' || kind === 'up' || kind === 'down') {
      setDirectionalInput(kind, false);
    } else if (kind === 'fire' && game.phase === PHASES.CHARGING && game.canLocalPlayerControl()) {
      sendOrRunAction({ kind: 'release_charge' }, () => game.releaseCharge());
    }
  };
  btn.addEventListener('pointerdown', onDown);
  btn.addEventListener('pointerup', onUp);
  btn.addEventListener('pointercancel', onUp);
  btn.addEventListener('lostpointercapture', onUp);
});

// Minimap pan on click/drag
let miniDragging = false;
function panFromMinimap(e) {
  const rect = minimapCanvas.getBoundingClientRect();
  const nx = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
  const ny = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
  game.camera.manualHold = 2.8;
  game.camera.targetX = nx * WORLD_W;
  game.camera.targetY = ny * WORLD_H;
  game.camera.x = game.camera.targetX;
  game.camera.y = game.camera.targetY;
}

minimapCanvas.addEventListener('mousedown', (e) => {
  miniDragging = true;
  panFromMinimap(e);
});
minimapCanvas.addEventListener(
  'touchstart',
  (e) => {
    e.preventDefault();
    if (e.touches[0]) panFromMinimap(e.touches[0]);
  },
  { passive: false }
);
minimapCanvas.addEventListener(
  'touchmove',
  (e) => {
    e.preventDefault();
    if (e.touches[0]) panFromMinimap(e.touches[0]);
  },
  { passive: false }
);
window.addEventListener('mousemove', (e) => {
  if (miniDragging) panFromMinimap(e);
});
window.addEventListener('mouseup', () => {
  miniDragging = false;
});

// --- Main Animation Loop ---
let lastTs = performance.now();
let netSyncAccum = 0;

function frame(ts) {
  const dt = Math.min(0.05, Math.max(0, (ts - lastTs) / 1000));
  lastTs = ts;

  game.update(dt);
  if (game.phase !== PHASES.SETUP) {
    renderer.render(game, dt);
    renderer.renderMinimap(minimapCanvas, game);

    if (online.role === 'host' && online.peerConnected) {
      netSyncAccum += dt;
      if (netSyncAccum >= 0.05) {
        netSyncAccum = 0;
        online.send({ type: 'state', snap: game.getSnapshot() });
      }
    }
  }

  requestAnimationFrame(frame);
}

// Initial setup & auto-join from ?room=CODE (QR scan / invite link)
sprites.load(() => {
  renderWeaponGrid();
  updateHud(game);
});
renderTeamRoster();
renderMapPreview();
loadNetworkAddresses();
updateSetupControlsState();

const urlParams = new URLSearchParams(window.location.search);
const autoHost = extractRoomCode(urlParams.get('host'));
const autoRoom = extractRoomCode(urlParams.get('room'));
if (autoHost) {
  setupState.mode = 'online';
  setupState.onlineSubMode = 'host';
  updateSetupControlsState();
  const hostName = onlineHostNameInput.value.trim() || TEAM_PALETTES[0].name;
  setupState.hostName = hostName;
  online.preferLocalWs = Boolean(setupState.hasSameOriginApi);
  online.createRoom(hostName, getLobbyState(), autoHost).then(() => {
    game.setNetworkMode('host', 0);
    setStatusBox(hostStatusEl, 'Waiting for Player 2 to join via code or QR...', 'info');
    refreshInviteAndQR();
    updateSetupControlsState();
  }).catch((err) => {
    setStatusBox(hostStatusEl, `Failed to create room: ${err.message}`, 'error');
    hostRoomCard.classList.remove('hidden');
  });
} else if (autoRoom) {
  setupState.mode = 'online';
  setupState.onlineSubMode = 'join';
  joinCodeInput.value = autoRoom;
  updateSetupControlsState();
  handleJoinRoom();
}

requestAnimationFrame(frame);
