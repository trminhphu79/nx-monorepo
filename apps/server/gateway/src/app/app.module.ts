import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { ProfileModule } from './profile/profile.module';
import { ConversationModule } from './conversation/conversation.module';

@Module({
  imports: [AuthModule, ChatModule, ProfileModule, ConversationModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
