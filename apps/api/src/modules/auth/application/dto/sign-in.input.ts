import { IsEmail, IsString, MinLength } from 'class-validator';

export interface SignInInput {
  email: string;
  password: string;
}

export class SignInDto implements SignInInput {
  @IsEmail({}, { message: 'Informe um e-mail válido.' })
  email: string;

  @IsString()
  @MinLength(1, { message: 'Informe sua senha.' })
  password: string;
}
