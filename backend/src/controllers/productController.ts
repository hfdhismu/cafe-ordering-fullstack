import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ProductService } from '../services/productService';
import { AppError } from '../middleware/errorHandler';
import { ApiResponse } from '../types';

// Validation schemas
const createProductSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  description: z.string().min(1, 'Description is required').max(500, 'Description too long'),
  price: z.number().positive('Price must be positive'),
  category: z.string().min(1, 'Category is required'),
  imageUrl: z.string().url('Invalid image URL').optional().nullable(),
  isAvailable: z.boolean().optional(),
});

const updateProductSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long').optional(),
  description: z.string().min(1, 'Description is required').max(500, 'Description too long').optional(),
  price: z.number().positive('Price must be positive').optional(),
  category: z.string().min(1, 'Category is required').optional(),
  imageUrl: z.string().url('Invalid image URL').optional().nullable(),
  isAvailable: z.boolean().optional(),
});

const querySchema = z.object({
  page: z.string().transform(Number).pipe(z.number().positive().int()).optional(),
  limit: z.string().transform(Number).pipe(z.number().positive().int().max(100)).optional(),
  category: z.string().optional(),
  search: z.string().optional(),
  availableOnly: z.string().transform(val => val === 'true').optional(),
  sortBy: z.enum(['name', 'price', 'createdAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export class ProductController {
  static async createProduct(req: Request, res: Response<ApiResponse>, next: NextFunction) {
    try {
      const validatedData = createProductSchema.parse(req.body);

      const product = await ProductService.createProduct(validatedData);

      res.status(201).json({
        success: true,
        data: { product },
        message: 'Product created successfully',
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        next(new AppError(error.issues[0].message, 400));
      } else if (error instanceof Error) {
        next(new AppError(error.message, 400));
      } else {
        next(error);
      }
    }
  }

  static async getAllProducts(req: Request, res: Response<ApiResponse>, next: NextFunction) {
    try {
      const validatedQuery = querySchema.parse(req.query);

      const result = await ProductService.getAllProducts(validatedQuery);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        next(new AppError(error.issues[0].message, 400));
      } else {
        next(error);
      }
    }
  }

  static async getProductById(req: Request, res: Response<ApiResponse>, next: NextFunction) {
    try {
      const { id } = req.params;

      const product = await ProductService.getProductById(id);

      if (!product) {
        throw new AppError('Product not found', 404);
      }

      res.json({
        success: true,
        data: { product },
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateProduct(req: Request, res: Response<ApiResponse>, next: NextFunction) {
    try {
      const { id } = req.params;
      const validatedData = updateProductSchema.parse(req.body);

      const product = await ProductService.updateProduct(id, validatedData);

      if (!product) {
        throw new AppError('Product not found', 404);
      }

      res.json({
        success: true,
        data: { product },
        message: 'Product updated successfully',
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        next(new AppError(error.issues[0].message, 400));
      } else {
        next(error);
      }
    }
  }

  static async deleteProduct(req: Request, res: Response<ApiResponse>, next: NextFunction) {
    try {
      const { id } = req.params;

      const deleted = await ProductService.deleteProduct(id);

      if (!deleted) {
        throw new AppError('Product not found', 404);
      }

      res.json({
        success: true,
        message: 'Product deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  static async toggleProductAvailability(req: Request, res: Response<ApiResponse>, next: NextFunction) {
    try {
      const { id } = req.params;

      const product = await ProductService.toggleProductAvailability(id);

      if (!product) {
        throw new AppError('Product not found', 404);
      }

      res.json({
        success: true,
        data: { product },
        message: `Product ${product.isAvailable ? 'enabled' : 'disabled'} successfully`,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getCategories(req: Request, res: Response<ApiResponse>, next: NextFunction) {
    try {
      const categories = await ProductService.getCategories();

      res.json({
        success: true,
        data: { categories },
      });
    } catch (error) {
      next(error);
    }
  }
}