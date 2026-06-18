import { TransactionType } from '@prisma/client';
export declare const MAX_TRANSACTION_AMOUNT = 999999999999.99;
export declare class CreateTransactionDto {
    categoryId: string;
    description: string;
    amount: number;
    transactionDate: string;
    type: TransactionType;
}
