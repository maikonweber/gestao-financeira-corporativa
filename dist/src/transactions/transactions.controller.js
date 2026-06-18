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
exports.TransactionsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const nestjs_pino_1 = require("nestjs-pino");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const api_error_response_decorator_1 = require("../common/swagger/api-error-response.decorator");
const paginated_transaction_swagger_1 = require("../common/swagger/paginated-transaction.swagger");
const create_transaction_dto_1 = require("./dto/create-transaction.dto");
const filter_transaction_dto_1 = require("./dto/filter-transaction.dto");
const update_transaction_dto_1 = require("./dto/update-transaction.dto");
const transaction_entity_1 = require("./entities/transaction.entity");
const transactions_service_1 = require("./transactions.service");
let TransactionsController = class TransactionsController {
    transactionsService;
    logger;
    constructor(transactionsService, logger) {
        this.transactionsService = transactionsService;
        this.logger = logger;
    }
    create(user, dto) {
        this.logger.info({
            event: 'transactions.create.request',
            userId: user.id,
            categoryId: dto.categoryId,
            type: dto.type,
            amount: dto.amount,
        }, 'Create transaction request');
        return this.transactionsService.create(user.id, dto);
    }
    findAll(user, filters) {
        this.logger.debug({
            event: 'transactions.findAll.request',
            userId: user.id,
            filters,
        }, 'List transactions request');
        return this.transactionsService.findAll(user.id, filters);
    }
    findOne(user, id) {
        this.logger.debug({ event: 'transactions.findOne.request', userId: user.id, transactionId: id }, 'Find transaction request');
        return this.transactionsService.findOne(user.id, id);
    }
    update(user, id, dto) {
        this.logger.info({ event: 'transactions.update.request', userId: user.id, transactionId: id }, 'Update transaction request');
        return this.transactionsService.update(user.id, id, dto);
    }
    async remove(user, id) {
        this.logger.info({ event: 'transactions.delete.request', userId: user.id, transactionId: id }, 'Delete transaction request');
        await this.transactionsService.remove(user.id, id);
    }
};
exports.TransactionsController = TransactionsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Criar transação',
        description: 'Registra uma receita (INCOME) ou despesa (EXPENSE). ' +
            'A categoria informada deve pertencer ao usuário autenticado. ' +
            'O valor é armazenado com precisão decimal(14,2).',
    }),
    (0, swagger_1.ApiBody)({ type: create_transaction_dto_1.CreateTransactionDto }),
    (0, swagger_1.ApiCreatedResponse)({
        type: transaction_entity_1.TransactionEntity,
        description: 'Transação criada com sucesso',
    }),
    (0, api_error_response_decorator_1.ApiStandardErrors)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_transaction_dto_1.CreateTransactionDto]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Listar transações com paginação e filtros',
        description: 'Retorna transações do usuário com suporte a filtros por tipo, categoria e período. ' +
            'Resultados ordenados por data da transação (mais recentes primeiro).',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'page',
        required: false,
        type: Number,
        description: 'Número da página (padrão: 1)',
        example: 1,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        type: Number,
        description: 'Itens por página (padrão: 10, máximo: 100)',
        example: 10,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'type',
        required: false,
        enum: client_1.TransactionType,
        description: 'Filtrar por tipo de transação',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'categoryId',
        required: false,
        format: 'uuid',
        description: 'Filtrar por categoria (deve pertencer ao usuário)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'startDate',
        required: false,
        type: String,
        description: 'Data inicial do período (ISO 8601, ex: 2024-01-01)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'endDate',
        required: false,
        type: String,
        description: 'Data final do período (ISO 8601, ex: 2024-12-31)',
    }),
    (0, swagger_1.ApiOkResponse)({
        type: paginated_transaction_swagger_1.PaginatedTransactionResponseDto,
        description: 'Lista paginada de transações com metadados',
    }),
    (0, api_error_response_decorator_1.ApiStandardErrors)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, filter_transaction_dto_1.FilterTransactionDto]),
    __metadata("design:returntype", void 0)
], TransactionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Buscar transação por ID',
        description: 'Retorna os detalhes de uma transação específica do usuário autenticado.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', format: 'uuid' }),
    (0, swagger_1.ApiOkResponse)({ type: transaction_entity_1.TransactionEntity }),
    (0, api_error_response_decorator_1.ApiStandardErrors)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Atualizar transação',
        description: 'Atualiza parcialmente uma transação existente. ' +
            'Se `categoryId` for alterado, a nova categoria deve pertencer ao usuário.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', format: 'uuid' }),
    (0, swagger_1.ApiBody)({ type: update_transaction_dto_1.UpdateTransactionDto }),
    (0, swagger_1.ApiOkResponse)({ type: transaction_entity_1.TransactionEntity }),
    (0, api_error_response_decorator_1.ApiStandardErrors)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_transaction_dto_1.UpdateTransactionDto]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({
        summary: 'Remover transação',
        description: 'Exclui permanentemente uma transação do usuário autenticado.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', format: 'uuid' }),
    (0, swagger_1.ApiNoContentResponse)({ description: 'Transação removida com sucesso' }),
    (0, api_error_response_decorator_1.ApiStandardErrors)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "remove", null);
exports.TransactionsController = TransactionsController = __decorate([
    (0, swagger_1.ApiTags)('Transactions'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('transactions'),
    __param(1, (0, nestjs_pino_1.InjectPinoLogger)(TransactionsController.name)),
    __metadata("design:paramtypes", [transactions_service_1.TransactionsService,
        nestjs_pino_1.PinoLogger])
], TransactionsController);
//# sourceMappingURL=transactions.controller.js.map