import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Conversation } from './conversation.entity';
import { Profile } from './profile.entity';

@Table({ tableName: 'conversation_members' })
export class UserConversation extends Model {
  @ForeignKey(() => Conversation)
  @Column({ field: 'conversationId' })
  conversationId: number;

  @ForeignKey(() => Profile)
  @Column({ field: 'userId' })
  userId: number;

  @Column({ defaultValue: DataType.NOW })
  joinedAt: Date;
}
