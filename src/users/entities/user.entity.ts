import { IsEmail } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export type SubscriptionType = 'free' | 'premium';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({ unique: true, nullable: false })
  @IsEmail()
  email: string;

  @Column({
    type: 'enum',
    enum: ['free', 'premium'],
    default: 'free',
  })
  subscriptionType: SubscriptionType;

  @Column()
  accountId: string; // chrome getProfileUserInfo id

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
