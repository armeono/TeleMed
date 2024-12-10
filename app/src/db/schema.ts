import {
    integer,
    pgTable,
    varchar,
    pgEnum,
    text,
    timestamp,
    jsonb,
  } from "drizzle-orm/pg-core";
  
  // Enums
  export const userRoleEnum = pgEnum("user_role", ["DOCTOR", "PATIENT"]);
  export const specializationEnum = pgEnum("specialization", [
    "INTERNAL_MEDICINE",
    "FAMILY_MEDICINE",
    "DERMATOLOGY",
    "GASTROENTEROLOGY",
    "CARDIOLOGY",
    "PEDIATRICS",
    "ORTHOPEDICS",
  ]);
  export const appointmentTypeEnum = pgEnum("appointment_type", [
    "ONLINE",
    "IN_PERSONs",
  ])
  export const availabilityEnum = pgEnum("availability", [
    "ONLINE",
    "OFFLINE",
    "BUSY",
  ]);
  export const genderEnum = pgEnum("gender", ["MALE", "FEMALE"]);

  export const areaEnum = pgEnum("area", [
    "UNSKO_SANSKI",
    "POSAVSKI",
    "TUZLANSKI",
    "ZENICKO_DOBOJSKI",
    "BOSANSKO_PODRINJSKI",
    "SREDNJOBOSANSKI",
    "HERCEGOVACKO_NERETVANSKI",
    "ZAPADNOHERCEGOVACKI",
    "SARAJEVO",
    "CANTON_10",
  ]);
  
  export const appointmentStatusEnum = pgEnum("appointmentStatus", [
    "SCHEDULED",
    "COMPLETED",
    "CANCELED",
  ]);
  export const recordTypeEnum = pgEnum("record_type", [
    "DIAGNOSIS",
    "TREATMENT",
    "PRESCRIPTION",
    "TEST_RESULTS",
  ]);
  
  // Tables
  export const usersTable = pgTable("user", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    role: userRoleEnum(),
    firstName: varchar("first_name", { length: 256 }).notNull(),
    lastName: varchar("last_name", { length: 256 }).notNull(),
    email: varchar("email", { length: 256 }).notNull().unique(),
    password: text("password").notNull(),
    area: areaEnum(),
    phone: varchar("phone", { length: 20 }),
    photo: text("photo"),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
  });
  
  export const doctorsTable = pgTable("doctor", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: integer("user_id").references(() => usersTable.id),
    medicalLicense: varchar("medical_license", { length: 256 }).notNull().unique(),
    specialization: specializationEnum(),
    yearsOfExperience: integer("years_of_experience").notNull(),
    bio: text("bio"),
    area: areaEnum(),
    availability: availabilityEnum(),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
  });
  
  export const patientsTable = pgTable("patient", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: integer("user_id").references(() => usersTable.id),
    dateOfBirth: timestamp("date_of_birth"),
    medicalId: varchar("medical_id", { length: 256 }).notNull().unique(),
    jmbg: varchar("jmbg", { length: 256 }).notNull().unique(),
    gender: genderEnum(),
    address: text("address"),
    area: areaEnum(),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
  });
  
  export const appointmentsTable = pgTable("appointment", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    patientId: integer("patient_id").references(() => patientsTable.id),
    doctorId: integer("doctor_id").references(() => doctorsTable.id),
    date: timestamp("date").notNull(),
    type: appointmentTypeEnum(),
    time: varchar("time", { length: 256 }).notNull(),
    status: appointmentStatusEnum(),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
  });
  
  export const healthRecordsTable = pgTable("health_records", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: integer("user_id").references(() => patientsTable.id),
    type: recordTypeEnum(),
    file: text("file"),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
  });
  
  export const medicalInquiry = pgTable("medical_inquiry", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    doctorId: integer("doctor_id").references(() => doctorsTable.id),
    patientId: integer("patient_id").references(() => patientsTable.id),
    predefinedQuestions: jsonb("predefined_questions").notNull(),
    patientQuestion: text("patient_question").notNull(),
    imgUrl: text("img_url"),  
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
  });
  
  export const videoCallsTable = pgTable("video_call", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    patientId: integer("patient_id").references(() => patientsTable.id),
    doctorId: integer("doctor_id").references(() => doctorsTable.id),
    startTime: timestamp("start_time").notNull(),
    endTime: timestamp("end_time").notNull(),
  });
  