import { createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import { patientsTable } from "@/db/schema";

export const selectPatientSchema = createSelectSchema(patientsTable);
export type PatientDB = z.infer<typeof selectPatientSchema>;
