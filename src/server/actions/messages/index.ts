"use server";

import { db } from "@/db/drizzle";
import { messages } from "@/db/schema";
import { supabase } from "@/db/supabase";

type CreateNewMessage = {
  senderId: number;
  recipientId: number;
  message: string;
};

export const action_createNewMessage = async ({
  senderId,
  recipientId,
  message,
}: CreateNewMessage) => {
  try {
    await db.insert(messages).values({
      senderId,
      receiverId: recipientId,
      message,
    });

    return {
      status: "success",
      message: "Message sent successfully.",
    };
  } catch (error) {
    console.log(error);

    return {
      status: "error",
      message: "Failed to send message.",
    };
  }
};

export const subscribeToMessages = async (
  callback: React.Dispatch<React.SetStateAction<any>>
) => {
  const subscription = supabase
    .channel("messages")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "messages" },
      (event) => {
        console.log(event);
      }
    )
    .subscribe();

  return subscription;
};
