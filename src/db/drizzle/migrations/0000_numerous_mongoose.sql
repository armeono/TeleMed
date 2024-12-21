CREATE TYPE "public"."allergies" AS ENUM('PENICILLIN', 'ASPIRIN', 'SULFA DRUGS', 'INSULIN', 'IODINE', 'CODEINE', 'LATEX', 'PEANUTS', 'SHELLFISH', 'DAIRY', 'EGGS', 'SOY', 'WHEAT', 'NICKEL', 'PET DANDER', 'POLLEN', 'OTHER', 'NO_ALLERGIES');--> statement-breakpoint
CREATE TYPE "public"."appointmentStatus" AS ENUM('SCHEDULED', 'COMPLETED', 'CANCELED');--> statement-breakpoint
CREATE TYPE "public"."appointment_type" AS ENUM('ONLINE', 'IN_PERSON');--> statement-breakpoint
CREATE TYPE "public"."area" AS ENUM('UNSKO_SANSKI', 'POSAVSKI', 'TUZLANSKI', 'ZENICKO_DOBOJSKI', 'BOSANSKO_PODRINJSKI', 'SREDNJOBOSANSKI', 'HERCEGOVACKO_NERETVANSKI', 'ZAPADNOHERCEGOVACKI', 'SARAJEVO', 'CANTON_10');--> statement-breakpoint
CREATE TYPE "public"."availability" AS ENUM('ONLINE', 'OFFLINE', 'BUSY');--> statement-breakpoint
CREATE TYPE "public"."blood_type" AS ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'NO_BLOOD_TYPE');--> statement-breakpoint
CREATE TYPE "public"."chronic_conditions" AS ENUM('DIABETES', 'HYPERTENSION', 'CANCER', 'HEART_DISEASE', 'KIDNEY_DISEASE', 'LIVER_DISEASE', 'LUNG_DISEASE', 'THYROID_DISEASE', 'ARTHRITIS', 'OSTEOPOROSIS', 'ANEMIA', 'ASTHMA', 'COPD', 'HIV/AIDS', 'EPILEPSY', 'PSYCHIATRIC_DISORDER', 'OTHER', 'NO_CHRONIC_CONDITIONS');--> statement-breakpoint
CREATE TYPE "public"."gender" AS ENUM('MALE', 'FEMALE');--> statement-breakpoint
CREATE TYPE "public"."patient_status" AS ENUM('CRITICAL', 'ACTIVE', 'INACTIVE');--> statement-breakpoint
CREATE TYPE "public"."record_type" AS ENUM('DIAGNOSIS', 'TREATMENT', 'PRESCRIPTION', 'TEST_RESULTS');--> statement-breakpoint
CREATE TYPE "public"."specialization" AS ENUM('INTERNAL_MEDICINE', 'FAMILY_MEDICINE', 'DERMATOLOGY', 'GASTROENTEROLOGY', 'CARDIOLOGY', 'PEDIATRICS', 'ORTHOPEDICS');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('DOCTOR', 'PATIENT');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "appointment" (
	"id" serial PRIMARY KEY NOT NULL,
	"patient_id" integer,
	"doctor_id" integer,
	"date" timestamp NOT NULL,
	"type" "appointment_type",
	"time" varchar(256) NOT NULL,
	"status" "appointmentStatus",
	"feedback" text,
	"created_at" timestamp(3) DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "doctor" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"medical_license" varchar(256) NOT NULL,
	"specialization" "specialization",
	"years_of_experience" integer,
	"bio" text,
	"area" "area",
	"availability" "availability",
	"created_at" timestamp(3) DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) DEFAULT now(),
	CONSTRAINT "doctor_medical_license_unique" UNIQUE("medical_license")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "health_records" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"type" "record_type",
	"file" text,
	"created_at" timestamp(3) DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "medical_inquiry" (
	"id" serial PRIMARY KEY NOT NULL,
	"doctor_id" integer,
	"patient_id" integer,
	"predefined_questions" jsonb NOT NULL,
	"patient_question" text NOT NULL,
	"img_url" text,
	"created_at" timestamp(3) DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "patient_on_doctor" (
	"id" serial PRIMARY KEY NOT NULL,
	"doctor_id" integer NOT NULL,
	"patient_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "patient" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"medical_id" varchar(256) NOT NULL,
	"jmbg" varchar(256),
	"gender" "gender",
	"address" text,
	"area" "area",
	"status" "patient_status" DEFAULT 'ACTIVE',
	"weight" text DEFAULT 'N/A',
	"height" text DEFAULT 'N/A',
	"blood_type" "blood_type"[] DEFAULT '{"NO_BLOOD_TYPE"}',
	"allergies" "allergies"[] DEFAULT '{"NO_ALLERGIES"}',
	"chronic_conditions" "chronic_conditions"[] DEFAULT '{"NO_CHRONIC_CONDITIONS"}',
	"created_at" timestamp(3) DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) DEFAULT now(),
	CONSTRAINT "patient_medical_id_unique" UNIQUE("medical_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"role" "user_role",
	"first_name" varchar(256) NOT NULL,
	"last_name" varchar(256) NOT NULL,
	"email" varchar(256) NOT NULL,
	"password" text NOT NULL,
	"area" "area",
	"phone" varchar(20),
	"photo" text,
	"created_at" timestamp(3) DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) DEFAULT now(),
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "video_call" (
	"id" serial PRIMARY KEY NOT NULL,
	"patient_id" integer,
	"doctor_id" integer,
	"start_time" timestamp NOT NULL,
	"end_time" timestamp NOT NULL,
	"created_at" timestamp(3) DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) DEFAULT now()
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "appointment" ADD CONSTRAINT "appointment_patient_id_patient_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patient"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "appointment" ADD CONSTRAINT "appointment_doctor_id_doctor_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctor"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "doctor" ADD CONSTRAINT "doctor_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "health_records" ADD CONSTRAINT "health_records_user_id_patient_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."patient"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
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
DO $$ BEGIN
 ALTER TABLE "patient_on_doctor" ADD CONSTRAINT "patient_on_doctor_doctor_id_doctor_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctor"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "patient_on_doctor" ADD CONSTRAINT "patient_on_doctor_patient_id_patient_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patient"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "patient" ADD CONSTRAINT "patient_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "video_call" ADD CONSTRAINT "video_call_patient_id_patient_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patient"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "video_call" ADD CONSTRAINT "video_call_doctor_id_doctor_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctor"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
