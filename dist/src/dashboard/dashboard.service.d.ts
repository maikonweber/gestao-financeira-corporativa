import { PinoLogger } from 'nestjs-pino';
import { TransactionsRepository } from '../transactions/transactions.repository';
import { DashboardResponseDto } from './dto/dashboard-response.dto';
export declare class DashboardService {
    private readonly transactionsRepository;
    private readonly logger;
    constructor(transactionsRepository: TransactionsRepository, logger: PinoLogger);
    getSummary(userId: string): Promise<DashboardResponseDto>;
}
