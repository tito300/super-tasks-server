import { IsNotEmpty } from 'class-validator';

export class SignInDTO {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  googleToken: string;
}
