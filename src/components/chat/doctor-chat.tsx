import { db_getMessagesBySenderAndRecipientId } from "@/server/data-access/messages/get-messagesBySenderAndRecipientId";
import ChatClient from "./page-client";

type Props = {
  senderId: number;
  recipientId: number;
};

const DoctorChat = async ({ senderId, recipientId }: Props) => {
  const messages = await db_getMessagesBySenderAndRecipientId(
    recipientId,
    senderId
  );

  return (
    <ChatClient
      senderId={senderId}
      recipientId={recipientId}
      messages={messages}
    />
  );
};

export default DoctorChat;
