import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../../users/entities/user.entity';

export class AuthResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT access token para uso no header Authorization',
  })
  accessToken!: string;

  @ApiProperty({
    type: UserEntity,
    description: 'Dados do usuário autenticado (sem senha)',
  })
  user!: UserEntity;
}
