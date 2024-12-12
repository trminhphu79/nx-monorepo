import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { Profile } from '@server/shared/entity/profile';
import { Conversation } from '@server/shared/entity/conversation';
import { Account } from '@server/shared/entity/account';
import { Friend } from '@server/shared/entity/friend';
import { UserConversation } from '@server/shared/entity/user-conversation';
import { Message } from '@server/shared/entity/message';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Message,
      Friend,
      Profile,
      Conversation,
      Account,
      UserConversation,
    ]),
  ],
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessageModule {}
