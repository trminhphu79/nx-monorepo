import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern } from '@nestjs/microservices';
import { MESSAGE_PATTERN_AUTH } from '@server/shared/message-pattern/auth';
import { CreateAccountDto } from '@server/shared/dtos/account';

@Controller()
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @MessagePattern({ cmd: MESSAGE_PATTERN_AUTH.CREATE })
  createAccount(body: CreateAccountDto) {
    return this.service.createOne(body);
  }

  @MessagePattern({ cmd: MESSAGE_PATTERN_AUTH.SIGN_IN })
  signIn(body: CreateAccountDto) {
    return this.service.signIn(body);
  }
}
