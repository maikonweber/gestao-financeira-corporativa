import { Injectable } from '@nestjs/common';
import { User } from '../../generated/prisma/client';
import { UserEntity } from './entities/user.entity';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(data: {
    name: string;
    email: string;
    passwordHash: string;
  }): Promise<UserEntity> {
    const user = await this.usersRepository.create(data);
    return this.toEntity(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findByEmail(email);
  }

  async findById(id: string): Promise<UserEntity | null> {
    const user = await this.usersRepository.findById(id);
    return user ? this.toEntity(user) : null;
  }

  toEntity(user: User): UserEntity {
    return new UserEntity({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }
}
