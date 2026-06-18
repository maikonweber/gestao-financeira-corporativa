import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
  Max,
} from 'class-validator';
import { TransactionType } from '@prisma/client';

/** Matches PostgreSQL DECIMAL(14, 2) — 12 integer digits + 2 decimal places */
export const MAX_TRANSACTION_AMOUNT = 999_999_999_999.99;

export class CreateTransactionDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  @IsNotEmpty()
  categoryId!: string;

  @ApiProperty({ example: 'Monthly software subscription' })
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiProperty({ example: 299.99, maximum: MAX_TRANSACTION_AMOUNT })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Max(MAX_TRANSACTION_AMOUNT, {
    message: `amount must not exceed ${MAX_TRANSACTION_AMOUNT}`,
  })
  amount!: number;

  @ApiProperty({ example: '2024-06-15' })
  @IsDateString()
  transactionDate!: string;

  @ApiProperty({ enum: TransactionType, example: TransactionType.EXPENSE })
  @IsEnum(TransactionType)
  type!: TransactionType;
}
