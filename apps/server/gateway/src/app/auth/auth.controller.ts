import { Controller, Inject, Get, Logger, Post, Body } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, tap } from 'rxjs';
import { MESSAGE_PATTERN_AUTH } from '@server/shared/message-pattern';
import { CreateAccountDto } from '@server/shared/dtos/account';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('NATS_SERVICE')
    private natsClient: ClientProxy
  ) {}

  @Post('registation')
  createUser(@Body() payload: CreateAccountDto) {
    return this.natsClient
      .send({ cmd: MESSAGE_PATTERN_AUTH.CREATE }, payload)
      .pipe(
        catchError((error) => {
          Logger.error('Get Action: CREATE_ACCOUNT error!!');
          return error;
        }),
        tap((data) => {
          Logger.log('Get Action: CREATE_ACCOUNT successfully!!', data);
        })
      );
  }

  @Post('authenticate')
  signIn(@Body() payload: CreateAccountDto) {
    return this.natsClient
      .send({ cmd: MESSAGE_PATTERN_AUTH.SIGN_IN }, payload)
      .pipe(
        catchError((error) => {
          Logger.error('Get Action: CREATE_ACCOUNT error!!');
          return error;
        }),
        tap((data) => {
          Logger.log('Get Action: CREATE_ACCOUNT successfully!!', data);
        })
      );
  }
}
