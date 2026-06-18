import { TransactionType } from '../../generated/prisma/client';
export declare class TransactionEntity {
    id: string;
    userId: string;
    categoryId: string;
    description: string;
    amount: string;
    transactionDate: Date;
    type: TransactionType;
    createdAt: Date;
    updatedAt: Date;
    constructor(partial: Partial<TransactionEntity>);
}
