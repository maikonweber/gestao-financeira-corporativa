import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { TransactionType } from '@prisma/client';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../common/interfaces/jwt-payload.interface';
import { ApiStandardErrors } from '../common/swagger/api-error-response.decorator';
import { PaginatedTransactionResponseDto } from '../common/swagger/paginated-transaction.swagger';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { FilterTransactionDto } from './dto/filter-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionEntity } from './entities/transaction.entity';
import { TransactionsService } from './transactions.service';

@ApiTags('Transactions')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
    @InjectPinoLogger(TransactionsController.name)
    private readonly logger: PinoLogger,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Criar transação',
    description:
      'Registra uma receita (INCOME) ou despesa (EXPENSE). ' +
      'A categoria informada deve pertencer ao usuário autenticado. ' +
      'O valor é armazenado com precisão decimal(14,2).',
  })
  @ApiBody({ type: CreateTransactionDto })
  @ApiCreatedResponse({
    type: TransactionEntity,
    description: 'Transação criada com sucesso',
  })
  @ApiStandardErrors()
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateTransactionDto,
  ): Promise<TransactionEntity> {
    this.logger.info(
      {
        event: 'transactions.create.request',
        userId: user.id,
        categoryId: dto.categoryId,
        type: dto.type,
        amount: dto.amount,
      },
      'Create transaction request',
    );
    return this.transactionsService.create(user.id, dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar transações com paginação e filtros',
    description:
      'Retorna transações do usuário com suporte a filtros por tipo, categoria e período. ' +
      'Resultados ordenados por data da transação (mais recentes primeiro).',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número da página (padrão: 1)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Itens por página (padrão: 10, máximo: 100)',
    example: 10,
  })
  @ApiQuery({
    name: 'type',
    required: false,
    enum: TransactionType,
    description: 'Filtrar por tipo de transação',
  })
  @ApiQuery({
    name: 'categoryId',
    required: false,
    format: 'uuid',
    description: 'Filtrar por categoria (deve pertencer ao usuário)',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: String,
    description: 'Data inicial do período (ISO 8601, ex: 2024-01-01)',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: String,
    description: 'Data final do período (ISO 8601, ex: 2024-12-31)',
  })
  @ApiOkResponse({
    type: PaginatedTransactionResponseDto,
    description: 'Lista paginada de transações com metadados',
  })
  @ApiStandardErrors()
  findAll(
    @CurrentUser() user: AuthenticatedUser,
    @Query() filters: FilterTransactionDto,
  ) {
    this.logger.debug(
      {
        event: 'transactions.findAll.request',
        userId: user.id,
        filters,
      },
      'List transactions request',
    );
    return this.transactionsService.findAll(user.id, filters);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar transação por ID',
    description:
      'Retorna os detalhes de uma transação específica do usuário autenticado.',
  })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ type: TransactionEntity })
  @ApiStandardErrors()
  findOne(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<TransactionEntity> {
    this.logger.debug(
      { event: 'transactions.findOne.request', userId: user.id, transactionId: id },
      'Find transaction request',
    );
    return this.transactionsService.findOne(user.id, id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar transação',
    description:
      'Atualiza parcialmente uma transação existente. ' +
      'Se `categoryId` for alterado, a nova categoria deve pertencer ao usuário.',
  })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiBody({ type: UpdateTransactionDto })
  @ApiOkResponse({ type: TransactionEntity })
  @ApiStandardErrors()
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTransactionDto,
  ): Promise<TransactionEntity> {
    this.logger.info(
      { event: 'transactions.update.request', userId: user.id, transactionId: id },
      'Update transaction request',
    );
    return this.transactionsService.update(user.id, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Remover transação',
    description: 'Exclui permanentemente uma transação do usuário autenticado.',
  })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiNoContentResponse({ description: 'Transação removida com sucesso' })
  @ApiStandardErrors()
  async remove(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    this.logger.info(
      { event: 'transactions.delete.request', userId: user.id, transactionId: id },
      'Delete transaction request',
    );
    await this.transactionsService.remove(user.id, id);
  }
}
