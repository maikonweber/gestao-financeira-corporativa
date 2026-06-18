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
exports.DashboardResponseDto = exports.TopExpenseCategoryDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class TopExpenseCategoryDto {
    categoryId;
    categoryName;
    total;
}
exports.TopExpenseCategoryDto = TopExpenseCategoryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ format: 'uuid' }),
    __metadata("design:type", String)
], TopExpenseCategoryDto.prototype, "categoryId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TopExpenseCategoryDto.prototype, "categoryName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '12500.00' }),
    __metadata("design:type", String)
], TopExpenseCategoryDto.prototype, "total", void 0);
class DashboardResponseDto {
    currentBalance;
    totalIncome;
    totalExpense;
    topExpenseCategories;
}
exports.DashboardResponseDto = DashboardResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '45000.00',
        description: 'Saldo atual (totalIncome − totalExpense)',
    }),
    __metadata("design:type", String)
], DashboardResponseDto.prototype, "currentBalance", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '120000.00',
        description: 'Soma de todas as transações do tipo INCOME',
    }),
    __metadata("design:type", String)
], DashboardResponseDto.prototype, "totalIncome", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '75000.00',
        description: 'Soma de todas as transações do tipo EXPENSE',
    }),
    __metadata("design:type", String)
], DashboardResponseDto.prototype, "totalExpense", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [TopExpenseCategoryDto],
        description: 'Top 5 categorias com maior volume de despesas',
    }),
    __metadata("design:type", Array)
], DashboardResponseDto.prototype, "topExpenseCategories", void 0);
//# sourceMappingURL=dashboard-response.dto.js.map