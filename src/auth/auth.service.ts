import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SignInDTO } from './dto/signin.dto';
import { getJwtBody } from './utils/getJwtBody';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInDTO): Promise<{ jwt_token: string }> {
    const user = await this.usersService.findByAccountId(signInDto.accountId);
    if (!user) {
      throw new UnauthorizedException();
    }

    return {
      jwt_token: await this.jwtService.signAsync(getJwtBody(user)),
    };
  }
}
