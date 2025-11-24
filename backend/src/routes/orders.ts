import { Router } from 'express';
import { OrderController } from '../controllers/orderController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

export const orderRouter = Router();

// Public routes (for getting specific order details)
orderRouter.get('/:id', OrderController.getOrderById);

// Protected routes
orderRouter.post('/', authenticateToken, OrderController.createOrder);
orderRouter.get('/user/my-orders', authenticateToken, OrderController.getUserOrders);
orderRouter.post('/cancel/:id', authenticateToken, OrderController.cancelOrder);
orderRouter.get('/stats/overview', authenticateToken, OrderController.getOrderStats);
orderRouter.post('/cart/preview', authenticateToken, OrderController.getCartPreview);

// Admin only routes
orderRouter.get('/admin/all', authenticateToken, requireAdmin, OrderController.getAllOrders);
orderRouter.patch('/admin/:id/status', authenticateToken, requireAdmin, OrderController.updateOrderStatus);