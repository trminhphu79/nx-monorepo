import { ChatMessageStatus } from '@shared/enums';
import { Message } from '@shared/models/message';
import { Member } from '@shared/models/conversation';

export type ChatState = {
  messages: Message[];
  members: Array<Member>;
  conversationId: number;
  status: ChatMessageStatus;
  conversation: {
    id: number;
    receiver: Member | null;
  };
};
