import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../common/interfaces/jwt-payload.interface';
import { ApiStandardErrors } from '../common/swagger/api-error-response.decorator';
import { DashboardService } from './dashboard.service';
import { DashboardResponseDto } from './dto/dashboard-response.dto';

@ApiTags('Dashboard')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(
    private readonly dashboardService: DashboardService,
    @InjectPinoLogger(DashboardController.name)
    private readonly logger: PinoLogger,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Obter resumo financeiro',
    description:
      'Calcula e retorna o panorama financeiro do usuário autenticado, incluindo:\n\n' +
      '- **currentBalance**: saldo atual (receitas − despesas)\n' +
      '- **totalIncome**: soma de todas as receitas\n' +
      '- **totalExpense**: soma de todas as despesas\n' +
      '- **topExpenseCategories**: top 5 categorias com maior volume de despesas',
  })
  @ApiOkResponse({
    type: DashboardResponseDto,
    description: 'Resumo financeiro consolidado',
  })
  @ApiStandardErrors()
  getSummary(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<DashboardResponseDto> {
    this.logger.debug(
      { event: 'dashboard.summary.request', userId: user.id },
      'Dashboard summary request',
    );
    return this.dashboardService.getSummary(user.id);
  }
}
