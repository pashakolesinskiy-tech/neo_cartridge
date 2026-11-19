import { joinRoom, rooms } from "@/server/rooms";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Ctx = { params: Promise<{ code: string }> };

export async function POST(req: Request, ctx: Ctx) {
  const { code } = await ctx.params;
  const room = rooms.get(code.toUpperCase());
  if (!room) return Response.json({ error: "NOT_FOUND" }, { status: 404 });

  let body: { name?: string; playerId?: string } = {};
  try {
    body = await req.json();
  } catch {
    /* empty body ok */
  }
  const { player, rejoined } = joinRoom(room, body.name ?? "", body.playerId);
  return Response.json({
    playerId: player.id,
    role: player.role,
    name: player.name,
    shipName: room.shipName,
    phase: room.phase,
    rejoined,
  });
}
