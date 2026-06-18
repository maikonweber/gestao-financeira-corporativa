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
exports.CategoriesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const nestjs_pino_1 = require("nestjs-pino");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const api_error_response_decorator_1 = require("../common/swagger/api-error-response.decorator");
const categories_service_1 = require("./categories.service");
const create_category_dto_1 = require("./dto/create-category.dto");
const update_category_dto_1 = require("./dto/update-category.dto");
const category_entity_1 = require("./entities/category.entity");
let CategoriesController = class CategoriesController {
    categoriesService;
    logger;
    constructor(categoriesService, logger) {
        this.categoriesService = categoriesService;
        this.logger = logger;
    }
    create(user, dto) {
        this.logger.info({ event: 'categories.create.request', userId: user.id, name: dto.name }, 'Create category request');
        return this.categoriesService.create(user.id, dto);
    }
    findAll(user) {
        this.logger.debug({ event: 'categories.findAll.request', userId: user.id }, 'List categories request');
        return this.categoriesService.findAll(user.id);
    }
    findOne(user, id) {
        this.logger.debug({ event: 'categories.findOne.request', userId: user.id, categoryId: id }, 'Find category request');
        return this.categoriesService.findOne(user.id, id);
    }
    update(user, id, dto) {
        this.logger.info({ event: 'categories.update.request', userId: user.id, categoryId: id }, 'Update category request');
        return this.categoriesService.update(user.id, id, dto);
    }
    async remove(user, id) {
        this.logger.info({ event: 'categories.delete.request', userId: user.id, categoryId: id }, 'Delete category request');
        await this.categoriesService.remove(user.id, id);
    }
};
exports.CategoriesController = CategoriesController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Criar categoria',
        description: 'Cadastra uma nova categoria financeira vinculada ao usuário autenticado. ' +
            'Categorias são usadas para classificar transações de receita e despesa.',
    }),
    (0, swagger_1.ApiBody)({ type: create_category_dto_1.CreateCategoryDto }),
    (0, swagger_1.ApiCreatedResponse)({
        type: category_entity_1.CategoryEntity,
        description: 'Categoria criada com sucesso',
    }),
    (0, api_error_response_decorator_1.ApiStandardErrors)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_category_dto_1.CreateCategoryDto]),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Listar categorias',
        description: 'Retorna todas as categorias do usuário autenticado, ordenadas alfabeticamente por nome.',
    }),
    (0, swagger_1.ApiOkResponse)({
        type: [category_entity_1.CategoryEntity],
        description: 'Lista de categorias do usuário',
    }),
    (0, api_error_response_decorator_1.ApiStandardErrors)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Buscar categoria por ID',
        description: 'Retorna os detalhes de uma categoria específica. ' +
            'Retorna 404 se a categoria não existir ou não pertencer ao usuário.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        format: 'uuid',
        description: 'Identificador único da categoria',
    }),
    (0, swagger_1.ApiOkResponse)({ type: category_entity_1.CategoryEntity }),
    (0, api_error_response_decorator_1.ApiStandardErrors)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Atualizar categoria',
        description: 'Atualiza parcialmente os dados de uma categoria existente. ' +
            'Somente campos enviados no body serão alterados.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', format: 'uuid' }),
    (0, swagger_1.ApiBody)({ type: update_category_dto_1.UpdateCategoryDto }),
    (0, swagger_1.ApiOkResponse)({ type: category_entity_1.CategoryEntity }),
    (0, api_error_response_decorator_1.ApiStandardErrors)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_category_dto_1.UpdateCategoryDto]),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({
        summary: 'Remover categoria',
        description: 'Exclui permanentemente uma categoria do usuário. ' +
            'Não é possível excluir categorias vinculadas a transações existentes (RESTRICT).',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', format: 'uuid' }),
    (0, swagger_1.ApiNoContentResponse)({ description: 'Categoria removida com sucesso' }),
    (0, api_error_response_decorator_1.ApiStandardErrors)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "remove", null);
exports.CategoriesController = CategoriesController = __decorate([
    (0, swagger_1.ApiTags)('Categories'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('categories'),
    __param(1, (0, nestjs_pino_1.InjectPinoLogger)(CategoriesController.name)),
    __metadata("design:paramtypes", [categories_service_1.CategoriesService,
        nestjs_pino_1.PinoLogger])
], CategoriesController);
//# sourceMappingURL=categories.controller.js.map