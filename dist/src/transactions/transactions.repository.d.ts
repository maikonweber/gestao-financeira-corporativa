import { Prisma, Transaction, TransactionType } from '../../generated/prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { FilterTransactionDto } from './dto/filter-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
export declare class TransactionsRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(userId: string, dto: CreateTransactionDto): Promise<Transaction>;
    findAllByUser(userId: string, filters: FilterTransactionDto): Promise<{
        items: Transaction[];
        total: number;
    }>;
    findByIdAndUser(id: string, userId: string): Promise<Transaction | null>;
    update(id: string, dto: UpdateTransactionDto): Promise<Transaction>;
    delete(id: string): Promise<Transaction>;
    sumByType(userId: string, type: TransactionType): Promise<Prisma.Decimal>;
    topExpenseCategories(userId: string, limit?: number): Promise<Array<{
        categoryId: string;
        categoryName: string;
        total: Prisma.Decimal;
    }>>;
}
