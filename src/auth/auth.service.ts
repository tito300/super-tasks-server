import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SignInDTO } from './dto/signin.dto';
import { getJwtBody } from './utils/getJwtBody';
import { OAuth2Client } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signIn(signInDto: SignInDTO): Promise<{ jwt_token: string }> {
    const user = await this.usersService.findByEmail(signInDto.email);
    if (!user) {
      throw new UnauthorizedException();
    }

    try {
      await this.verifyGoogleToken(signInDto.googleToken);
      return {
        jwt_token: await this.jwtService.signAsync(
          getJwtBody(user, signInDto.googleToken),
        ),
      };
    } catch (e) {
      console.error(e);
      throw new UnauthorizedException();
    }
  }

  /**
   * FE provides "Access Token" from Google Sign-In
   * This method verifies the token with Google
   * Note: Access tokens are different from ID tokens
   */
  async verifyGoogleToken(googleToken: string) {
    return fetch(
      `https://oauth2.googleapis.com/tokeninfo?access_token=${googleToken}`,
    )
      .then((response) => response.json())
      .then((data) => {
        return data;
      });
  }
}
