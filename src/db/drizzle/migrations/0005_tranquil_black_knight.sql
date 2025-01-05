ALTER TABLE "appointment" ADD COLUMN "questions" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "appointment" ADD COLUMN "room_url" text;