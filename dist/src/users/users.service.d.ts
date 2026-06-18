import { User } from '../../generated/prisma/client';
import { UserEntity } from './entities/user.entity';
import { UsersRepository } from './users.repository';
export declare class UsersService {
    private readonly usersRepository;
    constructor(usersRepository: UsersRepository);
    create(data: {
        name: string;
        email: string;
        passwordHash: string;
    }): Promise<UserEntity>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<UserEntity | null>;
    toEntity(user: User): UserEntity;
}
