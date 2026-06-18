import { PinoLogger } from 'nestjs-pino';
import type { AuthenticatedUser } from '../common/interfaces/jwt-payload.interface';
import { DashboardService } from './dashboard.service';
import { DashboardResponseDto } from './dto/dashboard-response.dto';
export declare class DashboardController {
    private readonly dashboardService;
    private readonly logger;
    constructor(dashboardService: DashboardService, logger: PinoLogger);
    getSummary(user: AuthenticatedUser): Promise<DashboardResponseDto>;
}
