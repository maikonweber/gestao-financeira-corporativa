import { AuthenticatedUser } from '../common/interfaces/jwt-payload.interface';
import { DashboardService } from './dashboard.service';
import { DashboardResponseDto } from './dto/dashboard-response.dto';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getSummary(user: AuthenticatedUser): Promise<DashboardResponseDto>;
}
