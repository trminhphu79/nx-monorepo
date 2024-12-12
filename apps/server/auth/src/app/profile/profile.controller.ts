import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import {
  UpdateProfileDto,
  SearchFriendDto,
  AddFriendDto,
} from '@server/shared/dtos/profile';
import { MESSAGE_PATTERN_PROFILE } from '@server/shared/message-pattern/auth';
import { ProfileService } from './profile.service';
import { from, map } from 'rxjs';

@Controller()
export class ProfileController {
  constructor(private service: ProfileService) {}

  @MessagePattern({ cmd: MESSAGE_PATTERN_PROFILE.UPDATE })
  updateProfile(body: UpdateProfileDto) {
    return this.service.updateOne(body).pipe(
      map((response) => {
        if (response[0] > 0) {
          return {
            message: 'Update successfully!!',
            data: response,
          };
        }
        return {
          message: 'Update failed!!',
          data: null,
        };
      })
    );
  }

  @MessagePattern({ cmd: MESSAGE_PATTERN_PROFILE.ADD_FRIEND })
  addFriend(body: AddFriendDto) {
    return from(this.service.addFriend(body)).pipe(
      map((response) => {
        return {
          message: 'Addfriend successfully!!',
          data: body,
        };
      })
    );
  }

  @MessagePattern({ cmd: MESSAGE_PATTERN_PROFILE.SEARCH_FRIEND })
  searchFriend(body: SearchFriendDto) {
    return this.service.searchFriend(body);
  }

  @MessagePattern({ cmd: MESSAGE_PATTERN_PROFILE.GET_USER_FRIENDS })
  getUserFriends(profileId: number) {
    console.log('ID: ', profileId);
    return this.service.getUserFriends(profileId).pipe();
  }
}
