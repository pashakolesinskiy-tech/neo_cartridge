import type { Snapshot } from "@/lib/game/types";
import { rooms, toPublic } from "@/server/rooms";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Ctx = { params: Promise<{ code: string }> };

/** Хост (главный экран): управление фазами + публикация снапшота */
export async function POST(req: Request, ctx: Ctx) {
  const { code } = await ctx.params;
  const room = rooms.get(code.toUpperCase());
  if (!room) return Response.json({ error: "NOT_FOUND" }, { status: 404 });

  let body: { op?: string; snapshot?: Snapshot };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "BAD_JSON" }, { status: 400 });
  }
  room.hostLastSeen = Date.now();

  switch (body.op) {
    case "start":
      room.phase = "playing";
      room.snapshot = null;
      room.savedResult = false;
      break;
    case "reset":
      room.phase = "lobby";
      room.snapshot = null;
      room.savedResult = false;
      room.inputs = [];
      break;
    case "snapshot":
      if (body.snapshot) room.snapshot = body.snapshot;
      break;
    default:
      return Response.json({ error: "BAD_OP" }, { status: 400 });
  }
  return Response.json({ ok: true, ...toPublic(room) });
}
