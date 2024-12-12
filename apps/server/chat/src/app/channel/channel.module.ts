import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
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
  providers: [ChannelService],
  controllers: [ChannelController]
})
export class ChannelModule {}
