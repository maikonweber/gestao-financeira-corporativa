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
exports.DashboardController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const nestjs_pino_1 = require("nestjs-pino");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const api_error_response_decorator_1 = require("../common/swagger/api-error-response.decorator");
const dashboard_service_1 = require("./dashboard.service");
const dashboard_response_dto_1 = require("./dto/dashboard-response.dto");
let DashboardController = class DashboardController {
    dashboardService;
    logger;
    constructor(dashboardService, logger) {
        this.dashboardService = dashboardService;
        this.logger = logger;
    }
    getSummary(user) {
        this.logger.debug({ event: 'dashboard.summary.request', userId: user.id }, 'Dashboard summary request');
        return this.dashboardService.getSummary(user.id);
    }
};
exports.DashboardController = DashboardController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Obter resumo financeiro',
        description: 'Calcula e retorna o panorama financeiro do usuário autenticado, incluindo:\n\n' +
            '- **currentBalance**: saldo atual (receitas − despesas)\n' +
            '- **totalIncome**: soma de todas as receitas\n' +
            '- **totalExpense**: soma de todas as despesas\n' +
            '- **topExpenseCategories**: top 5 categorias com maior volume de despesas',
    }),
    (0, swagger_1.ApiOkResponse)({
        type: dashboard_response_dto_1.DashboardResponseDto,
        description: 'Resumo financeiro consolidado',
    }),
    (0, api_error_response_decorator_1.ApiStandardErrors)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getSummary", null);
exports.DashboardController = DashboardController = __decorate([
    (0, swagger_1.ApiTags)('Dashboard'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('dashboard'),
    __param(1, (0, nestjs_pino_1.InjectPinoLogger)(DashboardController.name)),
    __metadata("design:paramtypes", [dashboard_service_1.DashboardService,
        nestjs_pino_1.PinoLogger])
], DashboardController);
//# sourceMappingURL=dashboard.controller.js.map