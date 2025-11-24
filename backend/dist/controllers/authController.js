"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const zod_1 = require("zod");
const authService_1 = require("../services/authService");
const errorHandler_1 = require("../middleware/errorHandler");
// Validation schemas
const signupSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email format'),
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
    role: zod_1.z.enum(['admin', 'customer']).optional().default('customer'),
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email format'),
    password: zod_1.z.string().min(1, 'Password is required'),
});
const updateProfileSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters').optional(),
    email: zod_1.z.string().email('Invalid email format').optional(),
}).refine(data => data.name !== undefined || data.email !== undefined, {
    message: 'At least one field must be provided for update',
});
class AuthController {
    static async signup(req, res, next) {
        try {
            // Validate input
            const validatedData = signupSchema.parse(req.body);
            // Create user
            const user = await authService_1.AuthService.createUser(validatedData);
            // Generate token
            const token = authService_1.AuthService.generateToken({
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
    static async login(req, res, next) {
        try {
            // Validate input
            const validatedData = loginSchema.parse(req.body);
            // Authenticate user
            const result = await authService_1.AuthService.authenticateUser(validatedData.email, validatedData.password);
            res.json({
                success: true,
                data: result,
                message: 'Login successful',
            });
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                next(new errorHandler_1.AppError(error.issues[0].message, 400));
            }
            else if (error instanceof Error) {
                next(new errorHandler_1.AppError(error.message, 401));
            }
            else {
                next(error);
            }
        }
    }
    static async getProfile(req, res, next) {
        try {
            if (!req.user) {
                throw new errorHandler_1.AppError('User not authenticated', 401);
            }
            const user = await authService_1.AuthService.getUserById(req.user.userId);
            if (!user) {
                throw new errorHandler_1.AppError('User not found', 404);
            }
            res.json({
                success: true,
                data: { user },
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async updateProfile(req, res, next) {
        try {
            if (!req.user) {
                throw new errorHandler_1.AppError('User not authenticated', 401);
            }
            // Validate input
            const validatedData = updateProfileSchema.parse(req.body);
            // Update user
            const updatedUser = await authService_1.AuthService.updateUser(req.user.userId, validatedData);
            if (!updatedUser) {
                throw new errorHandler_1.AppError('User not found', 404);
            }
            res.json({
                success: true,
                data: { user: updatedUser },
                message: 'Profile updated successfully',
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
    static async logout(req, res) {
        // For JWT tokens, logout is typically handled client-side
        // by removing the token from storage
        res.json({
            success: true,
            message: 'Logout successful',
        });
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=authController.js.map