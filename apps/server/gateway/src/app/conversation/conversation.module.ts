import { Module } from '@nestjs/common';
import { NatsClientModule } from '@server/shared/nats-client';
import { ConversationController } from './conversation.controller';

@Module({
  imports: [NatsClientModule],
  controllers: [ConversationController],
})
export class ConversationModule {}
