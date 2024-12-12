import {
  Column,
  Model,
  Table,
  PrimaryKey,
  AutoIncrement,
  DataType,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { Profile } from './profile.entity';
import { Conversation } from './conversation.entity';

@Table({ tableName: 'message', timestamps: true })
export class Message extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  override id: number;

  @ForeignKey(() => Conversation)
  @Column
  conversationId: number;

  @ForeignKey(() => Profile)
  @Column
  senderId: number;

  @Column
  content: string;

  @Column({ defaultValue: 'TEXT' })
  messageType: string;
  
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
