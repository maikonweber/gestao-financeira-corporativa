import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TransactionType } from '../../generated/prisma/client';
import { CategoriesService } from '../categories/categories.service';
import { TransactionsRepository } from './transactions.repository';
import { TransactionsService } from './transactions.service';

describe('TransactionsService', () => {
  let transactionsService: TransactionsService;

  const transactionsRepository = {
    create: jest.fn(),
    findAllByUser: jest.fn(),
    findByIdAndUser: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const categoriesService = {
    ensureBelongsToUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        { provide: TransactionsRepository, useValue: transactionsRepository },
        { provide: CategoriesService, useValue: categoriesService },
      ],
    }).compile();

    transactionsService = module.get<TransactionsService>(TransactionsService);
    jest.clearAllMocks();
  });

  it('should create a transaction when category belongs to user', async () => {
    categoriesService.ensureBelongsToUser.mockResolvedValue({ id: 'cat-1' });
    transactionsRepository.create.mockResolvedValue({
      id: 'tx-1',
      userId: 'user-1',
      categoryId: 'cat-1',
      description: 'Test',
      amount: { toString: () => '100.00' },
      transactionDate: new Date('2024-01-01'),
      type: TransactionType.EXPENSE,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await transactionsService.create('user-1', {
      categoryId: 'cat-1',
      description: 'Test',
      amount: 100,
      transactionDate: '2024-01-01',
      type: TransactionType.EXPENSE,
    });

    expect(result.amount).toBe('100.00');
    expect(categoriesService.ensureBelongsToUser).toHaveBeenCalledWith(
      'cat-1',
      'user-1',
    );
  });

  it('should throw NotFoundException when transaction is not found', async () => {
    transactionsRepository.findByIdAndUser.mockResolvedValue(null);

    await expect(
      transactionsService.findOne('user-1', 'tx-1'),
    ).rejects.toThrow(NotFoundException);
  });
});
