ALTER TABLE "appointment" RENAME COLUMN "appointmentTime" TO "appointment_time";--> statement-breakpoint
ALTER TABLE "appointment" ADD COLUMN "symptoms" text;--> statement-breakpoint
ALTER TABLE "appointment" ADD COLUMN "uploaded_files" jsonb DEFAULT '[]'::jsonb;