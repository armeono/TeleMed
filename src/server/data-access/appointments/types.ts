import { createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import { appointmentsTable } from "@/db/schema";
import { DoctorDB } from "../doctor/types";
import { UserDB } from "../user/types";
import { PatientDB } from "../patient/types";

export const selectAppointmentSchema = createSelectSchema(appointmentsTable);

export type PatientAppointmentDB = z.infer<typeof selectAppointmentSchema> & {
  doctor: DoctorDB & {
    user: UserDB;
  };
};

export type DoctorAppointmentDB = z.infer<typeof selectAppointmentSchema> & {
  patient: PatientDB & {
    user: UserDB;
  };
  doctor: DoctorDB & {
    user: UserDB;
  };
};
