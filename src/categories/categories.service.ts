import { Injectable, NotFoundException } from '@nestjs/common';
import { Category } from '../../generated/prisma/client';
import { CategoriesRepository } from './categories.repository';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryEntity } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async create(userId: string, dto: CreateCategoryDto): Promise<CategoryEntity> {
    const category = await this.categoriesRepository.create(userId, dto);
    return this.toEntity(category);
  }

  async findAll(userId: string): Promise<CategoryEntity[]> {
    const categories = await this.categoriesRepository.findAllByUser(userId);
    return categories.map((category) => this.toEntity(category));
  }

  async findOne(userId: string, id: string): Promise<CategoryEntity> {
    const category = await this.categoriesRepository.findByIdAndUser(id, userId);

    if (!category) {
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
    return this.toEntity(category);
  }

  async remove(userId: string, id: string): Promise<void> {
    await this.findOne(userId, id);
    await this.categoriesRepository.delete(id, userId);
  }

  async ensureBelongsToUser(categoryId: string, userId: string): Promise<Category> {
    const category = await this.categoriesRepository.findByIdAndUser(
      categoryId,
      userId,
    );

    if (!category) {
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
