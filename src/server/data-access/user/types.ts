import { usersTable } from "@/db/schema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

export const selectUserSchema = createSelectSchema(usersTable);

export type UserDB = z.infer<typeof selectUserSchema>;
