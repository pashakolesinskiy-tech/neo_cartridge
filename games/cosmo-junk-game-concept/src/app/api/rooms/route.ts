import { makeRoomCode } from "@/lib/game/names";
import { createRoom, rooms, sweep } from "@/server/rooms";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST() {
  sweep();
  let code = makeRoomCode();
  let tries = 0;
  while (rooms.has(code) && tries < 20) {
    code = makeRoomCode();
    tries++;
  }
  const room = createRoom(code);
  return Response.json({ code: room.code, shipName: room.shipName });
}
