import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'João Silva',
    description: 'Nome completo do usuário corporativo',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    example: 'joao@empresa.com',
    description: 'E-mail corporativo único no sistema',
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    example: 'SecurePass@123',
    minLength: 8,
    description: 'Senha com no mínimo 8 caracteres (armazenada com bcrypt)',
  })
  password!: string;
}
