import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { MESSAGE_PATTERN_CHAT } from '@server/shared/message-pattern';
import { CreateMessageDto } from '@server/shared/dtos/message';
import { MessageService } from './message.service';
import { of } from 'rxjs';

@Controller()
export class MessageController {
  constructor(private service: MessageService) {}

  @MessagePattern(MESSAGE_PATTERN_CHAT.SEND_MESSAGE)
  send(payload: CreateMessageDto) {
    Logger.log(`Message received from ${payload.senderId}: ${payload.content}`);
    return this.service.send(payload);
  }

  @MessagePattern(MESSAGE_PATTERN_CHAT.PAGING)
  paging(payload: any) {
    return [];
  }

  @MessagePattern(MESSAGE_PATTERN_CHAT.DELETE)
  delete(payload: any) {
    return [];
  }
}
