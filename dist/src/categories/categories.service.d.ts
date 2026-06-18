import { Category } from '../../generated/prisma/client';
import { CategoriesRepository } from './categories.repository';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryEntity } from './entities/category.entity';
export declare class CategoriesService {
    private readonly categoriesRepository;
    constructor(categoriesRepository: CategoriesRepository);
    create(userId: string, dto: CreateCategoryDto): Promise<CategoryEntity>;
    findAll(userId: string): Promise<CategoryEntity[]>;
    findOne(userId: string, id: string): Promise<CategoryEntity>;
    update(userId: string, id: string, dto: UpdateCategoryDto): Promise<CategoryEntity>;
    remove(userId: string, id: string): Promise<void>;
    ensureBelongsToUser(categoryId: string, userId: string): Promise<Category>;
    private toEntity;
}
