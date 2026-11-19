// ====== Shared game protocol types (client + server) ======

export type Role = "pilot" | "engineer" | "gunner" | "navigator" | "spectator";
export type Phase = "lobby" | "playing" | "ended";
export type BreakerId = "A1" | "A2" | "B1" | "B2";
/** 0 = НОС (справа) · 1 = ВЕРХ · 2 = КОРМА (слева) · 3 = НИЗ */
export type ShieldSide = 0 | 1 | 2 | 3;

export const ROLE_ORDER: Role[] = ["pilot", "engineer", "gunner", "navigator"];

export const ROLE_META: Record<
  Role,
  { label: string; color: string; dim: string; desc: string }
> = {
  pilot: {
    label: "ПИЛОТ",
    color: "#ffb000",
    dim: "#7a5600",
    desc: "ШТУРВАЛ · ТЯГА · ГИПЕРПРЫЖОК",
  },
  engineer: {
    label: "ИНЖЕНЕР",
    color: "#3bff8f",
    dim: "#0f6b3a",
    desc: "ПРЕДОХРАНИТЕЛИ · ОХЛАЖДЕНИЕ · ПОЖАРЫ",
  },
  gunner: {
    label: "КАНОНИР",
    color: "#ff4bd8",
    dim: "#7a1f68",
    desc: "ЩИТ · ПУШКА · ПЕРЕЗАГРУЗКА",
  },
  navigator: {
    label: "НАВИГАТОР",
    color: "#57e6e6",
    dim: "#1c6b70",
    desc: "СПРАВОЧНИК АВАРИЙ · КОДЫ",
  },
  spectator: {
    label: "ЗРИТЕЛЬ",
    color: "#8ea3b3",
    dim: "#33424e",
    desc: "МОРАЛЬНАЯ ПОДДЕРЖКА",
  },
};

export const SHIELD_LABELS = ["НОС", "ВЕРХ", "КОРМА", "НИЗ"] as const;

export type InputMsg =
  | { kind: "held"; key: "up" | "down" | "thrust"; v: boolean }
  | { kind: "hyper" }
  | { kind: "shield"; side: ShieldSide }
  | { kind: "fire" }
  | { kind: "extinguish" }
  | { kind: "coolant"; v: boolean }
  | { kind: "breaker"; id: BreakerId; v: boolean }
  | { kind: "reboot" }
  | { kind: "cheer" };

export type QueuedInput = InputMsg & { playerId: string; role: Role; seq: number };

// ====== Snapshot: authoritative state broadcast to phones ======

export interface ErrorInfo {
  code: string;
  title: string;
  tLeft: number;
  dur: number;
}

export interface GameResult {
  won: boolean;
  score: number;
  rankCode: "S" | "A" | "B" | "C" | "D" | "X";
  rankTitle: string;
  hull: number;
  progress: number;
  resolved: number;
  failed: number;
  kills: number;
  timeSec: number;
}

export interface Snapshot {
  phase: Phase;
  t: number;
  hull: number;
  heat: number;
  fires: number;
  breakers: Record<BreakerId, boolean>;
  shieldSide: ShieldSide;
  shieldUp: boolean;
  coolantOn: boolean;
  rebootT: number; // -1 idle, otherwise 0..REBOOT_DUR
  errors: ErrorInfo[];
  patternTarget: boolean[] | null;
  hazards: string[]; // "storm" | "gravity" | "pirates"
  heldNote: { up: boolean; down: boolean; thrust: boolean };
  progress: number; // 0..1
  speed: number;
  cds: { fire: number; extinguish: number; hyper: number; fireMax: number };
  shakeSeq: number;
  lastShake: number;
  errSeq: number;
  result: GameResult | null;
  log: string[];
  tripped: BreakerId | null;
}

export interface PlayerInfo {
  id: string;
  name: string;
  role: Role;
  connected: boolean;
}

export interface RoomPublic {
  code: string;
  shipName: string;
  phase: Phase;
  createdAt: number;
  players: PlayerInfo[];
  snapshot: Snapshot | null;
  hostOnline: boolean;
}
