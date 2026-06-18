export declare class CategoryEntity {
    id: string;
    userId: string;
    name: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
    constructor(partial: Partial<CategoryEntity>);
}
