import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateSpaceDto {
  @IsString()
  @MinLength(2, { message: 'Dê um nome ao espaço.' })
  @MaxLength(40)
  name: string;
}

export class RenameSpaceDto extends CreateSpaceDto {}

export class InviteToSpaceDto {
  @IsEmail({}, { message: 'Informe um e-mail válido.' })
  email: string;
}

export class JoinSpaceDto {
  @IsString()
  @Matches(/^DUO-[A-Z0-9]{4}$/i, {
    message: 'Código inválido. Ele tem o formato DUO-XXXX.',
  })
  code: string;
}
