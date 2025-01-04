import { db_getMessagesBySenderAndRecipientId } from "@/server/data-access/messages/get-messagesBySenderAndRecipientId";
import ChatClient from "./page-client";

type Props = {
  senderId: number;
  recipientId: number;
};

const PatientChat = async ({ senderId, recipientId }: Props) => {
  console.log("the ids here", senderId, recipientId);

  const messages = await db_getMessagesBySenderAndRecipientId(
    senderId,
    recipientId
  );

  console.log(messages);

  return (
    <ChatClient
      senderId={senderId}
      recipientId={recipientId}
      messages={messages}
    />
  );
};

export default PatientChat;
