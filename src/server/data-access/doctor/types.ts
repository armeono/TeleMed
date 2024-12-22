import { createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import { doctorsTable } from "@/db/schema";

export const selectDoctorSchema = createSelectSchema(doctorsTable);
export type DoctorDB = z.infer<typeof selectDoctorSchema>;
