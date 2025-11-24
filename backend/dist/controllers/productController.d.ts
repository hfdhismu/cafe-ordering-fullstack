import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';
export declare class ProductController {
    static createProduct(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void>;
    static getAllProducts(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void>;
    static getProductById(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void>;
    static updateProduct(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void>;
    static deleteProduct(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void>;
    static toggleProductAvailability(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void>;
    static getCategories(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=productController.d.ts.map