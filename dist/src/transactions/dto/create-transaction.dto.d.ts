import { TransactionType } from '../../generated/prisma/client';
export declare class CreateTransactionDto {
    categoryId: string;
    description: string;
    amount: number;
    transactionDate: string;
    type: TransactionType;
}
