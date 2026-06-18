import { Test, TestingModule } from '@nestjs/testing';
import { Prisma, TransactionType } from '@prisma/client';
import { getLoggerToken } from 'nestjs-pino';
import { TransactionsRepository } from '../transactions/transactions.repository';
import { createMockLogger } from '../testing/pino-logger.mock';
import { DashboardService } from './dashboard.service';

describe('DashboardService', () => {
  let dashboardService: DashboardService;

  const transactionsRepository = {
    sumByType: jest.fn(),
    topExpenseCategories: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        { provide: TransactionsRepository, useValue: transactionsRepository },
        {
          provide: getLoggerToken(DashboardService.name),
          useValue: createMockLogger(),
        },
      ],
    }).compile();

    dashboardService = module.get<DashboardService>(DashboardService);
    jest.clearAllMocks();
  });

  it('should calculate dashboard summary', async () => {
    transactionsRepository.sumByType
      .mockResolvedValueOnce(new Prisma.Decimal(100000))
      .mockResolvedValueOnce(new Prisma.Decimal(60000));
    transactionsRepository.topExpenseCategories.mockResolvedValue([
      {
        categoryId: 'cat-1',
        categoryName: 'Salaries',
        total: new Prisma.Decimal(40000),
      },
    ]);

    const result = await dashboardService.getSummary('user-1');

    expect(result.currentBalance).toBe('40000.00');
    expect(result.totalIncome).toBe('100000.00');
    expect(result.totalExpense).toBe('60000.00');
    expect(result.topExpenseCategories).toHaveLength(1);
    expect(transactionsRepository.sumByType).toHaveBeenCalledWith(
      'user-1',
      TransactionType.INCOME,
    );
  });

  it('should return zero balance when user has no transactions', async () => {
    transactionsRepository.sumByType
      .mockResolvedValueOnce(new Prisma.Decimal(0))
      .mockResolvedValueOnce(new Prisma.Decimal(0));
    transactionsRepository.topExpenseCategories.mockResolvedValue([]);

    const result = await dashboardService.getSummary('user-1');

    expect(result).toEqual({
      currentBalance: '0.00',
      totalIncome: '0.00',
      totalExpense: '0.00',
      topExpenseCategories: [],
    });
  });
});
