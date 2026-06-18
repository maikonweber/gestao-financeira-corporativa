import { User } from '../../generated/prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
export declare class UsersRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: {
        name: string;
        email: string;
        passwordHash: string;
    }): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
}
