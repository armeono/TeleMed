import { db } from "@/db/drizzle";
import { messages as messagesTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { MessagesDB } from "./types";
import dayjs from "dayjs";

export const db_getMessagesBySenderAndRecipientId = async (
  senderId: number,
  recipientId: number
) => {
  try {
    const messages: MessagesDB[] = await db.query.messages.findMany({
      where: and(
        eq(messagesTable.senderId, senderId),
        eq(messagesTable.receiverId, recipientId)
      ),
    });

    if (!messages) return [];

    return messages.map((message) => {
      return {
        ...message,
        createdAt: message.createdAt,
      };
    });
  } catch (error) {
    console.log(error);

    return [];
  }
};
