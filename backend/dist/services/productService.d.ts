interface ProductResponse {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    imageUrl?: string;
    isAvailable: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare class ProductService {
    static createProduct(productData: {
        name: string;
        description: string;
        price: number;
        category: string;
        imageUrl?: string;
        isAvailable?: boolean;
    }): Promise<ProductResponse>;
    static getAllProducts(options?: {
        page?: number;
        limit?: number;
        category?: string;
        search?: string;
        availableOnly?: boolean;
        sortBy?: 'name' | 'price' | 'createdAt';
        sortOrder?: 'asc' | 'desc';
    }): Promise<{
        products: ProductResponse[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    static getProductById(id: string): Promise<ProductResponse | null>;
    static updateProduct(id: string, updates: {
        name?: string;
        description?: string;
        price?: number;
        category?: string;
        imageUrl?: string;
        isAvailable?: boolean;
    }): Promise<ProductResponse | null>;
    static deleteProduct(id: string): Promise<boolean>;
    static getCategories(): Promise<string[]>;
    static toggleProductAvailability(id: string): Promise<ProductResponse | null>;
}
export {};
//# sourceMappingURL=productService.d.ts.map