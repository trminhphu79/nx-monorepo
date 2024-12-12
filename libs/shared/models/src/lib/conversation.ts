import { Message } from './message';

export type Member = {
  avatarUrl: string;
  id: number;
  bio: string;
  fullName: string;
  [key: string]: any;
};

export type Conversation = {
  id: number;
  messages: Message[];
  name: string;
  lastMessage: { onHighlight: boolean } & Message;
  receiver: Member | null;
  members?: Member[];
};

export type MessageCategory = any;
