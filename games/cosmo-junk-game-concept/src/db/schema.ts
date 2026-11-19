import { boolean, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const leaderboard = pgTable("leaderboard", {
  id: serial("id").primaryKey(),
  shipName: text("ship_name").notNull(),
  crew: text("crew").notNull().default("[]"),
  score: integer("score").notNull(),
  rankCode: text("rank_code").notNull(),
  rankTitle: text("rank_title").notNull(),
  hull: integer("hull").notNull().default(0),
  progress: integer("progress").notNull().default(0),
  won: boolean("won").notNull().default(false),
  resolved: integer("resolved").notNull().default(0),
  kills: integer("kills").notNull().default(0),
  bots: integer("bots").notNull().default(0),
  durationSec: integer("duration_sec").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
