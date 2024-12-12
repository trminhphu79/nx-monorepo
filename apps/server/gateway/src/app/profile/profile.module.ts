import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { NatsClientModule } from '@server/shared/nats-client';

@Module({
  providers: [],
  controllers: [ProfileController],
  imports: [NatsClientModule],
})
export class ProfileModule {}
