export declare const TransactionType: {
    readonly INCOME: "INCOME";
    readonly EXPENSE: "EXPENSE";
};
export type TransactionType = (typeof TransactionType)[keyof typeof TransactionType];
