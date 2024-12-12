import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [
    ProfileModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
