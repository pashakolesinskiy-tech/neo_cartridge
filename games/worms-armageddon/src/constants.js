export const WORLD_W = 1800;
export const WORLD_H = 900;
export const BASE_WATER_Y = 815;

export const DT = 1 / 60;
export const GRAVITY = 420;
export const WIND_ACCEL_SCALE = 1.65;
export const WORM_RADIUS = 10;
export const MAX_STEP_UP = 8;
export const WALK_SPEED = 78;
export const FALL_DAMAGE_VEL = 340;
export const FALL_DAMAGE_SCALE = 0.085;

export const PHASES = Object.freeze({
  SETUP: 'SETUP',
  PLAYER_TURN: 'PLAYER_TURN',
  CHARGING: 'CHARGING',
  JETPACK: 'JETPACK',
  BLOWTORCH: 'BLOWTORCH',
  ROPE: 'ROPE',
  DRILL: 'DRILL',
  PROJECTILE_ACTIVE: 'PROJECTILE_ACTIVE',
  RETREAT: 'RETREAT',
  RESOLVING: 'RESOLVING',
  TURN_TRANSITION: 'TURN_TRANSITION',
  GAME_OVER: 'GAME_OVER',
});

export const TEAM_PALETTES = [
  {
    name: 'Красная бригада',
    color: '#ff4757',
    dark: '#b31d2b',
    light: '#ff7b87',
    badgeBg: 'rgba(179, 29, 43, 0.9)',
  },
  {
    name: 'Синий взвод',
    color: '#2e9cff',
    dark: '#145fa8',
    light: '#76c0ff',
    badgeBg: 'rgba(20, 95, 168, 0.9)',
  },
  {
    name: 'Золотой отряд',
    color: '#ffd32a',
    dark: '#b58b00',
    light: '#ffe885',
    badgeBg: 'rgba(155, 118, 0, 0.92)',
  },
  {
    name: 'Изумрудный корпус',
    color: '#2ed573',
    dark: '#168744',
    light: '#7bed9f',
    badgeBg: 'rgba(22, 135, 68, 0.9)',
  },
];

export const WORM_NAMES = [
  'Богги Б',
  'Спэдж',
  'Клэгнат',
  'Сержант Сквирм',
  'Майор Грязь',
  'Рядовой Пинки',
  'Сэр Вигглз',
  'Капрал Краулер',
  'Лейтенант Выпад',
  'Лапша',
  'Прыгун',
  'Грохот',
  'Серж',
  'Toby',
  'Fizz',
  'Crater',
];

export const THEMES = {
  meadow: {
    id: 'meadow',
    label: 'Зелёные холмы',
    skyTop: '#163d6b',
    skyMid: '#377eb8',
    skyBottom: '#93d5f5',
    cloudColor: 'rgba(255, 255, 255, 0.35)',
    mountainBack: '#2b5878',
    mountainFront: '#386f8c',
    crustTop: [122, 224, 72],
    crustMain: [66, 174, 52],
    crustShadow: [40, 116, 36],
    soilLight: [124, 83, 52],
    soilMid: [96, 62, 38],
    soilDark: [68, 44, 28],
    pebbleColor: [148, 108, 76],
    waterTop: 'rgba(38, 182, 232, 0.68)',
    waterDeep: 'rgba(10, 82, 138, 0.88)',
    waterFoam: 'rgba(215, 248, 255, 0.78)',
    isLava: false,
  },
  arctic: {
    id: 'arctic',
    label: 'Арктический мороз',
    skyTop: '#0b1530',
    skyMid: '#183766',
    skyBottom: '#5a8bbd',
    cloudColor: 'rgba(170, 235, 255, 0.24)',
    mountainBack: '#1f395e',
    mountainFront: '#2e527d',
    crustTop: [244, 252, 255],
    crustMain: [195, 232, 248],
    crustShadow: [128, 184, 218],
    soilLight: [82, 114, 148],
    soilMid: [58, 84, 115],
    soilDark: [39, 57, 82],
    pebbleColor: [115, 158, 194],
    waterTop: 'rgba(54, 148, 214, 0.72)',
    waterDeep: 'rgba(11, 44, 92, 0.90)',
    waterFoam: 'rgba(232, 250, 255, 0.82)',
    isLava: false,
  },
  desert: {
    id: 'desert',
    label: 'Закатное плато',
    skyTop: '#2e1647',
    skyMid: '#943c54',
    skyBottom: '#f29f58',
    cloudColor: 'rgba(255, 210, 165, 0.26)',
    mountainBack: '#5e2c48',
    mountainFront: '#874247',
    crustTop: [255, 218, 128],
    crustMain: [228, 172, 82],
    crustShadow: [176, 118, 48],
    soilLight: [181, 98, 56],
    soilMid: [144, 72, 42],
    soilDark: [102, 49, 29],
    pebbleColor: [204, 129, 78],
    waterTop: 'rgba(32, 168, 198, 0.70)',
    waterDeep: 'rgba(13, 74, 108, 0.88)',
    waterFoam: 'rgba(204, 248, 252, 0.72)',
    isLava: false,
  },
  volcano: {
    id: 'volcano',
    label: 'Вулканическая крепость',
    skyTop: '#160910',
    skyMid: '#48131d',
    skyBottom: '#a63322',
    cloudColor: 'rgba(255, 130, 82, 0.18)',
    mountainBack: '#2d1118',
    mountainFront: '#461a21',
    crustTop: [142, 128, 136],
    crustMain: [86, 76, 82],
    crustShadow: [52, 44, 50],
    soilLight: [68, 54, 58],
    soilMid: [47, 36, 40],
    soilDark: [30, 22, 26],
    pebbleColor: [186, 74, 34],
    waterTop: 'rgba(255, 112, 24, 0.84)',
    waterDeep: 'rgba(168, 26, 6, 0.96)',
    waterFoam: 'rgba(255, 226, 98, 0.86)',
    isLava: true,
  },
};
