CREATE TYPE "public"."content_type" AS ENUM('skill', 'agent');--> statement-breakpoint
CREATE TABLE "content" (
	"id" text PRIMARY KEY NOT NULL,
	"owner_id" text NOT NULL,
	"type" "content_type" NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"latest_version_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "content_owner_type_name_unique" UNIQUE("owner_id","type","name")
);
--> statement-breakpoint
CREATE TABLE "content_version" (
	"id" text PRIMARY KEY NOT NULL,
	"content_id" text NOT NULL,
	"version" integer NOT NULL,
	"description" text NOT NULL,
	"body" text,
	"manifest" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "content_version_content_version_unique" UNIQUE("content_id","version")
);
--> statement-breakpoint
CREATE TABLE "upload_request" (
	"id" text PRIMARY KEY NOT NULL,
	"owner_id" text NOT NULL,
	"total_count" integer DEFAULT 0 NOT NULL,
	"success_count" integer DEFAULT 0 NOT NULL,
	"failure_count" integer DEFAULT 0 NOT NULL,
	"results" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "handle" text;--> statement-breakpoint
-- Backfill handles for existing users: slugify the email local-part and append
-- an incrementing suffix on collision (willem-meints, willem-meints-2, ...),
-- mirroring the runtime assignment in lib/handle.ts. Assumes ASCII local-parts,
-- which corporate (Keycloak) emails are; new users go through the unicode-aware
-- runtime path. Non-destructive: existing rows keep all their data.
WITH slugged AS (
	SELECT
		"id",
		COALESCE(
			NULLIF(trim(BOTH '-' FROM regexp_replace(lower(split_part("email", '@', 1)), '[^a-z0-9]+', '-', 'g')), ''),
			'user'
		) AS base
	FROM "user"
),
ranked AS (
	SELECT "id", base, row_number() OVER (PARTITION BY base ORDER BY "id") AS rn
	FROM slugged
)
UPDATE "user" AS u
SET "handle" = CASE WHEN r.rn = 1 THEN r.base ELSE r.base || '-' || r.rn END
FROM ranked r
WHERE u."id" = r."id";--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "handle" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "content" ADD CONSTRAINT "content_owner_id_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_version" ADD CONSTRAINT "content_version_content_id_content_id_fk" FOREIGN KEY ("content_id") REFERENCES "public"."content"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "upload_request" ADD CONSTRAINT "upload_request_owner_id_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "content_ownerId_idx" ON "content" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "content_version_contentId_idx" ON "content_version" USING btree ("content_id");--> statement-breakpoint
CREATE INDEX "upload_request_ownerId_idx" ON "upload_request" USING btree ("owner_id");--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_handle_unique" UNIQUE("handle");