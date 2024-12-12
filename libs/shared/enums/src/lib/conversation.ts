export enum ChatMessageStatus {
  Idle = 'IDLE',
  Sending = 'SENDING',
  SendingSuccess = 'SENDING_SUCCESS',
  SendingFail = 'SENDING_FAIL',
  NewMessage = 'NEW_MESSAGE_INCOMMING',
}

export enum ConversationStatus {
  Idle = 'IDLE',
  NewConversationComming = 'NEW_CONVERSATION_COMMING',
}

export enum MessageEnum {
  Personal = 'Personal',
  System = 'System',
  SystemInvitation = 'SystemInvitation',
}
