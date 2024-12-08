CREATE TYPE "public"."appointmentStatus" AS ENUM('SCHEDULED', 'COMPLETED', 'CANCELED');--> statement-breakpoint
CREATE TYPE "public"."area" AS ENUM('UNSKO_SANSKI', 'POSAVSKI', 'TUZLANSKI', 'ZENICKO_DOBOJSKI', 'BOSANSKO_PODRINJSKI', 'SREDNJOBOSANSKI', 'HERCEGOVACKO_NERETVANSKI', 'ZAPADNOHERCEGOVACKI', 'SARAJEVO', 'CANTON_10');--> statement-breakpoint
CREATE TYPE "public"."availability" AS ENUM('ONLINE', 'OFFLINE', 'BUSY');--> statement-breakpoint
CREATE TYPE "public"."gender" AS ENUM('MALE', 'FEMALE');--> statement-breakpoint
CREATE TYPE "public"."record_type" AS ENUM('DIAGNOSIS', 'TREATMENT', 'PRESCRIPTION', 'TEST_RESULTS');--> statement-breakpoint
CREATE TYPE "public"."specialization" AS ENUM('INTERNAL_MEDICINE', 'FAMILY_MEDICINE', 'DERMATOLOGY', 'GASTROENTEROLOGY', 'CARDIOLOGY', 'PEDIATRICS', 'ORTHOPEDICS');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('DOCTOR', 'PATIENT');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "appointment" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "appointment_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"patient_id" integer,
	"doctor_id" integer,
	"date" timestamp NOT NULL,
	"time" varchar(256) NOT NULL,
	"status" "appointmentStatus",
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "doctor" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "doctor_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" integer,
	"medical_license" varchar(256) NOT NULL,
	"specialization" "specialization",
	"years_of_experience" integer NOT NULL,
	"bio" text,
	"area" "area",
	"availability" "availability",
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "doctor_medical_license_unique" UNIQUE("medical_license")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "health_records" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "health_records_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" integer,
	"type" "record_type",
	"description" text,
	"file" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "patient_responses" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "patient_responses_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"patient_id" integer,
	"appointment_id" integer,
	"text" text NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "patient" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "patient_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" integer,
	"date_of_birth" timestamp,
	"medical_id" varchar(256) NOT NULL,
	"jmbg" varchar(256) NOT NULL,
	"gender" "gender",
	"address" text,
	"area" "area",
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "patient_medical_id_unique" UNIQUE("medical_id"),
	CONSTRAINT "patient_jmbg_unique" UNIQUE("jmbg")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "questions" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "questions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"doctor_id" integer,
	"patient_id" integer,
	"text" text NOT NULL,
	"is_active" timestamp,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "user_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"role" "user_role",
	"first_name" varchar(256) NOT NULL,
	"last_name" varchar(256) NOT NULL,
	"email" varchar(256) NOT NULL,
	"password" text NOT NULL,
	"area" "area",
	"phone" varchar(20),
	"photo" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "video_call" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "video_call_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"patient_id" integer,
	"doctor_id" integer,
	"start_time" timestamp NOT NULL,
	"end_time" timestamp NOT NULL
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
 ALTER TABLE "patient_responses" ADD CONSTRAINT "patient_responses_patient_id_patient_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patient"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "patient_responses" ADD CONSTRAINT "patient_responses_appointment_id_appointment_id_fk" FOREIGN KEY ("appointment_id") REFERENCES "public"."appointment"("id") ON DELETE no action ON UPDATE no action;
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
 ALTER TABLE "questions" ADD CONSTRAINT "questions_doctor_id_doctor_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctor"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "questions" ADD CONSTRAINT "questions_patient_id_patient_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patient"("id") ON DELETE no action ON UPDATE no action;
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
