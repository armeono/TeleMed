ALTER TABLE "appointment" ADD COLUMN "appointmentTime" timestamp(3) NOT NULL;--> statement-breakpoint
ALTER TABLE "appointment" DROP COLUMN IF EXISTS "time";