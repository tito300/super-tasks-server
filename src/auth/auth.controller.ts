import { AuthService } from './auth.service';
import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { SignInDTO } from './dto/signin.dto';

@Controller('/api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: SignInDTO) {
    return this.authService.signIn(signInDto);
  }
}
