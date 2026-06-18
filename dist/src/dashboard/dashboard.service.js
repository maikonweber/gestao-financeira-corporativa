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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const nestjs_pino_1 = require("nestjs-pino");
const transactions_repository_1 = require("../transactions/transactions.repository");
let DashboardService = class DashboardService {
    transactionsRepository;
    logger;
    constructor(transactionsRepository, logger) {
        this.transactionsRepository = transactionsRepository;
        this.logger = logger;
    }
    async getSummary(userId) {
        this.logger.info({ event: 'dashboard.summary.attempt', userId }, 'Calculating dashboard summary');
        const [totalIncome, totalExpense, topExpenseCategories] = await Promise.all([
            this.transactionsRepository.sumByType(userId, client_1.TransactionType.INCOME),
            this.transactionsRepository.sumByType(userId, client_1.TransactionType.EXPENSE),
            this.transactionsRepository.topExpenseCategories(userId),
        ]);
        const currentBalance = totalIncome.minus(totalExpense);
        const summary = {
            currentBalance: currentBalance.toFixed(2),
            totalIncome: totalIncome.toFixed(2),
            totalExpense: totalExpense.toFixed(2),
            topExpenseCategories: topExpenseCategories.map((category) => ({
                categoryId: category.categoryId,
                categoryName: category.categoryName,
                total: category.total.toFixed(2),
            })),
        };
        this.logger.info({
            event: 'dashboard.summary.success',
            userId,
            currentBalance: summary.currentBalance,
            totalIncome: summary.totalIncome,
            totalExpense: summary.totalExpense,
            topCategoriesCount: summary.topExpenseCategories.length,
        }, 'Dashboard summary calculated');
        return summary;
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, nestjs_pino_1.InjectPinoLogger)(DashboardService.name)),
    __metadata("design:paramtypes", [transactions_repository_1.TransactionsRepository,
        nestjs_pino_1.PinoLogger])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map