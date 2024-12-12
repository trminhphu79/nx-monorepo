import {
Column,
Model,
Table,
PrimaryKey,
AutoIncrement,
DataType,
HasMany,
BelongsToMany,
} from 'sequelize-typescript';
import { Message } from './message.entity';
import { Profile } from './profile.entity';
import { UserConversation } from './user-conversation.entity';

@Table({ tableName: 'conversation' })
export class Conversation extends Model {
@AutoIncrement
@PrimaryKey
@Column
override id: number;

@Column
name: string;

@Column({ defaultValue: false })
isGroup: boolean;

@BelongsToMany(() => Profile, () => UserConversation)
members: Profile[];

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
}
