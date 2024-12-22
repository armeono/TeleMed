import { createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import { appointmentsTable } from "@/db/schema";

export const selectAppointmentSchema = createSelectSchema(appointmentsTable);

export type AppointmentDB = z.infer<typeof selectAppointmentSchema>;
