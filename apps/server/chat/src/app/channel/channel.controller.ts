import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { MESSAGE_PATTERN_CHANNEL } from '@server/shared/message-pattern';
import { ChannelService } from './channel.service';

@Controller()
export class ChannelController {
  constructor(private service: ChannelService) {}
  @MessagePattern(MESSAGE_PATTERN_CHANNEL.JOIN)
  create() {
    return this.service.create();
  }

  @MessagePattern(MESSAGE_PATTERN_CHANNEL.JOIN)
  join() {
    return this.service.join();
  }

  @MessagePattern(MESSAGE_PATTERN_CHANNEL.JOIN)
  leave() {
    return this.service.leave();
  }
}
