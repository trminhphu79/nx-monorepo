export type Message = {
  id: number;
  content: string;
  senderId: number;
  receiverId: number;
  type?: string;
  conversationId: number;
  isSender?: boolean;
  timeSend: string;
  unread?: boolean;
  isOld?: boolean;
};
