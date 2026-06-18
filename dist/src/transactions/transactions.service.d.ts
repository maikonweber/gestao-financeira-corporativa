import { PinoLogger } from 'nestjs-pino';
import { PaginatedResponse } from '../common/interfaces/api-response.interface';
import { CategoriesService } from '../categories/categories.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { FilterTransactionDto } from './dto/filter-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionEntity } from './entities/transaction.entity';
import { TransactionsRepository } from './transactions.repository';
export declare class TransactionsService {
    private readonly transactionsRepository;
    private readonly categoriesService;
    private readonly logger;
    constructor(transactionsRepository: TransactionsRepository, categoriesService: CategoriesService, logger: PinoLogger);
    create(userId: string, dto: CreateTransactionDto): Promise<TransactionEntity>;
    findAll(userId: string, filters: FilterTransactionDto): Promise<PaginatedResponse<TransactionEntity>>;
    findOne(userId: string, id: string): Promise<TransactionEntity>;
    update(userId: string, id: string, dto: UpdateTransactionDto): Promise<TransactionEntity>;
    remove(userId: string, id: string): Promise<void>;
    private toEntity;
}
