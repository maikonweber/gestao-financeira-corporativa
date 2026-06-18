import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { TransactionType } from '@prisma/client';
import {
  CreateTransactionDto,
  MAX_TRANSACTION_AMOUNT,
} from './create-transaction.dto';

describe('CreateTransactionDto', () => {
  const validPayload = {
    categoryId: '4d4d145a-95ae-4c2f-8e60-93c5f4894dd9',
    description: 'Office supplies',
    amount: 100.5,
    transactionDate: '2026-06-18',
    type: TransactionType.EXPENSE,
  };

  it('should accept amount within DECIMAL(14, 2) limit', async () => {
    const dto = plainToInstance(CreateTransactionDto, {
      ...validPayload,
      amount: MAX_TRANSACTION_AMOUNT,
    });

    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
  });

  it('should reject amount above DECIMAL(14, 2) limit', async () => {
    const dto = plainToInstance(CreateTransactionDto, {
      ...validPayload,
      amount: 111111111111111110000,
    });

    const errors = await validate(dto);

    expect(errors.some((error) => error.property === 'amount')).toBe(true);
  });
});
