import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  CreateConversationDto,
  PagingConversationDto,
} from '@server/shared/dtos/conversation';
import { MESSAGE_PATTERN_CONVERSATION } from '@server/shared/message-pattern';

@Controller('conversation')
export class ConversationController {
  constructor(
    @Inject('NATS_SERVICE')
    private clientProxy: ClientProxy
  ) {}

  @Post('create')
  create(@Body() payload: CreateConversationDto) {
    return this.clientProxy.send(MESSAGE_PATTERN_CONVERSATION.CREATE, payload);
  }

  @Post('search')
  paging(@Body() payload: PagingConversationDto) {
    return this.clientProxy.send(MESSAGE_PATTERN_CONVERSATION.PAGING, payload);
  }
}
