"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionsRepository = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("../../generated/prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
let TransactionsRepository = class TransactionsRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(userId, dto) {
        return this.prisma.transaction.create({
            data: {
                userId,
                categoryId: dto.categoryId,
                description: dto.description,
                amount: new client_1.Prisma.Decimal(dto.amount),
                transactionDate: new Date(dto.transactionDate),
                type: dto.type,
            },
        });
    }
    async findAllByUser(userId, filters) {
        const page = filters.page ?? 1;
        const limit = filters.limit ?? 10;
        const skip = (page - 1) * limit;
        const where = {
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
    findByIdAndUser(id, userId) {
        return this.prisma.transaction.findFirst({
            where: { id, userId },
        });
    }
    update(id, dto) {
        return this.prisma.transaction.update({
            where: { id },
            data: {
                ...(dto.categoryId !== undefined && { categoryId: dto.categoryId }),
                ...(dto.description !== undefined && { description: dto.description }),
                ...(dto.amount !== undefined && {
                    amount: new client_1.Prisma.Decimal(dto.amount),
                }),
                ...(dto.transactionDate !== undefined && {
                    transactionDate: new Date(dto.transactionDate),
                }),
                ...(dto.type !== undefined && { type: dto.type }),
            },
        });
    }
    delete(id) {
        return this.prisma.transaction.delete({
            where: { id },
        });
    }
    async sumByType(userId, type) {
        const result = await this.prisma.transaction.aggregate({
            where: { userId, type },
            _sum: { amount: true },
        });
        return result._sum.amount ?? new client_1.Prisma.Decimal(0);
    }
    async topExpenseCategories(userId, limit = 5) {
        const grouped = await this.prisma.transaction.groupBy({
            by: ['categoryId'],
            where: { userId, type: client_1.TransactionType.EXPENSE },
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
        const categoryMap = new Map(categories.map((category) => [category.id, category.name]));
        return grouped.map((item) => ({
            categoryId: item.categoryId,
            categoryName: categoryMap.get(item.categoryId) ?? 'Unknown',
            total: item._sum.amount ?? new client_1.Prisma.Decimal(0),
        }));
    }
};
exports.TransactionsRepository = TransactionsRepository;
exports.TransactionsRepository = TransactionsRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], TransactionsRepository);
//# sourceMappingURL=transactions.repository.js.map