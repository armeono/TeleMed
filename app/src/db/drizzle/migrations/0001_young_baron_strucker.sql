ALTER TABLE "doctor" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "doctor" ALTER COLUMN "years_of_experience" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "patient" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "patient" DROP COLUMN IF EXISTS "date_of_birth";