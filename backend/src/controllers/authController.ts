import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AuthService } from '../services/authService';
import { AppError } from '../middleware/errorHandler';
import { ApiResponse } from '../types';

// Validation schemas
const signupSchema = z.object({
  email: z.string().email('Invalid email format'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['admin', 'customer']).optional().default('customer'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  email: z.string().email('Invalid email format').optional(),
}).refine(data => data.name !== undefined || data.email !== undefined, {
  message: 'At least one field must be provided for update',
});

export class AuthController {
  static async signup(req: Request, res: Response<ApiResponse>, next: NextFunction) {
    try {
      // Validate input
      const validatedData = signupSchema.parse(req.body);

      // Create user
      const user = await AuthService.createUser(validatedData);

      // Generate token
      const token = AuthService.generateToken({
        id: user.id,
        email: user.email,
        role: user.role,
      });

      res.status(201).json({
        success: true,
        data: {
          user,
          token,
        },
        message: 'User created successfully',
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

  static async login(req: Request, res: Response<ApiResponse>, next: NextFunction) {
    try {
      // Validate input
      const validatedData = loginSchema.parse(req.body);

      // Authenticate user
      const result = await AuthService.authenticateUser(
        validatedData.email,
        validatedData.password
      );

      res.json({
        success: true,
        data: result,
        message: 'Login successful',
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        next(new AppError(error.issues[0].message, 400));
      } else if (error instanceof Error) {
        next(new AppError(error.message, 401));
      } else {
        next(error);
      }
    }
  }

  static async getProfile(req: Request, res: Response<ApiResponse>, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401);
      }

      const user = await AuthService.getUserById(req.user.userId);

      if (!user) {
        throw new AppError('User not found', 404);
      }

      res.json({
        success: true,
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req: Request, res: Response<ApiResponse>, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401);
      }

      // Validate input
      const validatedData = updateProfileSchema.parse(req.body);

      // Update user
      const updatedUser = await AuthService.updateUser(req.user.userId, validatedData);

      if (!updatedUser) {
        throw new AppError('User not found', 404);
      }

      res.json({
        success: true,
        data: { user: updatedUser },
        message: 'Profile updated successfully',
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        next(new AppError(error.issues[0].message, 400));
      } else {
        next(error);
      }
    }
  }

  static async logout(req: Request, res: Response<ApiResponse>) {
    // For JWT tokens, logout is typically handled client-side
    // by removing the token from storage
    res.json({
      success: true,
      message: 'Logout successful',
    });
  }
}