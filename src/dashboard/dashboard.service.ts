import { Injectable } from '@nestjs/common';
import { TransactionType } from '../../generated/prisma/client';
import { TransactionsRepository } from '../transactions/transactions.repository';
import { DashboardResponseDto } from './dto/dashboard-response.dto';

@Injectable()
export class DashboardService {
  constructor(
    private readonly transactionsRepository: TransactionsRepository,
  ) {}

  async getSummary(userId: string): Promise<DashboardResponseDto> {
    const [totalIncome, totalExpense, topExpenseCategories] = await Promise.all([
      this.transactionsRepository.sumByType(userId, TransactionType.INCOME),
      this.transactionsRepository.sumByType(userId, TransactionType.EXPENSE),
      this.transactionsRepository.topExpenseCategories(userId),
    ]);

    const currentBalance = totalIncome.minus(totalExpense);

    return {
      currentBalance: currentBalance.toFixed(2),
      totalIncome: totalIncome.toFixed(2),
      totalExpense: totalExpense.toFixed(2),
      topExpenseCategories: topExpenseCategories.map((category) => ({
        categoryId: category.categoryId,
        categoryName: category.categoryName,
        total: category.total.toFixed(2),
      })),
    };
  }
}
