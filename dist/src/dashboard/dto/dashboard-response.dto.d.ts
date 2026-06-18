export declare class TopExpenseCategoryDto {
    categoryId: string;
    categoryName: string;
    total: string;
}
export declare class DashboardResponseDto {
    currentBalance: string;
    totalIncome: string;
    totalExpense: string;
    topExpenseCategories: TopExpenseCategoryDto[];
}
