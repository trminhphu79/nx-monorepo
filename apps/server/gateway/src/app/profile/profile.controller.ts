import {
  Controller,
  Inject,
  Get,
  Logger,
  Post,
  Body,
  Param,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, tap } from 'rxjs';
import { MESSAGE_PATTERN_PROFILE } from '@server/shared/message-pattern';
import {
  AddFriendDto,
  UpdateProfileDto,
  SearchFriendDto,
} from '@server/shared/dtos/profile';

@Controller('profile')
export class ProfileController {
  constructor(
    @Inject('NATS_SERVICE')
    private natsClient: ClientProxy
  ) {}

  @Post()
  updateProfile(@Body() payload: UpdateProfileDto) {
    return this.natsClient
      .send({ cmd: MESSAGE_PATTERN_PROFILE.UPDATE }, payload)
      .pipe(
        catchError((error) => {
          Logger.error('Get Action: UPDATE_PROFILE error!!');
          return error;
        }),
        tap((data) => {
          Logger.log('Get Action: UPDATE_PROFILE successfully!!', data);
        })
      );
  }

  @Post('/add-friend')
  addFriend(@Body() payload: AddFriendDto) {
    return this.natsClient
      .send({ cmd: MESSAGE_PATTERN_PROFILE.ADD_FRIEND }, payload)
      .pipe(
        catchError((error) => {
          Logger.error('Get Action: ADD_FRIEND error!!');
          return error;
        }),
        tap((data) => {
          Logger.log('Get Action: ADD_FRIEND successfully!!', data);
        })
      );
  }

  @Post('/search-friend')
  searchFriend(@Body() payload: SearchFriendDto) {
    return this.natsClient
      .send({ cmd: MESSAGE_PATTERN_PROFILE.SEARCH_FRIEND }, payload)
      .pipe(
        catchError((error) => {
          Logger.error('Get Action: SEARCH_FRIEND error!!');
          return error;
        }),
        tap((data) => {
          Logger.log('Get Action: SEARCH_FRIEND successfully!!', data);
        })
      );
  }

  @Get('/user-friend/:id')
  getUserFriends(@Param() params: any) {
    return this.natsClient
      .send({ cmd: MESSAGE_PATTERN_PROFILE.GET_USER_FRIENDS }, params.id)
      .pipe(
        catchError((error) => {
          Logger.error('Get Action: GET_USER_FRIENDS error!!');
          return error;
        }),
        tap((data) => {
          Logger.log('Get Action: GET_USER_FRIENDS successfully!!', data);
        })
      );
  }
}
