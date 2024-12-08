import {
    integer,
    pgTable,
    varchar,
    pgEnum,
    text,
    timestamp,
  } from "drizzle-orm/pg-core";
  
  // Enums
  export const userRoleEnum = pgEnum("UserRole", ["DOCTOR", "PATIENT"]);
  export const specializationEnum = pgEnum("Specialization", [
    "INTERNAL_MEDICINE",
    "FAMILY_MEDICINE",
    "DERMATOLOGY",
    "GASTROENTEROLOGY",
    "CARDIOLOGY",
    "PEDIATRICS",
    "ORTHOPEDICS",
  ]);
  export const availabilityEnum = pgEnum("Availability", [
    "ONLINE",
    "OFFLINE",
    "BUSY",
  ]);
  export const genderEnum = pgEnum("Gender", ["MALE", "FEMALE"]);

  export const areaEnum = pgEnum("Area", [
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
  
  export const appointmentStatusEnum = pgEnum("AppointmentStatus", [
    "SCHEDULED",
    "COMPLETED",
    "CANCELED",
  ]);
  export const recordTypeEnum = pgEnum("RecordType", [
    "DIAGNOSIS",
    "TREATMENT",
    "PRESCRIPTION",
    "TEST_RESULTS",
  ]);
  
  // Tables
  export const usersTable = pgTable("User", {
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
  
  export const doctorsTable = pgTable("Doctor", {
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
  
  export const patientsTable = pgTable("Patient", {
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
  
  export const appointmentsTable = pgTable("Appointment", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    patientId: integer("patient_id").references(() => patientsTable.id),
    doctorId: integer("doctor_id").references(() => doctorsTable.id),
    date: timestamp("date").notNull(),
    time: varchar("time", { length: 256 }).notNull(),
    status: appointmentStatusEnum(),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
  });
  
  export const healthRecordsTable = pgTable("HealthRecords", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: integer("user_id").references(() => patientsTable.id),
    type: recordTypeEnum(),
    description: text("description"),
    file: text("file"),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
  });
  
  export const questionsTable = pgTable("Questions", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    doctorId: integer("doctor_id").references(() => doctorsTable.id),
    patientId: integer("patient_id").references(() => patientsTable.id),
    text: text("text").notNull(),
    isActive: timestamp("is_active"),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
  });
  
  export const patientResponsesTable = pgTable("PatientResponses", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    patientId: integer("patient_id").references(() => patientsTable.id),
    appointmentId: integer("appointment_id").references(() => appointmentsTable.id),
    text: text("text").notNull(),
    createdAt: timestamp("created_at").notNull(),
  });
  
  export const videoCallsTable = pgTable("VideoCall", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    patientId: integer("patient_id").references(() => patientsTable.id),
    doctorId: integer("doctor_id").references(() => doctorsTable.id),
    startTime: timestamp("start_time").notNull(),
    endTime: timestamp("end_time").notNull(),
  });
  