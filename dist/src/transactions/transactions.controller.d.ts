import { AuthenticatedUser } from '../common/interfaces/jwt-payload.interface';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { FilterTransactionDto } from './dto/filter-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionEntity } from './entities/transaction.entity';
import { TransactionsService } from './transactions.service';
export declare class TransactionsController {
    private readonly transactionsService;
    constructor(transactionsService: TransactionsService);
    create(user: AuthenticatedUser, dto: CreateTransactionDto): Promise<TransactionEntity>;
    findAll(user: AuthenticatedUser, filters: FilterTransactionDto): Promise<import("../common/interfaces/api-response.interface").PaginatedResponse<TransactionEntity>>;
    findOne(user: AuthenticatedUser, id: string): Promise<TransactionEntity>;
    update(user: AuthenticatedUser, id: string, dto: UpdateTransactionDto): Promise<TransactionEntity>;
    remove(user: AuthenticatedUser, id: string): Promise<void>;
}
