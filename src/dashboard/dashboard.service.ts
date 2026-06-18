import { Injectable } from '@nestjs/common';
import { TransactionType } from '@prisma/client';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { TransactionsRepository } from '../transactions/transactions.repository';
import { DashboardResponseDto } from './dto/dashboard-response.dto';

@Injectable()
export class DashboardService {
  constructor(
    private readonly transactionsRepository: TransactionsRepository,
    @InjectPinoLogger(DashboardService.name)
    private readonly logger: PinoLogger,
  ) {}

  async getSummary(userId: string): Promise<DashboardResponseDto> {
    this.logger.info(
      { event: 'dashboard.summary.attempt', userId },
      'Calculating dashboard summary',
    );

    const [totalIncome, totalExpense, topExpenseCategories] = await Promise.all([
      this.transactionsRepository.sumByType(userId, TransactionType.INCOME),
      this.transactionsRepository.sumByType(userId, TransactionType.EXPENSE),
      this.transactionsRepository.topExpenseCategories(userId),
    ]);

    const currentBalance = totalIncome.minus(totalExpense);

    const summary: DashboardResponseDto = {
      currentBalance: currentBalance.toFixed(2),
      totalIncome: totalIncome.toFixed(2),
      totalExpense: totalExpense.toFixed(2),
      topExpenseCategories: topExpenseCategories.map((category) => ({
        categoryId: category.categoryId,
        categoryName: category.categoryName,
        total: category.total.toFixed(2),
      })),
    };

    this.logger.info(
      {
        event: 'dashboard.summary.success',
        userId,
        currentBalance: summary.currentBalance,
        totalIncome: summary.totalIncome,
        totalExpense: summary.totalExpense,
        topCategoriesCount: summary.topExpenseCategories.length,
      },
      'Dashboard summary calculated',
    );

    return summary;
  }
}
