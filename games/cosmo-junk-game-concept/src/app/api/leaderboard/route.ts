import { db } from "@/db";
import { leaderboard } from "@/db/schema";
import type { GameResult } from "@/lib/game/types";
import { rooms } from "@/server/rooms";
import { desc } from "drizzle-orm";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const rows = await db
      .select()
      .from(leaderboard)
      .orderBy(desc(leaderboard.score))
      .limit(10);
    return Response.json({ rows });
  } catch {
    return Response.json({ rows: [] });
  }
}

export async function POST(req: Request) {
  let body: {
    code?: string;
    shipName?: string;
    crew?: string[];
    bots?: number;
    result?: GameResult;
  };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "BAD_JSON" }, { status: 400 });
  }
  if (!body.code || !body.result || !body.shipName) {
    return Response.json({ error: "BAD_BODY" }, { status: 400 });
  }
  const room = rooms.get(body.code.toUpperCase());
  if (room?.savedResult) return Response.json({ ok: true, dedup: true });
  try {
    await db.insert(leaderboard).values({
      shipName: body.shipName.slice(0, 60),
      crew: JSON.stringify((body.crew ?? []).slice(0, 8)),
      score: Math.max(0, Math.round(body.result.score)),
      rankCode: body.result.rankCode,
      rankTitle: body.result.rankTitle.slice(0, 60),
      hull: body.result.hull,
      progress: body.result.progress,
      won: body.result.won,
      resolved: body.result.resolved,
      kills: body.result.kills,
      bots: Math.max(0, Math.min(4, Math.round(body.bots ?? 0))),
      durationSec: body.result.timeSec,
    });
    if (room) room.savedResult = true;
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "DB" }, { status: 500 });
  }
}
