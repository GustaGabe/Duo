import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export interface SignUpInput {
  name: string;
  email: string;
  password: string;
}

export class SignUpDto implements SignUpInput {
  @IsString()
  @MinLength(2, { message: 'Informe seu nome.' })
  @MaxLength(80)
  name: string;

  @IsEmail({}, { message: 'Informe um e-mail válido.' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'A senha precisa de pelo menos 8 caracteres.' })
  @MaxLength(72, { message: 'A senha pode ter no máximo 72 caracteres.' })
  password: string;
}
