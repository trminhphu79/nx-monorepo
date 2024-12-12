import { ConversationStatus } from '@shared/enums';
import { Conversation } from '@shared/models/conversation';

export type ConversationState = {
  conversations: Conversation[];
  selectedConversation: Conversation|null;
  status: ConversationStatus;
};

export type MessageCategory = any;
