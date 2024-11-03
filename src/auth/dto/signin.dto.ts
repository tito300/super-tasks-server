import { IsNotEmpty } from 'class-validator';

export class SignInDTO {
  @IsNotEmpty()
  accountId: string;

  @IsNotEmpty()
  googleToken: string;
}
