import { ConversationStatus } from '@shared/enums';
import { ConversationState } from './conversation.model';

export const INITIAL_CONVERSATION_STATE: ConversationState = {
  conversations: [],
  selectedConversation: null,
  status: ConversationStatus.Idle,
};
