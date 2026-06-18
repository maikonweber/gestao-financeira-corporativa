import { ApiProperty } from '@nestjs/swagger';
import { TransactionEntity } from '../../transactions/entities/transaction.entity';

export class PaginationMetaDto {
  @ApiProperty({ example: 42, description: 'Total de registros encontrados' })
  total!: number;

  @ApiProperty({ example: 1, description: 'Página atual' })
  page!: number;

  @ApiProperty({ example: 10, description: 'Quantidade de itens por página' })
  limit!: number;

  @ApiProperty({ example: 5, description: 'Total de páginas' })
  totalPages!: number;
}

export class PaginatedTransactionResponseDto {
  @ApiProperty({ type: [TransactionEntity], description: 'Lista de transações' })
  items!: TransactionEntity[];

  @ApiProperty({ type: PaginationMetaDto, description: 'Metadados de paginação' })
  meta!: PaginationMetaDto;
}
