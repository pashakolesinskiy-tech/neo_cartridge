import LandingClient from "@/components/landing/LandingClient";
import { db } from "@/db";
import { leaderboard } from "@/db/schema";
import { desc } from "drizzle-orm";
import { Skull, Trophy } from "lucide-react";

export const dynamic = "force-dynamic";

const RANK_COLORS: Record<string, string> = {
  S: "#57e6e6",
  A: "#3bff8f",
  B: "#ffb000",
  C: "#ff8c42",
  D: "#b0723a",
  X: "#ff3b5b",
};

async function getTop() {
  try {
    return await db.select().from(leaderboard).orderBy(desc(leaderboard.score)).limit(8);
  } catch {
    return [];
  }
}

export default async function Home() {
  const rows = await getTop();

  return (
    <main>
      <LandingClient />

      {/* ЗАЛ СЛАВЫ */}
      <section className="relative z-10 mx-auto max-w-4xl px-4 pb-16">
        <div className="pxl-panel p-6">
          <div className="flex items-center gap-3">
            <Trophy className="h-5 w-5 text-amber-300" />
            <h2 className="font-pixel text-sm text-amber-300">ЗАЛ СЛАВЫ СЕКТОРА</h2>
          </div>

          {rows.length === 0 ? (
            <div className="mt-6 flex items-center gap-3 font-term text-sm text-slate-500">
              <Skull className="h-4 w-4" />
              Пока пусто. Ни один экипаж не вернулся… то есть, не записался. Будьте первыми!
            </div>
          ) : (
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[560px] font-term text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-left text-[10px] tracking-[0.25em] text-slate-500">
                    <th className="py-2 pr-3">КОРАБЛЬ</th>
                    <th className="py-2 pr-3">ЭКИПАЖ</th>
                    <th className="py-2 pr-3">РАНГ</th>
                    <th className="py-2 pr-3 text-right">ОЧКИ</th>
                    <th className="py-2 text-right">КОРПУС</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => {
                    let crew: string[] = [];
                    try {
                      crew = JSON.parse(r.crew) as string[];
                    } catch {
                      crew = [];
                    }
                    return (
                      <tr key={r.id} className="border-b border-slate-900/80 text-slate-300">
                        <td className="py-2.5 pr-3 font-pixel text-[10px] text-cyan-200">
                          {r.shipName}
                        </td>
                        <td className="py-2.5 pr-3 text-xs text-slate-400">
                          {crew.join(" · ") || "—"}
                          {r.bots > 0 && (
                            <span className="ml-2 whitespace-nowrap text-[10px] text-emerald-400/80">
                              ботов: {r.bots}
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 pr-3">
                          <span
                            className="font-pixel text-[10px]"
                            style={{ color: RANK_COLORS[r.rankCode] ?? "#fff" }}
                            title={r.rankTitle}
                          >
                            {r.rankCode} {r.rankTitle}
                          </span>
                        </td>
                        <td className="py-2.5 pr-3 text-right text-amber-200">{r.score}</td>
                        <td className="py-2.5 text-right text-slate-400">
                          {r.won ? `${r.hull}%` : "0%"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <p className="mt-8 text-center font-term text-[11px] text-slate-600">
          КОСМО-ХЛАМ · собрано на болоте сектора 7 · вибрация телефона прилагается
        </p>
      </section>
    </main>
  );
}
