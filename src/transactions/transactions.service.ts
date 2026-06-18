import { Injectable, NotFoundException } from '@nestjs/common';
import { Transaction } from '../../generated/prisma/client';
import { PaginatedResponse } from '../common/interfaces/api-response.interface';
import { CategoriesService } from '../categories/categories.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { FilterTransactionDto } from './dto/filter-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionEntity } from './entities/transaction.entity';
import { TransactionsRepository } from './transactions.repository';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly transactionsRepository: TransactionsRepository,
    private readonly categoriesService: CategoriesService,
  ) {}

  async create(
    userId: string,
    dto: CreateTransactionDto,
  ): Promise<TransactionEntity> {
    await this.categoriesService.ensureBelongsToUser(dto.categoryId, userId);

    const transaction = await this.transactionsRepository.create(userId, dto);
    return this.toEntity(transaction);
  }

  async findAll(
    userId: string,
    filters: FilterTransactionDto,
  ): Promise<PaginatedResponse<TransactionEntity>> {
    if (filters.categoryId) {
      await this.categoriesService.ensureBelongsToUser(
        filters.categoryId,
        userId,
      );
    }

    const page = filters.page ?? 1;
    const limit = filters.limit ?? 10;
    const { items, total } = await this.transactionsRepository.findAllByUser(
      userId,
      filters,
    );

    return {
      items: items.map((transaction) => this.toEntity(transaction)),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async findOne(userId: string, id: string): Promise<TransactionEntity> {
    const transaction = await this.transactionsRepository.findByIdAndUser(
      id,
      userId,
    );

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return this.toEntity(transaction);
  }

  async update(
    userId: string,
    id: string,
    dto: UpdateTransactionDto,
  ): Promise<TransactionEntity> {
    await this.findOne(userId, id);

    if (dto.categoryId) {
      await this.categoriesService.ensureBelongsToUser(dto.categoryId, userId);
    }

    const transaction = await this.transactionsRepository.update(id, dto);
    return this.toEntity(transaction);
  }

  async remove(userId: string, id: string): Promise<void> {
    await this.findOne(userId, id);
    await this.transactionsRepository.delete(id);
  }

  private toEntity(transaction: Transaction): TransactionEntity {
    return new TransactionEntity({
      id: transaction.id,
      userId: transaction.userId,
      categoryId: transaction.categoryId,
      description: transaction.description,
      amount: transaction.amount.toString(),
      transactionDate: transaction.transactionDate,
      type: transaction.type,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
    });
  }
}
