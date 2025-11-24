import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { OrderService } from '../services/orderService';
import { AppError } from '../middleware/errorHandler';
import { ApiResponse } from '../types';

// Validation schemas
const createOrderSchema = z.object({
  items: z.array(z.object({
    productId: z.string().uuid('Invalid product ID'),
    quantity: z.number().positive('Quantity must be positive').int('Quantity must be integer'),
  })).min(1, 'Order must contain at least one item'),
});

const updateOrderSchema = z.object({
  status: z.enum(['pending', 'in_progress', 'completed', 'cancelled']),
});

const querySchema = z.object({
  page: z.string().transform(Number).pipe(z.number().positive().int()).optional(),
  limit: z.string().transform(Number).pipe(z.number().positive().int().max(100)).optional(),
  status: z.enum(['pending', 'in_progress', 'completed', 'cancelled']).optional(),
  sortBy: z.enum(['createdAt', 'total', 'status']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export class OrderController {
  static async createOrder(req: Request, res: Response<ApiResponse>, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AppError('Authentication required', 401);
      }

      const validatedData = createOrderSchema.parse(req.body);

      const order = await OrderService.createOrder(req.user.userId, validatedData.items);

      res.status(201).json({
        success: true,
        data: { order },
        message: 'Order created successfully',
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

  static async getOrderById(req: Request, res: Response<ApiResponse>, next: NextFunction) {
    try {
      const { id } = req.params;

      const order = await OrderService.getOrderById(id);

      res.json({
        success: true,
        data: { order },
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Order not found') {
        next(new AppError('Order not found', 404));
      } else {
        next(error);
      }
    }
  }

  static async getUserOrders(req: Request, res: Response<ApiResponse>, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AppError('Authentication required', 401);
      }

      const validatedQuery = querySchema.parse(req.query);

      const result = await OrderService.getUserOrders(req.user.userId, validatedQuery);

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

  static async getAllOrders(req: Request, res: Response<ApiResponse>, next: NextFunction) {
    try {
      const validatedQuery = querySchema.parse(req.query);

      const result = await OrderService.getAllOrders(validatedQuery);

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

  static async updateOrderStatus(req: Request, res: Response<ApiResponse>, next: NextFunction) {
    try {
      const { id } = req.params;
      const validatedData = updateOrderSchema.parse(req.body);

      const order = await OrderService.updateOrderStatus(id, validatedData.status);

      res.json({
        success: true,
        data: { order },
        message: `Order status updated to ${validatedData.status}`,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        next(new AppError(error.issues[0].message, 400));
      } else if (error instanceof Error && error.message === 'Order not found') {
        next(new AppError('Order not found', 404));
      } else {
        next(error);
      }
    }
  }

  static async cancelOrder(req: Request, res: Response<ApiResponse>, next: NextFunction) {
    try {
      const { id } = req.params;

      let order;
      if (req.user?.role === 'admin') {
        // Admin can cancel any order
        order = await OrderService.cancelOrder(id);
      } else if (req.user) {
        // Customers can only cancel their own orders
        order = await OrderService.cancelOrder(id, req.user.userId);
      } else {
        throw new AppError('Authentication required', 401);
      }

      res.json({
        success: true,
        data: { order },
        message: 'Order cancelled successfully',
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('Order not found')) {
          next(new AppError('Order not found or access denied', 404));
        } else if (error.message.includes('Cannot cancel')) {
          next(new AppError(error.message, 400));
        } else {
          next(new AppError(error.message, 400));
        }
      } else {
        next(error);
      }
    }
  }

  static async getOrderStats(req: Request, res: Response<ApiResponse>, next: NextFunction) {
    try {
      const userId = req.user?.role === 'admin' ? undefined : req.user?.userId;

      if (!req.user) {
        throw new AppError('Authentication required', 401);
      }

      const stats = await OrderService.getOrderStats(userId);

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }

  // Shopping cart specific methods (for frontend cart management)
  static async getCartPreview(req: Request, res: Response<ApiResponse>, next: NextFunction) {
    try {
      const cartItemsSchema = z.object({
        items: z.array(z.object({
          productId: z.string().uuid(),
          quantity: z.number().positive().int(),
        })),
      });

      const validatedData = cartItemsSchema.parse(req.body);

      // This would calculate cart total and validate items without creating order
      // For now, return the items back (in a real implementation, you'd fetch product details)
      res.json({
        success: true,
        data: {
          items: validatedData.items,
          totalItems: validatedData.items.reduce((sum, item) => sum + item.quantity, 0),
          // In a real implementation, you'd calculate the actual total here
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        next(new AppError(error.issues[0].message, 400));
      } else {
        next(error);
      }
    }
  }
}