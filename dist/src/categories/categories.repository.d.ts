import { Category } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
export declare class CategoriesRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(userId: string, dto: CreateCategoryDto): Promise<Category>;
    findAllByUser(userId: string): Promise<Category[]>;
    findByIdAndUser(id: string, userId: string): Promise<Category | null>;
    update(id: string, _userId: string, dto: UpdateCategoryDto): Promise<Category>;
    delete(id: string, _userId: string): Promise<Category>;
}
