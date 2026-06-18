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
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const nestjs_pino_1 = require("nestjs-pino");
const categories_repository_1 = require("./categories.repository");
const category_entity_1 = require("./entities/category.entity");
let CategoriesService = class CategoriesService {
    categoriesRepository;
    logger;
    constructor(categoriesRepository, logger) {
        this.categoriesRepository = categoriesRepository;
        this.logger = logger;
    }
    async create(userId, dto) {
        const category = await this.categoriesRepository.create(userId, dto);
        this.logger.info({
            event: 'categories.create.success',
            userId,
            categoryId: category.id,
            name: category.name,
        }, 'Category created');
        return this.toEntity(category);
    }
    async findAll(userId) {
        const categories = await this.categoriesRepository.findAllByUser(userId);
        this.logger.debug({
            event: 'categories.findAll.success',
            userId,
            count: categories.length,
        }, 'Categories listed');
        return categories.map((category) => this.toEntity(category));
    }
    async findOne(userId, id) {
        const category = await this.categoriesRepository.findByIdAndUser(id, userId);
        if (!category) {
            this.logger.warn({ event: 'categories.findOne.not_found', userId, categoryId: id }, 'Category not found');
            throw new common_1.NotFoundException('Category not found');
        }
        return this.toEntity(category);
    }
    async update(userId, id, dto) {
        await this.findOne(userId, id);
        const category = await this.categoriesRepository.update(id, userId, dto);
        this.logger.info({ event: 'categories.update.success', userId, categoryId: id }, 'Category updated');
        return this.toEntity(category);
    }
    async remove(userId, id) {
        await this.findOne(userId, id);
        const transactionCount = await this.categoriesRepository.countTransactions(id);
        if (transactionCount > 0) {
            this.logger.warn({
                event: 'categories.delete.conflict',
                userId,
                categoryId: id,
                transactionCount,
            }, 'Category delete blocked — linked transactions exist');
            throw new common_1.ConflictException('Cannot delete category with associated transactions');
        }
        await this.categoriesRepository.delete(id, userId);
        this.logger.info({ event: 'categories.delete.success', userId, categoryId: id }, 'Category deleted');
    }
    async ensureBelongsToUser(categoryId, userId) {
        const category = await this.categoriesRepository.findByIdAndUser(categoryId, userId);
        if (!category) {
            this.logger.warn({
                event: 'categories.ensure.not_found',
                userId,
                categoryId,
            }, 'Category ownership validation failed');
            throw new common_1.NotFoundException('Category not found');
        }
        return category;
    }
    toEntity(category) {
        return new category_entity_1.CategoryEntity({
            id: category.id,
            userId: category.userId,
            name: category.name,
            description: category.description,
            createdAt: category.createdAt,
            updatedAt: category.updatedAt,
        });
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, nestjs_pino_1.InjectPinoLogger)(CategoriesService.name)),
    __metadata("design:paramtypes", [categories_repository_1.CategoriesRepository,
        nestjs_pino_1.PinoLogger])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map