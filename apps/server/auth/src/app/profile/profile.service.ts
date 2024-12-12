import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  UpdateProfileDto,
  SearchFriendDto,
  AddFriendDto,
} from '@server/shared/dtos/profile';
import { Profile } from '@server/shared/entity/profile';
import { Conversation } from '@server/shared/entity/conversation';
import { from, map } from 'rxjs';
import { Op } from 'sequelize';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Profile)
    private model: typeof Profile,
    @InjectModel(Conversation)
    private conversationModel: typeof Conversation
  ) {}

  updateOne(payload: UpdateProfileDto) {
    const payloadUpdate = { ...payload };
    delete payloadUpdate.id;
    return from(
      this.model.update(payloadUpdate, { where: { id: payload.id } })
    );
  }

  async addFriend(payload: AddFriendDto) {
    const { profileId, friendId } = payload;

    const profile = await this.model.findByPk(profileId, {
      include: { model: this.model, as: 'friends' },
    });
    if (!profile) {
      throw new NotFoundException(`Profile with id ${profileId} not found`);
    }
    const friend = await this.model.findByPk(friendId);
    if (!friend) {
      throw new NotFoundException(`Profile with id ${friendId} not found`);
    }

    const isAlreadyFriend = profile.friends.some(
      (existingFriend) => existingFriend.id === friendId
    );
    if (isAlreadyFriend) {
      throw new BadRequestException(
        `Profile with id ${friendId} is already a friend`
      );
    }

    Logger.log("Add friend " + friend.fullName + " successfully!");

    await profile.$add('friends', friend);

    const createdConversation = await this.conversationModel.create({
      name: `Conversation between ${profileId} and ${friendId}`,
    });

    await createdConversation.$set('members', [profileId, friendId]);
    Logger.log("Create conversation between " + profile.fullName + " and "  + friend.fullName + " successfully!");

    return {
      data: friend,
      message: 'Add friend successfully!',
    };
  }

  searchFriend(payload: SearchFriendDto) {
    const {
      keyword,
      offset = 0,
      limit = 10,
      sortField = 'fullName',
      sortOrder = 'ASC',
    } = payload;
    return from(
      this.model.findAndCountAll({
        where: {
          [Op.or]: [
            {
              fullName: {
                [Op.iLike]: `%${keyword}%`, // Case-insensitive partial match
              },
            },
            {
              bio: {
                [Op.iLike]: `%${keyword}%`,
              },
            },
          ],
        },
        offset,
        limit,
        order: [[sortField, sortOrder]], // Dynamic sorting
      })
    ).pipe(
      map((result) => ({
        data: result.rows, // List of friends
        totalCount: result.count, // Total number of matching records
        pagination: {
          offset,
          limit,
          currentPage: Math.ceil(offset / limit) + 1,
          totalPages: Math.ceil(result.count / limit),
        },
        message: 'Search completed successfully!',
      }))
    );
  }

  getUserFriends(profileId: number) {
    return from(
      this.model.findOne({
        where: { accountId: profileId },
        include: [
          {
            model: Profile,
            as: 'friends', // Alias defined in the relationship
            through: { attributes: [] }, // Exclude the join table from the result
          },
        ],
      })
    );
  }
}
