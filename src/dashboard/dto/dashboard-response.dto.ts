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
  @ApiProperty({ example: '45000.00' })
  currentBalance!: string;

  @ApiProperty({ example: '120000.00' })
  totalIncome!: string;

  @ApiProperty({ example: '75000.00' })
  totalExpense!: string;

  @ApiProperty({ type: [TopExpenseCategoryDto] })
  topExpenseCategories!: TopExpenseCategoryDto[];
}
