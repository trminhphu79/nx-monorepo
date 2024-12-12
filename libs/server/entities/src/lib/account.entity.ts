import {
  Column,
  Model,
  Table,
  PrimaryKey,
  AutoIncrement,
  DataType,
  HasMany,
} from 'sequelize-typescript';
import { Profile } from './profile.entity';

@Table({ tableName: 'account' })
export class Account extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  override id: number;

  @HasMany(() => Profile)
  profiles: Profile[];

  @Column
  username: string;

  @Column
  password: string;

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
