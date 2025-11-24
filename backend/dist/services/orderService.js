"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const database_1 = require("../config/database");
const drizzle_orm_1 = require("drizzle-orm");
class OrderService {
    static async createOrder(userId, items) {
        if (items.length === 0) {
            throw new Error('Order must contain at least one item');
        }
        // Validate products and calculate total
        let total = 0;
        const orderItemsData = [];
        for (const item of items) {
            if (item.quantity <= 0) {
                throw new Error('Quantity must be greater than 0');
            }
            // Get product details
            const [product] = await database_1.db
                .select()
                .from(database_1.schema.products)
                .where((0, drizzle_orm_1.eq)(database_1.schema.products.id, item.productId))
                .limit(1);
            if (!product) {
                throw new Error(`Product with id ${item.productId} not found`);
            }
            if (!product.isAvailable) {
                throw new Error(`Product ${product.name} is not available`);
            }
            const itemPrice = parseFloat(product.price);
            const itemTotal = itemPrice * item.quantity;
            total += itemTotal;
            orderItemsData.push({
                productId: item.productId,
                quantity: item.quantity,
                price: itemPrice.toString(),
            });
        }
        // Create order
        const newOrder = {
            userId,
            status: 'pending',
            total: total.toString(),
        };
        const [createdOrder] = await database_1.db
            .insert(database_1.schema.orders)
            .values(newOrder)
            .returning();
        // Create order items
        const orderItemsWithOrderId = orderItemsData.map(item => ({
            ...item,
            orderId: createdOrder.id,
        }));
        await database_1.db
            .insert(database_1.schema.orderItems)
            .values(orderItemsWithOrderId);
        // Return complete order with items
        return this.getOrderById(createdOrder.id);
    }
    static async getOrderById(orderId) {
        // Get order
        const [order] = await database_1.db
            .select()
            .from(database_1.schema.orders)
            .where((0, drizzle_orm_1.eq)(database_1.schema.orders.id, orderId))
            .limit(1);
        if (!order) {
            throw new Error('Order not found');
        }
        // Get order items with product details
        const items = await database_1.db
            .select({
            id: database_1.schema.orderItems.id,
            orderId: database_1.schema.orderItems.orderId,
            productId: database_1.schema.orderItems.productId,
            quantity: database_1.schema.orderItems.quantity,
            price: database_1.schema.orderItems.price,
            productName: database_1.schema.products.name,
            productDescription: database_1.schema.products.description,
            productPrice: database_1.schema.products.price,
        })
            .from(database_1.schema.orderItems)
            .leftJoin(database_1.schema.products, (0, drizzle_orm_1.eq)(database_1.schema.orderItems.productId, database_1.schema.products.id))
            .where((0, drizzle_orm_1.eq)(database_1.schema.orderItems.orderId, orderId));
        const orderItems = items.map(item => ({
            id: item.id,
            orderId: item.orderId,
            productId: item.productId,
            quantity: item.quantity,
            price: parseFloat(item.price),
            product: {
                id: item.productId,
                name: item.productName || '',
                description: item.productDescription || '',
                price: parseFloat(item.productPrice || '0'),
            },
        }));
        return {
            id: order.id,
            userId: order.userId,
            status: order.status,
            total: parseFloat(order.total),
            items: orderItems,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
        };
    }
    static async getUserOrders(userId, options = {}) {
        const { page = 1, limit = 10, status, sortBy = 'createdAt', sortOrder = 'desc', } = options;
        // Build query conditions
        const conditions = [(0, drizzle_orm_1.eq)(database_1.schema.orders.userId, userId)];
        if (status) {
            conditions.push((0, drizzle_orm_1.eq)(database_1.schema.orders.status, status));
        }
        const whereClause = (0, drizzle_orm_1.and)(...conditions);
        // Build order by clause
        let orderBy;
        switch (sortBy) {
            case 'total':
                orderBy = sortOrder === 'asc' ? (0, drizzle_orm_1.asc)(database_1.schema.orders.total) : (0, drizzle_orm_1.desc)(database_1.schema.orders.total);
                break;
            case 'status':
                orderBy = sortOrder === 'asc' ? (0, drizzle_orm_1.asc)(database_1.schema.orders.status) : (0, drizzle_orm_1.desc)(database_1.schema.orders.status);
                break;
            case 'createdAt':
            default:
                orderBy = sortOrder === 'asc' ? (0, drizzle_orm_1.asc)(database_1.schema.orders.createdAt) : (0, drizzle_orm_1.desc)(database_1.schema.orders.createdAt);
                break;
        }
        // Get total count
        const countResult = await database_1.db
            .select({ count: database_1.schema.orders.id })
            .from(database_1.schema.orders)
            .where(whereClause);
        const total = countResult.length;
        // Get orders with pagination
        const offset = (page - 1) * limit;
        const orders = await database_1.db
            .select()
            .from(database_1.schema.orders)
            .where(whereClause)
            .orderBy(orderBy)
            .limit(limit)
            .offset(offset);
        // Get items for each order
        const orderResponses = [];
        for (const order of orders) {
            const orderWithItems = await this.getOrderById(order.id);
            orderResponses.push(orderWithItems);
        }
        return {
            orders: orderResponses,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }
    static async getAllOrders(options = {}) {
        const { page = 1, limit = 10, status, sortBy = 'createdAt', sortOrder = 'desc', } = options;
        // Build query conditions
        const conditions = [];
        if (status) {
            conditions.push((0, drizzle_orm_1.eq)(database_1.schema.orders.status, status));
        }
        const whereClause = conditions.length > 0 ? (0, drizzle_orm_1.and)(...conditions) : undefined;
        // Build order by clause
        let orderBy;
        switch (sortBy) {
            case 'total':
                orderBy = sortOrder === 'asc' ? (0, drizzle_orm_1.asc)(database_1.schema.orders.total) : (0, drizzle_orm_1.desc)(database_1.schema.orders.total);
                break;
            case 'status':
                orderBy = sortOrder === 'asc' ? (0, drizzle_orm_1.asc)(database_1.schema.orders.status) : (0, drizzle_orm_1.desc)(database_1.schema.orders.status);
                break;
            case 'createdAt':
            default:
                orderBy = sortOrder === 'asc' ? (0, drizzle_orm_1.asc)(database_1.schema.orders.createdAt) : (0, drizzle_orm_1.desc)(database_1.schema.orders.createdAt);
                break;
        }
        // Get total count
        const countResult = await database_1.db
            .select({ count: database_1.schema.orders.id })
            .from(database_1.schema.orders)
            .where(whereClause);
        const total = countResult.length;
        // Get orders with pagination
        const offset = (page - 1) * limit;
        const orders = await database_1.db
            .select()
            .from(database_1.schema.orders)
            .where(whereClause)
            .orderBy(orderBy)
            .limit(limit)
            .offset(offset);
        // Get items for each order
        const orderResponses = [];
        for (const order of orders) {
            const orderWithItems = await this.getOrderById(order.id);
            orderResponses.push(orderWithItems);
        }
        return {
            orders: orderResponses,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }
    static async updateOrderStatus(orderId, status) {
        const [updatedOrder] = await database_1.db
            .update(database_1.schema.orders)
            .set({
            status,
            updatedAt: new Date(),
        })
            .where((0, drizzle_orm_1.eq)(database_1.schema.orders.id, orderId))
            .returning();
        if (!updatedOrder) {
            throw new Error('Order not found');
        }
        return this.getOrderById(orderId);
    }
    static async cancelOrder(orderId, userId) {
        // If userId is provided, check if order belongs to user
        if (userId) {
            const [order] = await database_1.db
                .select()
                .from(database_1.schema.orders)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(database_1.schema.orders.id, orderId), (0, drizzle_orm_1.eq)(database_1.schema.orders.userId, userId)))
                .limit(1);
            if (!order) {
                throw new Error('Order not found or access denied');
            }
            // Can only cancel pending or in_progress orders
            if (order.status === 'completed' || order.status === 'cancelled') {
                throw new Error('Cannot cancel completed or already cancelled orders');
            }
        }
        return this.updateOrderStatus(orderId, 'cancelled');
    }
    static async getOrderStats(userId) {
        const conditions = userId ? [(0, drizzle_orm_1.eq)(database_1.schema.orders.userId, userId)] : [];
        const whereClause = conditions.length > 0 ? (0, drizzle_orm_1.and)(...conditions) : undefined;
        // Get all orders for stats
        const orders = await database_1.db
            .select()
            .from(database_1.schema.orders)
            .where(whereClause);
        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total), 0);
        const ordersByStatus = orders.reduce((acc, order) => {
            acc[order.status] = (acc[order.status] || 0) + 1;
            return acc;
        }, {});
        return {
            totalOrders,
            totalRevenue,
            ordersByStatus,
        };
    }
}
exports.OrderService = OrderService;
//# sourceMappingURL=orderService.js.map