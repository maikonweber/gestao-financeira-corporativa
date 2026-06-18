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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionsService = void 0;
const common_1 = require("@nestjs/common");
const categories_service_1 = require("../categories/categories.service");
const transaction_entity_1 = require("./entities/transaction.entity");
const transactions_repository_1 = require("./transactions.repository");
let TransactionsService = class TransactionsService {
    transactionsRepository;
    categoriesService;
    constructor(transactionsRepository, categoriesService) {
        this.transactionsRepository = transactionsRepository;
        this.categoriesService = categoriesService;
    }
    async create(userId, dto) {
        await this.categoriesService.ensureBelongsToUser(dto.categoryId, userId);
        const transaction = await this.transactionsRepository.create(userId, dto);
        return this.toEntity(transaction);
    }
    async findAll(userId, filters) {
        if (filters.categoryId) {
            await this.categoriesService.ensureBelongsToUser(filters.categoryId, userId);
        }
        const page = filters.page ?? 1;
        const limit = filters.limit ?? 10;
        const { items, total } = await this.transactionsRepository.findAllByUser(userId, filters);
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
    async findOne(userId, id) {
        const transaction = await this.transactionsRepository.findByIdAndUser(id, userId);
        if (!transaction) {
            throw new common_1.NotFoundException('Transaction not found');
        }
        return this.toEntity(transaction);
    }
    async update(userId, id, dto) {
        await this.findOne(userId, id);
        if (dto.categoryId) {
            await this.categoriesService.ensureBelongsToUser(dto.categoryId, userId);
        }
        const transaction = await this.transactionsRepository.update(id, dto);
        return this.toEntity(transaction);
    }
    async remove(userId, id) {
        await this.findOne(userId, id);
        await this.transactionsRepository.delete(id);
    }
    toEntity(transaction) {
        return new transaction_entity_1.TransactionEntity({
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
};
exports.TransactionsService = TransactionsService;
exports.TransactionsService = TransactionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [transactions_repository_1.TransactionsRepository,
        categories_service_1.CategoriesService])
], TransactionsService);
//# sourceMappingURL=transactions.service.js.map