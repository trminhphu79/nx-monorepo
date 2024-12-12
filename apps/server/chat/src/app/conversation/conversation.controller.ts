import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { MESSAGE_PATTERN_CONVERSATION } from '@server/shared/message-pattern';
import { ConversationService } from './conversation.service';
import {
  CreateConversationDto,
  PagingConversationDto,
} from '@server/shared/dtos/conversation';
import { from } from 'rxjs';

@Controller()
export class ConversationController {
  constructor(private service: ConversationService) {}

  @MessagePattern(MESSAGE_PATTERN_CONVERSATION.CREATE)
  create(payload: CreateConversationDto) {
    return this.service.createConversation(payload);
  }

  @MessagePattern(MESSAGE_PATTERN_CONVERSATION.DELETE)
  delete(id: number) {
    return from(this.service.delete(id));
  }

  @MessagePattern(MESSAGE_PATTERN_CONVERSATION.PAGING)
  findMembersOfConversations(payload: PagingConversationDto) {
    return this.service.findMembersOfConversations(payload);
  }
}
