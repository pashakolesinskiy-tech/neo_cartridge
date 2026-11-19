const ADJ = [
  "РЖАВЫЙ", "ПЬЯНЫЙ", "КОСМИЧЕСКИЙ", "ПОСЛЕДНИЙ", "ВЕСЁЛЫЙ", "СЛОМАННЫЙ",
  "НЕУТОМИМЫЙ", "МЯТЫЙ", "ХРАБРЫЙ", "ЗВЕНЯЩИЙ", "ДРЕМУЧИЙ", "ПОДОЗРИТЕЛЬНЫЙ",
];
const NOUN = [
  "ТАЗИК", "САМОВАР", "ПЕНЁК", "БАРЖА-9", "УТЮГ", "ЧАЙНИК", "ВАРЕНИК",
  "ТРАКТОР", "ПЫЛЕСОС", "ГВОЗДЬ", "ЧЕМОДАН", "БАРАК", "САПОГ", "КОВШ",
];
const CALLSIGNS = [
  "БОРЯ", "ГРИША", "ЗИНА", "КЭП", "МАКС", "ТАСЯ", "ФЕДЯ", "ЮЛЬКА",
  "ВАЛЕРА", "ДОЗИМЕТР", "ШТИРЛИЦ", "ПРОФЕССОР", "БОЦМАН", "ЧИЖ",
];

export function randomShipName(rnd: () => number = Math.random): string {
  const a = ADJ[Math.floor(rnd() * ADJ.length)];
  const n = NOUN[Math.floor(rnd() * NOUN.length)];
  return `${a} «${n}»`;
}

export function randomCallsign(rnd: () => number = Math.random): string {
  return CALLSIGNS[Math.floor(rnd() * CALLSIGNS.length)];
}

/** Позывные железных членов экипажа */
export const BOT_NAMES: Record<string, string[]> = {
  pilot: ["АП-9000", "ЖЕЛЕЗНЫЙ БОРЯ", "РУЛЬ-О-МАТ"],
  engineer: ["КЛЮЧ-14", "ГАЙКА-БОТ", "ИСКРА-7"],
  gunner: ["ЩИТ-О-ТРОН", "ПУШКА-12", "ЖЕСТЯНКА"],
  navigator: ["ЧИТАЛКА-3000", "МАНУАЛ-БОТ", "УМНИК-8"],
  spectator: ["ЗЕВАКА-1"],
};

export function botName(role: string, rnd: () => number = Math.random): string {
  const pool = BOT_NAMES[role] ?? ["БОТ"];
  return pool[Math.floor(rnd() * pool.length)];
}

export function makeRoomCode(rnd: () => number = Math.random): string {
  const ABC = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 4; i++) s += ABC[Math.floor(rnd() * ABC.length)];
  return s;
}
