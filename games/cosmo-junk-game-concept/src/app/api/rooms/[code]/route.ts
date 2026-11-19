import { drainInputs, heartbeat, rooms, toPublic } from "@/server/rooms";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Ctx = { params: Promise<{ code: string }> };

export async function GET(req: Request, ctx: Ctx) {
  const { code } = await ctx.params;
  const room = rooms.get(code.toUpperCase());
  if (!room) return Response.json({ error: "NOT_FOUND" }, { status: 404 });

  const url = new URL(req.url);
  const host = url.searchParams.get("host") === "1";
  const playerId = url.searchParams.get("player");

  let inputs: unknown[] | undefined;
  if (host) {
    room.hostLastSeen = Date.now();
    inputs = drainInputs(room);
  }
  if (playerId) heartbeat(room, playerId);

  return Response.json({ ...toPublic(room), ...(host ? { inputs } : {}) });
}
