"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/db/supabase";
import {
  action_createNewMessage,
  subscribeToMessages,
} from "@/server/actions/messages";
import { MessagesDB } from "@/server/data-access/messages/types";
import dayjs from "dayjs";
import { Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

type Props = {
  senderId: number;
  recipientId: number;
  messages: MessagesDB[];
};

const ChatClient = ({ messages, senderId, recipientId }: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<any>();

  const [messagesList, setMessagesList] = useState<any>(messages);

  const onSubmit = async (data: any) => {
    await action_createNewMessage({
      senderId,
      recipientId,
      message: data.message,
    });
    reset();
  };

  useEffect(() => {
    const subscription = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          setMessagesList((prevMessages: any) => [
            ...prevMessages,
            {
              id: payload.new.id,
              message: payload.new.message,
              senderId: payload.new.sender_id,
              recipientId: payload.new.receiver_id,
              createdAt: payload.new.created_at,
            },
          ]);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div>
      <CardContent>
        <div className="h-[300px] mb-4 flex flex-col-reverse overflow-auto">
          {messagesList.length > 0 ? (
            messagesList
              .sort(
                (a: any, b: any) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
              )
              .map((message: any) => (
                <div
                  key={message.id}
                  className={`flex flex-col ${
                    message.senderId === senderId ? "items-end" : "items-start"
                  } mb-2`}
                >
                  <div
                    className={`px-3 py-2 rounded-lg ${
                      message.senderId === senderId
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary"
                    }`}
                  >
                    <p className="text-sm">{message.message}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {String(dayjs(message.createdAt).format("h:mm A"))}
                  </p>
                </div>
              ))
          ) : (
            <div>No current messages with recipient ID: {recipientId}</div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <form onSubmit={handleSubmit(onSubmit)} className="flex w-full gap-4">
            <Input
              {...register("message", { required: "Message is required" })}
              type="text"
              placeholder="Type your message..."
              className="h-16"
            />
            <Button type="submit" size="icon" className="size-16">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </CardContent>
    </div>
  );
};

export default ChatClient;
