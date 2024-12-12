import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.controller';
import { NatsClientModule } from '@server/shared/nats-client';

@Module({
  imports: [NatsClientModule],
  providers: [ChatGateway],
})
export class ChatModule {}
