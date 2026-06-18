import { Injectable, NotFoundException } from '@nestjs/common';
import { Category } from '@prisma/client';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { CategoriesRepository } from './categories.repository';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryEntity } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly categoriesRepository: CategoriesRepository,
    @InjectPinoLogger(CategoriesService.name)
    private readonly logger: PinoLogger,
  ) {}

  async create(userId: string, dto: CreateCategoryDto): Promise<CategoryEntity> {
    const category = await this.categoriesRepository.create(userId, dto);

    this.logger.info(
      {
        event: 'categories.create.success',
        userId,
        categoryId: category.id,
        name: category.name,
      },
      'Category created',
    );

    return this.toEntity(category);
  }

  async findAll(userId: string): Promise<CategoryEntity[]> {
    const categories = await this.categoriesRepository.findAllByUser(userId);

    this.logger.debug(
      {
        event: 'categories.findAll.success',
        userId,
        count: categories.length,
      },
      'Categories listed',
    );

    return categories.map((category) => this.toEntity(category));
  }

  async findOne(userId: string, id: string): Promise<CategoryEntity> {
    const category = await this.categoriesRepository.findByIdAndUser(id, userId);

    if (!category) {
      this.logger.warn(
        { event: 'categories.findOne.not_found', userId, categoryId: id },
        'Category not found',
      );
      throw new NotFoundException('Category not found');
    }

    return this.toEntity(category);
  }

  async update(
    userId: string,
    id: string,
    dto: UpdateCategoryDto,
  ): Promise<CategoryEntity> {
    await this.findOne(userId, id);
    const category = await this.categoriesRepository.update(id, userId, dto);

    this.logger.info(
      { event: 'categories.update.success', userId, categoryId: id },
      'Category updated',
    );

    return this.toEntity(category);
  }

  async remove(userId: string, id: string): Promise<void> {
    await this.findOne(userId, id);
    await this.categoriesRepository.delete(id, userId);

    this.logger.info(
      { event: 'categories.delete.success', userId, categoryId: id },
      'Category deleted',
    );
  }

  async ensureBelongsToUser(categoryId: string, userId: string): Promise<Category> {
    const category = await this.categoriesRepository.findByIdAndUser(
      categoryId,
      userId,
    );

    if (!category) {
      this.logger.warn(
        {
          event: 'categories.ensure.not_found',
          userId,
          categoryId,
        },
        'Category ownership validation failed',
      );
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  private toEntity(category: Category): CategoryEntity {
    return new CategoryEntity({
      id: category.id,
      userId: category.userId,
      name: category.name,
      description: category.description,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    });
  }
}
