import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'joao@empresa.com',
    description: 'E-mail cadastrado no sistema',
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    example: 'SecurePass@123',
    description: 'Senha do usuário',
  })
  @IsString()
  @IsNotEmpty()
  password!: string;
}
