ALTER TABLE "patient_responses" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "patient_responses" CASCADE;--> statement-breakpoint
ALTER TABLE "questions" RENAME TO "medical_inquiry";--> statement-breakpoint
ALTER TABLE "medical_inquiry" DROP CONSTRAINT "questions_doctor_id_doctor_id_fk";
--> statement-breakpoint
ALTER TABLE "medical_inquiry" DROP CONSTRAINT "questions_patient_id_patient_id_fk";
--> statement-breakpoint
ALTER TABLE "medical_inquiry" ADD COLUMN "predefined_questions" jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "medical_inquiry" ADD COLUMN "patient_question" text NOT NULL;--> statement-breakpoint
ALTER TABLE "medical_inquiry" ADD COLUMN "img_url" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "medical_inquiry" ADD CONSTRAINT "medical_inquiry_doctor_id_doctor_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctor"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "medical_inquiry" ADD CONSTRAINT "medical_inquiry_patient_id_patient_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patient"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "medical_inquiry" DROP COLUMN IF EXISTS "text";--> statement-breakpoint
ALTER TABLE "medical_inquiry" DROP COLUMN IF EXISTS "is_active";