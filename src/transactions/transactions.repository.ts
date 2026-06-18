import { Injectable } from '@nestjs/common';
import { Prisma, Transaction, TransactionType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { FilterTransactionDto } from './dto/filter-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(userId: string, dto: CreateTransactionDto): Promise<Transaction> {
    return this.prisma.transaction.create({
      data: {
        userId,
        categoryId: dto.categoryId,
        description: dto.description,
        amount: new Prisma.Decimal(dto.amount),
        transactionDate: new Date(dto.transactionDate),
        type: dto.type,
      },
    });
  }

  async findAllByUser(
    userId: string,
    filters: FilterTransactionDto,
  ): Promise<{ items: Transaction[]; total: number }> {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Prisma.TransactionWhereInput = {
      userId,
      ...(filters.type && { type: filters.type }),
      ...(filters.categoryId && { categoryId: filters.categoryId }),
      ...(filters.startDate || filters.endDate
        ? {
            transactionDate: {
              ...(filters.startDate && { gte: new Date(filters.startDate) }),
              ...(filters.endDate && { lte: new Date(filters.endDate) }),
            },
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      this.prisma.transaction.findMany({
        where,
        orderBy: { transactionDate: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.transaction.count({ where }),
    ]);

    return { items, total };
  }

  findByIdAndUser(id: string, userId: string): Promise<Transaction | null> {
    return this.prisma.transaction.findFirst({
      where: { id, userId },
    });
  }

  update(
    id: string,
    dto: UpdateTransactionDto,
  ): Promise<Transaction> {
    return this.prisma.transaction.update({
      where: { id },
      data: {
        ...(dto.categoryId !== undefined && { categoryId: dto.categoryId }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.amount !== undefined && {
          amount: new Prisma.Decimal(dto.amount),
        }),
        ...(dto.transactionDate !== undefined && {
          transactionDate: new Date(dto.transactionDate),
        }),
        ...(dto.type !== undefined && { type: dto.type }),
      },
    });
  }

  delete(id: string): Promise<Transaction> {
    return this.prisma.transaction.delete({
      where: { id },
    });
  }

  async sumByType(
    userId: string,
    type: TransactionType,
  ): Promise<Prisma.Decimal> {
    const result = await this.prisma.transaction.aggregate({
      where: { userId, type },
      _sum: { amount: true },
    });

    return result._sum.amount ?? new Prisma.Decimal(0);
  }

  async topExpenseCategories(
    userId: string,
    limit = 5,
  ): Promise<Array<{ categoryId: string; categoryName: string; total: Prisma.Decimal }>> {
    const grouped = await this.prisma.transaction.groupBy({
      by: ['categoryId'],
      where: { userId, type: TransactionType.EXPENSE },
      _sum: { amount: true },
      orderBy: { _sum: { amount: 'desc' } },
      take: limit,
    });

    const categories = await this.prisma.category.findMany({
      where: {
        id: { in: grouped.map((item) => item.categoryId) },
        userId,
      },
      select: { id: true, name: true },
    });

    const categoryMap = new Map(
      categories.map((category) => [category.id, category.name]),
    );

    return grouped.map((item) => ({
      categoryId: item.categoryId,
      categoryName: categoryMap.get(item.categoryId) ?? 'Unknown',
      total: item._sum.amount ?? new Prisma.Decimal(0),
    }));
  }
}
