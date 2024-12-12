import {
  Column,
  Model,
  Table,
  PrimaryKey,
  AutoIncrement,
  DataType,
  BelongsToMany,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { Conversation } from './conversation.entity';
import { Account } from './account.entity';
import { UserConversation } from './user-conversation.entity';
import { Friend } from './friend.entity';

@Table({ tableName: 'profile' })
export class Profile extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  override id: number;

  @ForeignKey(() => Account)
  @Column
  accountId: number;

  @BelongsTo(() => Account)
  account: Account;

  @BelongsToMany(() => Conversation, () => UserConversation)
  conversations: Conversation[];

  @Column
  fullName: string;

  @Column
  avatarUrl: string;

  @Column
  bio: string;

  @Column({
    type: DataType.DATE,
    defaultValue: null,
  })
  dob: Date;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  override createdAt: Date;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  override updatedAt: Date;

  @BelongsToMany(() => Profile, () => Friend, 'profileId', 'friendId')
  friends: Profile[];
}
