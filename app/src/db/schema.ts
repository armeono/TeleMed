import { relations } from "drizzle-orm";
import {
  integer,
  pgTable,
  varchar,
  pgEnum,
  text,
  timestamp,
  jsonb,
  serial,
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
]);
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
  id: serial("id").primaryKey(),
  role: userRoleEnum(),
  firstName: varchar("first_name", { length: 256 }).notNull(),
  lastName: varchar("last_name", { length: 256 }).notNull(),
  email: varchar("email", { length: 256 }).notNull().unique(),
  password: text("password").notNull(),
  area: areaEnum(),
  phone: varchar("phone", { length: 20 }),
  photo: text("photo"),
  createdAt: timestamp("created_at", { precision: 3, mode: "string" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { mode: "string", precision: 3 })
    .defaultNow()
    .$onUpdate(() => new Date().toISOString()),
});

export const doctorsTable = pgTable("doctor", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => usersTable.id)
    .notNull(),
  medicalLicense: varchar("medical_license", { length: 256 })
    .notNull()
    .unique(),
  specialization: specializationEnum(),
  yearsOfExperience: integer("years_of_experience"),
  bio: text("bio"),
  area: areaEnum(),
  availability: availabilityEnum(),
  createdAt: timestamp("created_at", { precision: 3, mode: "string" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { mode: "string", precision: 3 })
    .defaultNow()
    .$onUpdate(() => new Date().toISOString()),
});

export const doctorsRelations = relations(doctorsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [doctorsTable.userId],
    references: [usersTable.id],
  }),
}));

export const patientsTable = pgTable("patient", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => usersTable.id)
    .notNull(),
  medicalId: varchar("medical_id", { length: 256 }).notNull().unique(),
  jmbg: varchar("jmbg", { length: 256 }),
  gender: genderEnum(),
  address: text("address"),
  area: areaEnum(),
  createdAt: timestamp("created_at", { precision: 3, mode: "string" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { mode: "string", precision: 3 })
    .defaultNow()
    .$onUpdate(() => new Date().toISOString()),
});

export const patientsRelations = relations(patientsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [patientsTable.userId],
    references: [usersTable.id],
  }),
}));

export const appointmentsTable = pgTable("appointment", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").references(() => patientsTable.id),
  doctorId: integer("doctor_id").references(() => doctorsTable.id),
  date: timestamp("date").notNull(),
  type: appointmentTypeEnum(),
  time: varchar("time", { length: 256 }).notNull(),
  status: appointmentStatusEnum(),
  createdAt: timestamp("created_at", { precision: 3, mode: "string" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { mode: "string", precision: 3 })
    .defaultNow()
    .$onUpdate(() => new Date().toISOString()),
});

export const appointmentsRelations = relations(
  appointmentsTable,
  ({ one }) => ({
    doctor: one(doctorsTable, {
      fields: [appointmentsTable.doctorId],
      references: [doctorsTable.id],
    }),
    patient: one(patientsTable, {
      fields: [appointmentsTable.patientId],
      references: [patientsTable.id],
    }),
  })
);

export const healthRecordsTable = pgTable("health_records", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => patientsTable.id),
  type: recordTypeEnum(),
  file: text("file"),
  createdAt: timestamp("created_at", { precision: 3, mode: "string" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { mode: "string", precision: 3 })
    .defaultNow()
    .$onUpdate(() => new Date().toISOString()),
});

export const healthRecordsRelations = relations(
  healthRecordsTable,
  ({ one }) => ({
    patient: one(patientsTable, {
      fields: [healthRecordsTable.userId],
      references: [patientsTable.id],
    }),
  })
);

export const medicalInquiry = pgTable("medical_inquiry", {
  id: serial("id").primaryKey(),
  doctorId: integer("doctor_id").references(() => doctorsTable.id),
  patientId: integer("patient_id").references(() => patientsTable.id),
  predefinedQuestions: jsonb("predefined_questions").notNull(),
  patientQuestion: text("patient_question").notNull(),
  imgUrl: text("img_url"),
  createdAt: timestamp("created_at", { precision: 3, mode: "string" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { mode: "string", precision: 3 })
    .defaultNow()
    .$onUpdate(() => new Date().toISOString()),
});

export const medicalInquiryRelations = relations(medicalInquiry, ({ one }) => ({
  doctor: one(doctorsTable, {
    fields: [medicalInquiry.doctorId],
    references: [doctorsTable.id],
  }),
  patient: one(patientsTable, {
    fields: [medicalInquiry.patientId],
    references: [patientsTable.id],
  }),
}));

export const videoCallsTable = pgTable("video_call", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").references(() => patientsTable.id),
  doctorId: integer("doctor_id").references(() => doctorsTable.id),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  createdAt: timestamp("created_at", { precision: 3, mode: "string" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { mode: "string", precision: 3 })
    .defaultNow()
    .$onUpdate(() => new Date().toISOString()),
});

export const videoCallsRelations = relations(videoCallsTable, ({ one }) => ({
  doctor: one(doctorsTable, {
    fields: [videoCallsTable.doctorId],
    references: [doctorsTable.id],
  }),
  patient: one(patientsTable, {
    fields: [videoCallsTable.patientId],
    references: [patientsTable.id],
  }),
}));
