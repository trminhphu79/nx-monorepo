import { Module } from '@nestjs/common';
import { Message } from '@server/shared/entity/message';
import { SequelizeModule } from '@nestjs/sequelize';
import { ChannelModule } from './channel/channel.module';
import { MessageModule } from './message/message.module';
import { Profile } from '@server/shared/entity/profile';
import { Conversation } from '@server/shared/entity/conversation';
import { Account } from '@server/shared/entity/account';
import { Friend } from '@server/shared/entity/friend';
import { UserConversation } from '@server/shared/entity/user-conversation';
import { ConversationModule } from './conversation/conversation.module';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: +process.env.POSTGRES_PORT,
      username: process.env.POSTGRES_USERNAME,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [Message, Profile, Conversation, Account, UserConversation, Friend],
      autoLoadModels: true,
      synchronize: true,
    }),
    ChannelModule,
    MessageModule,
    ConversationModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
