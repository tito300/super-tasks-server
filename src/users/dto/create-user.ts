import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { SubscriptionType, User } from '../entities/user.entity';

export class CreateUserDTO {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  accountId: string;

  @IsOptional()
  subscriptionType?: SubscriptionType;
}
