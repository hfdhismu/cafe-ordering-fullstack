"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const zod_1 = require("zod");
const orderService_1 = require("../services/orderService");
const errorHandler_1 = require("../middleware/errorHandler");
// Validation schemas
const createOrderSchema = zod_1.z.object({
    items: zod_1.z.array(zod_1.z.object({
        productId: zod_1.z.string().uuid('Invalid product ID'),
        quantity: zod_1.z.number().positive('Quantity must be positive').int('Quantity must be integer'),
    })).min(1, 'Order must contain at least one item'),
});
const updateOrderSchema = zod_1.z.object({
    status: zod_1.z.enum(['pending', 'in_progress', 'completed', 'cancelled']),
});
const querySchema = zod_1.z.object({
    page: zod_1.z.string().transform(Number).pipe(zod_1.z.number().positive().int()).optional(),
    limit: zod_1.z.string().transform(Number).pipe(zod_1.z.number().positive().int().max(100)).optional(),
    status: zod_1.z.enum(['pending', 'in_progress', 'completed', 'cancelled']).optional(),
    sortBy: zod_1.z.enum(['createdAt', 'total', 'status']).optional(),
    sortOrder: zod_1.z.enum(['asc', 'desc']).optional(),
});
class OrderController {
    static async createOrder(req, res, next) {
        try {
            if (!req.user) {
                throw new errorHandler_1.AppError('Authentication required', 401);
            }
            const validatedData = createOrderSchema.parse(req.body);
            const order = await orderService_1.OrderService.createOrder(req.user.userId, validatedData.items);
            res.status(201).json({
                success: true,
                data: { order },
                message: 'Order created successfully',
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
    static async getOrderById(req, res, next) {
        try {
            const { id } = req.params;
            const order = await orderService_1.OrderService.getOrderById(id);
            res.json({
                success: true,
                data: { order },
            });
        }
        catch (error) {
            if (error instanceof Error && error.message === 'Order not found') {
                next(new errorHandler_1.AppError('Order not found', 404));
            }
            else {
                next(error);
            }
        }
    }
    static async getUserOrders(req, res, next) {
        try {
            if (!req.user) {
                throw new errorHandler_1.AppError('Authentication required', 401);
            }
            const validatedQuery = querySchema.parse(req.query);
            const result = await orderService_1.OrderService.getUserOrders(req.user.userId, validatedQuery);
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
    static async getAllOrders(req, res, next) {
        try {
            const validatedQuery = querySchema.parse(req.query);
            const result = await orderService_1.OrderService.getAllOrders(validatedQuery);
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
    static async updateOrderStatus(req, res, next) {
        try {
            const { id } = req.params;
            const validatedData = updateOrderSchema.parse(req.body);
            const order = await orderService_1.OrderService.updateOrderStatus(id, validatedData.status);
            res.json({
                success: true,
                data: { order },
                message: `Order status updated to ${validatedData.status}`,
            });
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                next(new errorHandler_1.AppError(error.issues[0].message, 400));
            }
            else if (error instanceof Error && error.message === 'Order not found') {
                next(new errorHandler_1.AppError('Order not found', 404));
            }
            else {
                next(error);
            }
        }
    }
    static async cancelOrder(req, res, next) {
        try {
            const { id } = req.params;
            let order;
            if (req.user?.role === 'admin') {
                // Admin can cancel any order
                order = await orderService_1.OrderService.cancelOrder(id);
            }
            else if (req.user) {
                // Customers can only cancel their own orders
                order = await orderService_1.OrderService.cancelOrder(id, req.user.userId);
            }
            else {
                throw new errorHandler_1.AppError('Authentication required', 401);
            }
            res.json({
                success: true,
                data: { order },
                message: 'Order cancelled successfully',
            });
        }
        catch (error) {
            if (error instanceof Error) {
                if (error.message.includes('Order not found')) {
                    next(new errorHandler_1.AppError('Order not found or access denied', 404));
                }
                else if (error.message.includes('Cannot cancel')) {
                    next(new errorHandler_1.AppError(error.message, 400));
                }
                else {
                    next(new errorHandler_1.AppError(error.message, 400));
                }
            }
            else {
                next(error);
            }
        }
    }
    static async getOrderStats(req, res, next) {
        try {
            const userId = req.user?.role === 'admin' ? undefined : req.user?.userId;
            if (!req.user) {
                throw new errorHandler_1.AppError('Authentication required', 401);
            }
            const stats = await orderService_1.OrderService.getOrderStats(userId);
            res.json({
                success: true,
                data: stats,
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Shopping cart specific methods (for frontend cart management)
    static async getCartPreview(req, res, next) {
        try {
            const cartItemsSchema = zod_1.z.object({
                items: zod_1.z.array(zod_1.z.object({
                    productId: zod_1.z.string().uuid(),
                    quantity: zod_1.z.number().positive().int(),
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
}
exports.OrderController = OrderController;
//# sourceMappingURL=orderController.js.map