import { Injectable } from '@nestjs/common';

@Injectable()
export class ChannelService {
  create() {
    console.log('create');
  }

  join() {
    console.log('join');
  }

  leave() {
    console.log('leave');
  }
}
