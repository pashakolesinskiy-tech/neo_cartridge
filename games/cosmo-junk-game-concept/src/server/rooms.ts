// ====== In-memory room store (single Node process, survives via globalThis) ======
import { randomCallsign, randomShipName } from "@/lib/game/names";
import type {
  InputMsg, Phase, PlayerInfo, QueuedInput, Role, RoomPublic, Snapshot,
} from "@/lib/game/types";
import { ROLE_ORDER } from "@/lib/game/types";

export interface Room {
  code: string;
  shipName: string;
  phase: Phase;
  players: PlayerInfo[];
  inputs: QueuedInput[];
  inputSeq: number;
  snapshot: Snapshot | null;
  createdAt: number;
  hostLastSeen: number;
  savedResult: boolean;
}

const globalRooms = globalThis as unknown as { __cosmoRooms?: Map<string, Room> };
export const rooms = (globalRooms.__cosmoRooms ??= new Map<string, Room>());

const HOST_TIMEOUT = 7000;
const PLAYER_TIMEOUT = 9000;
const ROOM_TTL = 3 * 60 * 60 * 1000;

export function sweep() {
  const now = Date.now();
  for (const [code, room] of rooms) {
    const anyAlive =
      now - room.hostLastSeen < ROOM_TTL &&
      (now - room.hostLastSeen < 15_000 ||
        room.players.some((pl) => now - lastSeenMap(room).get(pl.id)! < 15_000));
    if (!anyAlive || now - room.createdAt > ROOM_TTL) rooms.delete(code);
  }
}

// heartbeats tracked alongside players
const lastSeenStore = globalThis as unknown as { __cosmoSeen?: Map<string, number> };
export const lastSeen = (lastSeenStore.__cosmoSeen ??= new Map<string, number>());
function lastSeenMap(room: Room) {
  const m = new Map<string, number>();
  for (const pl of room.players) m.set(pl.id, lastSeen.get(`${room.code}:${pl.id}`) ?? room.createdAt);
  return m;
}

function refreshConnected(room: Room) {
  const now = Date.now();
  for (const pl of room.players) {
    pl.connected = now - (lastSeen.get(`${room.code}:${pl.id}`) ?? 0) < PLAYER_TIMEOUT;
  }
}

export function createRoom(code: string): Room {
  const room: Room = {
    code,
    shipName: randomShipName(),
    phase: "lobby",
    players: [],
    inputs: [],
    inputSeq: 0,
    snapshot: null,
    createdAt: Date.now(),
    hostLastSeen: Date.now(),
    savedResult: false,
  };
  rooms.set(code, room);
  return room;
}

export function joinRoom(
  room: Room,
  name: string,
  playerId?: string
): { player: PlayerInfo; rejoined: boolean } {
  if (playerId) {
    const existing = room.players.find((p) => p.id === playerId);
    if (existing) {
      if (name && name !== existing.name) existing.name = name;
      lastSeen.set(`${room.code}:${existing.id}`, Date.now());
      return { player: existing, rejoined: true };
    }
  }
  const id = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
  const taken = new Set(room.players.map((p) => p.role));
  const role: Role = ROLE_ORDER.find((r) => !taken.has(r)) ?? "spectator";
  const player: PlayerInfo = {
    id,
    name: (name || randomCallsign()).toUpperCase().slice(0, 12),
    role,
    connected: true,
  };
  room.players.push(player);
  lastSeen.set(`${room.code}:${player.id}`, Date.now());
  return { player, rejoined: false };
}

export function heartbeat(room: Room, playerId: string) {
  lastSeen.set(`${room.code}:${playerId}`, Date.now());
}

export function addInput(room: Room, playerId: string, role: Role, msg: InputMsg) {
  if (room.phase !== "playing") return;
  room.inputSeq++;
  room.inputs.push({ ...msg, playerId, role, seq: room.inputSeq });
  if (room.inputs.length > 400) room.inputs.splice(0, room.inputs.length - 400);
}

export function drainInputs(room: Room): QueuedInput[] {
  if (room.inputs.length === 0) return [];
  const out = room.inputs;
  room.inputs = [];
  return out;
}

export function toPublic(room: Room): RoomPublic {
  refreshConnected(room);
  return {
    code: room.code,
    shipName: room.shipName,
    phase: room.phase,
    createdAt: room.createdAt,
    players: room.players.map((p) => ({ ...p })),
    snapshot: room.snapshot,
    hostOnline: Date.now() - room.hostLastSeen < HOST_TIMEOUT,
  };
}
