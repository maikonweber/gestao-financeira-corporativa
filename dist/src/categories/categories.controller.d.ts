import { AuthenticatedUser } from '../common/interfaces/jwt-payload.interface';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryEntity } from './entities/category.entity';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    create(user: AuthenticatedUser, dto: CreateCategoryDto): Promise<CategoryEntity>;
    findAll(user: AuthenticatedUser): Promise<CategoryEntity[]>;
    findOne(user: AuthenticatedUser, id: string): Promise<CategoryEntity>;
    update(user: AuthenticatedUser, id: string, dto: UpdateCategoryDto): Promise<CategoryEntity>;
    remove(user: AuthenticatedUser, id: string): Promise<void>;
}
