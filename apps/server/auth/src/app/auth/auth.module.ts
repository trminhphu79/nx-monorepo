import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Account } from '@server/shared/entity/account';
import { Conversation } from '@server/shared/entity/conversation';
import { Message } from '@server/shared/entity/message';
import { Profile } from '@server/shared/entity/profile';
import { Friend } from '@server/shared/entity/friend';
import { UserConversation } from '@server/shared/entity/user-conversation';

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: +process.env.POSTGRES_PORT,
      username: process.env.POSTGRES_USERNAME,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [Message, Profile, Friend,Conversation, Account, UserConversation],
      autoLoadModels: true,
      synchronize: true,
    }),
    SequelizeModule.forFeature([
      Message,
      Profile,
      Friend,
      Conversation,
      Account,
      UserConversation,
    ]),
  ],
})
export class AuthModule {}
