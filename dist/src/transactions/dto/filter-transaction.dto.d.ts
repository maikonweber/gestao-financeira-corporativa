import { TransactionType } from '@prisma/client';
export declare class PaginationQueryDto {
    page?: number;
    limit?: number;
}
export declare class FilterTransactionDto extends PaginationQueryDto {
    type?: TransactionType;
    categoryId?: string;
    startDate?: string;
    endDate?: string;
}
