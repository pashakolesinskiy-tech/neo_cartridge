/**
 * NEO-CARTRIDGE // Менеджер сохранений, рекордов и ачивок (Zero-Backend)
 * Локальная БД в LocalStorage с возможностью экспорта/импорта .cart файлов
 */

const Storage = {
  data: {
    highscores: {
      stick_fighting: 0,
      pixel_drift: 0,
      chrono_blade: 0,
      mecha_siege: 0,
      worms_armageddon: 0,
      cosmo_junk: 0
    },
    gamesPlayed: 0,
    achievements: {},
    settings: {
      crtFilter: true,
      soundEnabled: true
    }
  },

  achievementsList: [
    { id: "FIRST_BOOT", title: "Включение питания", desc: "Запустить ретро-консоль NEO-CARTRIDGE", icon: "⚡" },
    { id: "STICK_WARRIOR", title: "Мастер комбо", desc: "Вставить картридж STICK_FIGHTING", icon: "🥋" },
    { id: "DRIFT_KING", title: "Король дрифта", desc: "Вставить картридж PIXEL DRIFT: TURBO GP", icon: "🏎" },
    { id: "CHRONO_MASTER", title: "Хроно-клинок", desc: "Вставить картридж CHRONO BLADE: ZERO", icon: "⚔️" },
    { id: "MECHA_COMMANDER", title: "Осада мехов", desc: "Вставить картридж MECHA SIEGE: ZERO", icon: "🤖" },
    { id: "WORM_ARMAGEDDON", title: "Червячный апокалипсис", desc: "Вставить картридж WORMS ARMAGEDDON", icon: "🪱" },
    { id: "COSMO_JUNKER", title: "Космический мусорщик", desc: "Вставить картридж COSMO JUNK", icon: "🛸" },
    { id: "CHIPTUNE_FAN", title: "8-битный эстет", desc: "Включить процедурный BGM синтезатор", icon: "🎵" },
    { id: "CRT_PURIST", title: "Фосфорное свечение", desc: "Активировать CRT-сканлайны и виньетку", icon: "📺" },
    { id: "P2P_WARRIOR", title: "P2P Рукопожатие", desc: "Создать WebRTC комнату для дуэли", icon: "🔗" }
  ],

  init() {
    this.load();
    this.unlock("FIRST_BOOT");
  },

  load() {
    try {
      const saved = localStorage.getItem('neo_cartridge_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        this.data = { ...this.data, ...parsed };
      }
    } catch (e) {
      console.warn("Storage error, fallback to memory", e);
    }
  },

  save() {
    try {
      localStorage.setItem('neo_cartridge_data', JSON.stringify(this.data));
    } catch (e) {
      console.warn("Failed to save to localStorage", e);
    }
  },

  getHighscore(gameId) {
    return this.data.highscores[gameId] || 0;
  },

  updateHighscore(gameId, score) {
    if (score > (this.data.highscores[gameId] || 0)) {
      this.data.highscores[gameId] = score;
      this.save();
      return true; // New record!
    }
    return false;
  },

  unlock(achieveId) {
    if (!this.data.achievements[achieveId]) {
      const info = this.achievementsList.find(a => a.id === achieveId);
      if (info) {
        this.data.achievements[achieveId] = Date.now();
        this.save();
        if (typeof Sound !== 'undefined') Sound.playPowerup();
        this.showAchievementToast(info);
      }
    }
  },

  showAchievementToast(info) {
    let container = document.getElementById('achievement-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'achievement-toast-container';
      container.className = 'achievement-toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'achieve-toast';
    toast.innerHTML = `
      <div class="achieve-icon">${info.icon}</div>
      <div class="achieve-info">
        <div class="achieve-tag">// АЧИВКА РАЗБЛОКИРОВАНА</div>
        <div class="achieve-title">${info.title}</div>
        <div class="achieve-desc">${info.desc}</div>
      </div>
    `;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('hide');
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  },

  exportSaveFile() {
    const jsonStr = JSON.stringify(this.data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `neo-cartridge-save-${new Date().toISOString().slice(0, 10)}.cart`;
    a.click();
    URL.revokeObjectURL(url);
  },

  importSaveFile(file, callback) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        if (parsed && parsed.highscores) {
          this.data = {
            ...this.data,
            ...parsed,
            highscores: { ...this.data.highscores, ...parsed.highscores },
            achievements: { ...this.data.achievements, ...(parsed.achievements || {}) },
            settings: { ...this.data.settings, ...(parsed.settings || {}) }
          };
          this.save();
          if (callback) callback(true);
        } else {
          if (callback) callback(false, "Неверный формат картридж-файла");
        }
      } catch (err) {
        if (callback) callback(false, "Ошибка чтения JSON");
      }
    };
    reader.readAsText(file);
  }
};
