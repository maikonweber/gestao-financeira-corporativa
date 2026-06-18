import { ApiProperty } from '@nestjs/swagger';

export class TopExpenseCategoryDto {
  @ApiProperty({ format: 'uuid' })
  categoryId!: string;

  @ApiProperty()
  categoryName!: string;

  @ApiProperty({ example: '12500.00' })
  total!: string;
}

export class DashboardResponseDto {
  @ApiProperty({
    example: '45000.00',
    description: 'Saldo atual (totalIncome − totalExpense)',
  })
  currentBalance!: string;

  @ApiProperty({
    example: '120000.00',
    description: 'Soma de todas as transações do tipo INCOME',
  })
  totalIncome!: string;

  @ApiProperty({
    example: '75000.00',
    description: 'Soma de todas as transações do tipo EXPENSE',
  })
  totalExpense!: string;

  @ApiProperty({
    type: [TopExpenseCategoryDto],
    description: 'Top 5 categorias com maior volume de despesas',
  })
  topExpenseCategories!: TopExpenseCategoryDto[];
}
