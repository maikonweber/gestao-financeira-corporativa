export interface ApiResponse<T> {
    success: boolean;
    data: T;
    timestamp: string;
}
export interface PaginatedResponse<T> {
    items: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}
