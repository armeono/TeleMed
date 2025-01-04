import { createSelectSchema } from "drizzle-zod";
import { messages } from "@/db/schema";
import type { z } from "zod";

export const selectMessagesSchema = createSelectSchema(messages);

export type MessagesDB = z.infer<typeof selectMessagesSchema>;
