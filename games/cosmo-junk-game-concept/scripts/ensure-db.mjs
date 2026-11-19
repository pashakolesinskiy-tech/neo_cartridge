// Создаёт таблицу лидерборда, если её нет (для самостоятельного хостинга в Docker).
import pg from "pg";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("[ensure-db] DATABASE_URL не задан — таблица не создана");
  process.exit(1);
}

const client = new pg.Client({ connectionString: url });
try {
  await client.connect();
  await client.query(`
    CREATE TABLE IF NOT EXISTS "leaderboard" (
      "id" serial PRIMARY KEY NOT NULL,
      "ship_name" text NOT NULL,
      "crew" text DEFAULT '[]' NOT NULL,
      "score" integer NOT NULL,
      "rank_code" text NOT NULL,
      "rank_title" text NOT NULL,
      "hull" integer DEFAULT 0 NOT NULL,
      "progress" integer DEFAULT 0 NOT NULL,
      "won" boolean DEFAULT false NOT NULL,
      "resolved" integer DEFAULT 0 NOT NULL,
      "kills" integer DEFAULT 0 NOT NULL,
      "duration_sec" integer DEFAULT 0 NOT NULL,
      "created_at" timestamp with time zone DEFAULT now() NOT NULL
    );
  `);
  console.log("[ensure-db] таблица leaderboard готова");
} catch (err) {
  console.error("[ensure-db] не удалось подготовить БД:", err?.message ?? err);
  process.exit(1);
} finally {
  await client.end().catch(() => undefined);
}
