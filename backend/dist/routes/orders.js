"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderRouter = void 0;
const express_1 = require("express");
const orderController_1 = require("../controllers/orderController");
const auth_1 = require("../middleware/auth");
exports.orderRouter = (0, express_1.Router)();
// Public routes (for getting specific order details)
exports.orderRouter.get('/:id', orderController_1.OrderController.getOrderById);
// Protected routes
exports.orderRouter.post('/', auth_1.authenticateToken, orderController_1.OrderController.createOrder);
exports.orderRouter.get('/user/my-orders', auth_1.authenticateToken, orderController_1.OrderController.getUserOrders);
exports.orderRouter.post('/cancel/:id', auth_1.authenticateToken, orderController_1.OrderController.cancelOrder);
exports.orderRouter.get('/stats/overview', auth_1.authenticateToken, orderController_1.OrderController.getOrderStats);
exports.orderRouter.post('/cart/preview', auth_1.authenticateToken, orderController_1.OrderController.getCartPreview);
// Admin only routes
exports.orderRouter.get('/admin/all', auth_1.authenticateToken, auth_1.requireAdmin, orderController_1.OrderController.getAllOrders);
exports.orderRouter.patch('/admin/:id/status', auth_1.authenticateToken, auth_1.requireAdmin, orderController_1.OrderController.updateOrderStatus);
//# sourceMappingURL=orders.js.map