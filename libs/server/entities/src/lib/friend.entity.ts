import { Column, Model, Table, ForeignKey, DataType } from 'sequelize-typescript';
import { Profile } from './profile.entity';

@Table({ tableName: 'friend' })
export class Friend extends Model {
  @ForeignKey(() => Profile)
  @Column
  profileId: number;

  @ForeignKey(() => Profile)
  @Column
  friendId: number;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  isBestFriend: boolean; // Example: Additional column to manage the type of friendship
}
