ALTER TABLE "patient" DROP CONSTRAINT "patient_jmbg_unique";--> statement-breakpoint
ALTER TABLE "patient" ALTER COLUMN "jmbg" DROP NOT NULL;