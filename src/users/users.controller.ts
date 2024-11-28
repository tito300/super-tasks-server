import { Body, Controller, Post, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO } from './dto/create-user';
import { JwtService } from '@nestjs/jwt';
import { getJwtBody } from 'src/auth/utils/getJwtBody';
import { Response } from 'express';
import { mapUserToDto } from './utils/mapUserToDto';
import { UserDTO } from './dto/user.dto';

@Controller('/api/users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  @Post()
  async create(@Body() user: CreateUserDTO, @Res() res: Response) {
    const createdUser = await this.usersService.create(user);

    if (createdUser) {
      const jwt_token = await this.jwtService.signAsync(
        getJwtBody(createdUser, user.googleToken),
      );

      const userDto = mapUserToDto(createdUser);
      return res.setHeader('Jwt-Token', jwt_token).status(201).json(userDto);
    }
  }
}
