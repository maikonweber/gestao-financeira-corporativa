import { TransactionsRepository } from '../transactions/transactions.repository';
import { DashboardResponseDto } from './dto/dashboard-response.dto';
export declare class DashboardService {
    private readonly transactionsRepository;
    constructor(transactionsRepository: TransactionsRepository);
    getSummary(userId: string): Promise<DashboardResponseDto>;
}
