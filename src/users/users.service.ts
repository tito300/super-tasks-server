import { Injectable } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDTO } from './dto/user.dto';
import * as dayjs from 'dayjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private useRepository: Repository<User>,
  ) {}
  async create(user: CreateUserDTO): Promise<User> {
    const newUser: Partial<User> = {
      username: user.email,
      email: user.email,
      accountId: user.accountId,
      subscriptionType: 'free' as const,
    };

    try {
      const existingUser = await this.useRepository.findOneBy({
        username: user.email,
      });

      if (existingUser) {
        return existingUser;
      }
      const createdUser = this.useRepository.create(newUser);

      const savedUser = await this.useRepository.save(createdUser);
      return savedUser;
    } catch (error) {
      console.error('Error creating user', error);
      throw new Error('Error creating user');
    }
  }
  async findOne(username: string): Promise<User | null> {
    const user = await this.useRepository.findOneBy({ username });
    if (user) {
      return user;
    }

    return null;
  }
  async findByAccountId(accountId: string): Promise<User | null> {
    const user = await this.useRepository.findOneBy({ accountId });
    return user;
  }

  async updateTodayAiUsage(userId: number, tokensUsed: number) {
    const user = await this.useRepository.findOneBy({ id: userId });
    if (!user) {
      throw new Error('User not found');
    }

    if (user.subscriptionType === 'premium') return;

    const lastReset = user.todayAiUsageTimestamp;
    const lastResetBeforeToday = dayjs(lastReset).isBefore(dayjs(), 'day');

    console.log('********* lastResetBeforeToday', lastResetBeforeToday);
    console.log('********* lastReset', lastReset);
    console.log('********* tokensUsed', tokensUsed);
    console.log('********* user.todayAiUsage', user.todayAiUsage);

    if (!lastReset || !lastResetBeforeToday) {
      user.todayAiUsage += tokensUsed;
    } else {
      user.todayAiUsage = tokensUsed;
    }
    await this.useRepository.save(user);
  }
}
