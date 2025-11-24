"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const zod_1 = require("zod");
const productService_1 = require("../services/productService");
const errorHandler_1 = require("../middleware/errorHandler");
// Validation schemas
const createProductSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required').max(100, 'Name too long'),
    description: zod_1.z.string().min(1, 'Description is required').max(500, 'Description too long'),
    price: zod_1.z.number().positive('Price must be positive'),
    category: zod_1.z.string().min(1, 'Category is required'),
    imageUrl: zod_1.z.string().url('Invalid image URL').optional().nullable(),
    isAvailable: zod_1.z.boolean().optional(),
});
const updateProductSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required').max(100, 'Name too long').optional(),
    description: zod_1.z.string().min(1, 'Description is required').max(500, 'Description too long').optional(),
    price: zod_1.z.number().positive('Price must be positive').optional(),
    category: zod_1.z.string().min(1, 'Category is required').optional(),
    imageUrl: zod_1.z.string().url('Invalid image URL').optional().nullable(),
    isAvailable: zod_1.z.boolean().optional(),
});
const querySchema = zod_1.z.object({
    page: zod_1.z.string().transform(Number).pipe(zod_1.z.number().positive().int()).optional(),
    limit: zod_1.z.string().transform(Number).pipe(zod_1.z.number().positive().int().max(100)).optional(),
    category: zod_1.z.string().optional(),
    search: zod_1.z.string().optional(),
    availableOnly: zod_1.z.string().transform(val => val === 'true').optional(),
    sortBy: zod_1.z.enum(['name', 'price', 'createdAt']).optional(),
    sortOrder: zod_1.z.enum(['asc', 'desc']).optional(),
});
class ProductController {
    static async createProduct(req, res, next) {
        try {
            const validatedData = createProductSchema.parse(req.body);
            const product = await productService_1.ProductService.createProduct(validatedData);
            res.status(201).json({
                success: true,
                data: { product },
                message: 'Product created successfully',
            });
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                next(new errorHandler_1.AppError(error.issues[0].message, 400));
            }
            else if (error instanceof Error) {
                next(new errorHandler_1.AppError(error.message, 400));
            }
            else {
                next(error);
            }
        }
    }
    static async getAllProducts(req, res, next) {
        try {
            const validatedQuery = querySchema.parse(req.query);
            const result = await productService_1.ProductService.getAllProducts(validatedQuery);
            res.json({
                success: true,
                data: result,
            });
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                next(new errorHandler_1.AppError(error.issues[0].message, 400));
            }
            else {
                next(error);
            }
        }
    }
    static async getProductById(req, res, next) {
        try {
            const { id } = req.params;
            const product = await productService_1.ProductService.getProductById(id);
            if (!product) {
                throw new errorHandler_1.AppError('Product not found', 404);
            }
            res.json({
                success: true,
                data: { product },
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async updateProduct(req, res, next) {
        try {
            const { id } = req.params;
            const validatedData = updateProductSchema.parse(req.body);
            const product = await productService_1.ProductService.updateProduct(id, validatedData);
            if (!product) {
                throw new errorHandler_1.AppError('Product not found', 404);
            }
            res.json({
                success: true,
                data: { product },
                message: 'Product updated successfully',
            });
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                next(new errorHandler_1.AppError(error.issues[0].message, 400));
            }
            else {
                next(error);
            }
        }
    }
    static async deleteProduct(req, res, next) {
        try {
            const { id } = req.params;
            const deleted = await productService_1.ProductService.deleteProduct(id);
            if (!deleted) {
                throw new errorHandler_1.AppError('Product not found', 404);
            }
            res.json({
                success: true,
                message: 'Product deleted successfully',
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async toggleProductAvailability(req, res, next) {
        try {
            const { id } = req.params;
            const product = await productService_1.ProductService.toggleProductAvailability(id);
            if (!product) {
                throw new errorHandler_1.AppError('Product not found', 404);
            }
            res.json({
                success: true,
                data: { product },
                message: `Product ${product.isAvailable ? 'enabled' : 'disabled'} successfully`,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getCategories(req, res, next) {
        try {
            const categories = await productService_1.ProductService.getCategories();
            res.json({
                success: true,
                data: { categories },
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ProductController = ProductController;
//# sourceMappingURL=productController.js.map