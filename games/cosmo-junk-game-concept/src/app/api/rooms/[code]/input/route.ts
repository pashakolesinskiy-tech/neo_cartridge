import type { InputMsg, Role } from "@/lib/game/types";
import { addInput, heartbeat, rooms } from "@/server/rooms";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Ctx = { params: Promise<{ code: string }> };

export async function POST(req: Request, ctx: Ctx) {
  const { code } = await ctx.params;
  const room = rooms.get(code.toUpperCase());
  if (!room) return Response.json({ error: "NOT_FOUND" }, { status: 404 });

  let body: { playerId?: string; role?: Role; msg?: InputMsg };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "BAD_JSON" }, { status: 400 });
  }
  if (!body.playerId || !body.role || !body.msg) {
    return Response.json({ error: "BAD_BODY" }, { status: 400 });
  }
  heartbeat(room, body.playerId);
  addInput(room, body.playerId, body.role, body.msg);
  return Response.json({ ok: true });
}
