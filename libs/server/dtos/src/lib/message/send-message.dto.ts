export class CreateMessageDto {
  roomId: number;
  content: string;
  senderId: number;
}
export class CreateMessageDtoWithReceiver {
  senderId: number;
  content: string;
  roomId: string;
  receiverIds: number[];
}
