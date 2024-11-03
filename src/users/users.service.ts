import { Injectable } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDTO } from './dto/user.dto';

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
}
