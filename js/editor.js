/**
 * NEO-CARTRIDGE // CARTRIDGE STUDIO: Пиксельный редактор карт и спрайтов
 * 100% Client-side: хранение в LocalStorage, экспорт в Base64 / JSON
 */

const Editor = {
  canvas: null,
  ctx: null,
  gridDim: 16,
  currentColor: '#00FF88',
  pixels: [],
  isDrawing: false,

  palette: [
    '#00FF88', '#FF0055', '#FFB800', '#3B82F6', 
    '#A855F7', '#F0F4FC', '#4B5563', '#07090C'
  ],

  init() {
    this.canvas = document.getElementById('studio-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.resetGrid();
    this.setupPalette();
    this.setupListeners();
    this.render();
  },

  resetGrid() {
    this.pixels = Array(this.gridDim * this.gridDim).fill('#07090C');
  },

  setupPalette() {
    const palContainer = document.getElementById('studio-palette');
    if (!palContainer) return;

    palContainer.innerHTML = this.palette.map((color, idx) => `
      <button class="palette-swatch ${idx === 0 ? 'active' : ''}" 
              style="background-color: ${color};" 
              onclick="Editor.selectColor('${color}', this)"
              aria-label="Цвет ${color}"></button>
    `).join('');
  },

  selectColor(color, btnEl) {
    this.currentColor = color;
    document.querySelectorAll('.palette-swatch').forEach(b => b.classList.remove('active'));
    if (btnEl) btnEl.classList.add('active');
    Sound.playClick();
  },

  setupListeners() {
    if (!this.canvas) return;

    const getPos = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / rect.width;
      const scaleY = this.canvas.height / rect.height;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const x = Math.floor(((clientX - rect.left) * scaleX) / (this.canvas.width / this.gridDim));
      const y = Math.floor(((clientY - rect.top) * scaleY) / (this.canvas.height / this.gridDim));
      return { x, y };
    };

    const paint = (e) => {
      const { x, y } = getPos(e);
      if (x >= 0 && x < this.gridDim && y >= 0 && y < this.gridDim) {
        const idx = y * this.gridDim + x;
        if (this.pixels[idx] !== this.currentColor) {
          this.pixels[idx] = this.currentColor;
          this.render();
        }
      }
    };

    this.canvas.addEventListener('mousedown', (e) => {
      this.isDrawing = true;
      paint(e);
    });

    window.addEventListener('mouseup', () => {
      this.isDrawing = false;
    });

    this.canvas.addEventListener('mousemove', (e) => {
      if (this.isDrawing) paint(e);
    });

    // Touch support
    this.canvas.addEventListener('touchstart', (e) => {
      this.isDrawing = true;
      paint(e);
      e.preventDefault();
    }, { passive: false });

    this.canvas.addEventListener('touchmove', (e) => {
      if (this.isDrawing) paint(e);
      e.preventDefault();
    }, { passive: false });

    window.addEventListener('touchend', () => {
      this.isDrawing = false;
    });
  },

  render() {
    if (!this.ctx) return;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const cellSize = w / this.gridDim;

    this.ctx.clearRect(0, 0, w, h);

    for (let y = 0; y < this.gridDim; y++) {
      for (let x = 0; x < this.gridDim; x++) {
        const color = this.pixels[y * this.gridDim + x];
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);

        // Сетка
        this.ctx.strokeStyle = '#181C26';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }
  },

  clear() {
    this.resetGrid();
    this.render();
    Sound.playClick();
  },

  saveCustomMap() {
    const nameInput = document.getElementById('studio-map-name');
    const name = (nameInput && nameInput.value.trim()) || `MAP_ROM_${Date.now().toString().slice(-4)}`;
    
    const mapData = {
      name: name,
      date: new Date().toLocaleDateString('ru-RU'),
      pixels: this.pixels
    };

    Storage.data.customLevels.push(mapData);
    Storage.save();
    Storage.unlock("LEVEL_AUTHOR");
    Sound.playPowerup();

    alert(`Карта «${name}» сохранена в локальный флеш-чип консоли!`);
    if (window.App) window.App.closeModal('studio-modal');
  },

  exportAsPNG() {
    const link = document.createElement('a');
    link.download = `custom-sprite-${Date.now()}.png`;
    link.href = this.canvas.toDataURL();
    link.click();
    Sound.playCoin();
  }
};
