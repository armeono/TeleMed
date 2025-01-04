CREATE TABLE IF NOT EXISTS "messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"sender_id" integer,
	"receiver_id" integer,
	"message" text NOT NULL,
	"created_at" timestamp(3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_user_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "messages" ADD CONSTRAINT "messages_receiver_id_user_id_fk" FOREIGN KEY ("receiver_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
