CREATE TABLE "leaderboard" (
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
