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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("../../generated/prisma/client");
const transactions_repository_1 = require("../transactions/transactions.repository");
let DashboardService = class DashboardService {
    transactionsRepository;
    constructor(transactionsRepository) {
        this.transactionsRepository = transactionsRepository;
    }
    async getSummary(userId) {
        const [totalIncome, totalExpense, topExpenseCategories] = await Promise.all([
            this.transactionsRepository.sumByType(userId, client_1.TransactionType.INCOME),
            this.transactionsRepository.sumByType(userId, client_1.TransactionType.EXPENSE),
            this.transactionsRepository.topExpenseCategories(userId),
        ]);
        const currentBalance = totalIncome.minus(totalExpense);
        return {
            currentBalance: currentBalance.toFixed(2),
            totalIncome: totalIncome.toFixed(2),
            totalExpense: totalExpense.toFixed(2),
            topExpenseCategories: topExpenseCategories.map((category) => ({
                categoryId: category.categoryId,
                categoryName: category.categoryName,
                total: category.total.toFixed(2),
            })),
        };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [transactions_repository_1.TransactionsRepository])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map