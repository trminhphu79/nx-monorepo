export class PagingMessageDto {
  offset: number;
  limit: number;
  keyword?: string;
  conversationId: number;
}
