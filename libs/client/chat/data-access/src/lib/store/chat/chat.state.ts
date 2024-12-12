import { ChatState } from './chat.model';
import { ChatMessageStatus } from '@shared/enums';

export const INITIAL_CHAT_STATE: ChatState = {
  messages: [],
  members: [],
  conversationId: -1,
  conversation: {
    id: -1,
    receiver: null,
  },
  status: ChatMessageStatus.Idle,
};
