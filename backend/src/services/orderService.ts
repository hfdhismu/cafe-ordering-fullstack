import { db, schema } from '../config/database';
import { eq, and, desc, asc } from 'drizzle-orm';
import { NewOrder, NewOrderItem } from '../db/schema';

interface OrderItemRequest {
  productId: string;
  quantity: number;
}

interface OrderResponse {
  id: string;
  userId: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  total: number;
  items: OrderItemResponse[];
  createdAt: Date;
  updatedAt: Date;
}

interface OrderItemResponse {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  product?: {
    id: string;
    name: string;
    description: string;
    price: number;
  };
}

export class OrderService {
  static async createOrder(
    userId: string,
    items: OrderItemRequest[]
  ): Promise<OrderResponse> {
    if (items.length === 0) {
      throw new Error('Order must contain at least one item');
    }

    // Validate products and calculate total
    let total = 0;
    const orderItemsData: Array<{
      productId: string;
      quantity: number;
      price: string;
    }> = [];

    for (const item of items) {
      if (item.quantity <= 0) {
        throw new Error('Quantity must be greater than 0');
      }

      // Get product details
      const [product] = await db
        .select()
        .from(schema.products)
        .where(eq(schema.products.id, item.productId))
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
    const newOrder: NewOrder = {
      userId,
      status: 'pending',
      total: total.toString(),
    };

    const [createdOrder] = await db
      .insert(schema.orders)
      .values(newOrder)
      .returning();

    // Create order items
    const orderItemsWithOrderId = orderItemsData.map(item => ({
      ...item,
      orderId: createdOrder.id,
    }));

    await db
      .insert(schema.orderItems)
      .values(orderItemsWithOrderId);

    // Return complete order with items
    return this.getOrderById(createdOrder.id);
  }

  static async getOrderById(orderId: string): Promise<OrderResponse> {
    // Get order
    const [order] = await db
      .select()
      .from(schema.orders)
      .where(eq(schema.orders.id, orderId))
      .limit(1);

    if (!order) {
      throw new Error('Order not found');
    }

    // Get order items with product details
    const items = await db
      .select({
        id: schema.orderItems.id,
        orderId: schema.orderItems.orderId,
        productId: schema.orderItems.productId,
        quantity: schema.orderItems.quantity,
        price: schema.orderItems.price,
        productName: schema.products.name,
        productDescription: schema.products.description,
        productPrice: schema.products.price,
      })
      .from(schema.orderItems)
      .leftJoin(schema.products, eq(schema.orderItems.productId, schema.products.id))
      .where(eq(schema.orderItems.orderId, orderId));

    const orderItems: OrderItemResponse[] = items.map(item => ({
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

  static async getUserOrders(
    userId: string,
    options: {
      page?: number;
      limit?: number;
      status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
      sortBy?: 'createdAt' | 'total' | 'status';
      sortOrder?: 'asc' | 'desc';
    } = {}
  ): Promise<{ orders: OrderResponse[]; total: number; page: number; totalPages: number }> {
    const {
      page = 1,
      limit = 10,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = options;

    // Build query conditions
    const conditions = [eq(schema.orders.userId, userId)];

    if (status) {
      conditions.push(eq(schema.orders.status, status));
    }

    const whereClause = and(...conditions);

    // Build order by clause
    let orderBy;
    switch (sortBy) {
      case 'total':
        orderBy = sortOrder === 'asc' ? asc(schema.orders.total) : desc(schema.orders.total);
        break;
      case 'status':
        orderBy = sortOrder === 'asc' ? asc(schema.orders.status) : desc(schema.orders.status);
        break;
      case 'createdAt':
      default:
        orderBy = sortOrder === 'asc' ? asc(schema.orders.createdAt) : desc(schema.orders.createdAt);
        break;
    }

    // Get total count
    const countResult = await db
      .select({ count: schema.orders.id })
      .from(schema.orders)
      .where(whereClause);

    const total = countResult.length;

    // Get orders with pagination
    const offset = (page - 1) * limit;
    const orders = await db
      .select()
      .from(schema.orders)
      .where(whereClause)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    // Get items for each order
    const orderResponses: OrderResponse[] = [];
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

  static async getAllOrders(
    options: {
      page?: number;
      limit?: number;
      status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
      sortBy?: 'createdAt' | 'total' | 'status';
      sortOrder?: 'asc' | 'desc';
    } = {}
  ): Promise<{ orders: OrderResponse[]; total: number; page: number; totalPages: number }> {
    const {
      page = 1,
      limit = 10,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = options;

    // Build query conditions
    const conditions = [];

    if (status) {
      conditions.push(eq(schema.orders.status, status));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Build order by clause
    let orderBy;
    switch (sortBy) {
      case 'total':
        orderBy = sortOrder === 'asc' ? asc(schema.orders.total) : desc(schema.orders.total);
        break;
      case 'status':
        orderBy = sortOrder === 'asc' ? asc(schema.orders.status) : desc(schema.orders.status);
        break;
      case 'createdAt':
      default:
        orderBy = sortOrder === 'asc' ? asc(schema.orders.createdAt) : desc(schema.orders.createdAt);
        break;
    }

    // Get total count
    const countResult = await db
      .select({ count: schema.orders.id })
      .from(schema.orders)
      .where(whereClause);

    const total = countResult.length;

    // Get orders with pagination
    const offset = (page - 1) * limit;
    const orders = await db
      .select()
      .from(schema.orders)
      .where(whereClause)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    // Get items for each order
    const orderResponses: OrderResponse[] = [];
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

  static async updateOrderStatus(
    orderId: string,
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  ): Promise<OrderResponse> {
    const [updatedOrder] = await db
      .update(schema.orders)
      .set({
        status,
        updatedAt: new Date(),
      })
      .where(eq(schema.orders.id, orderId))
      .returning();

    if (!updatedOrder) {
      throw new Error('Order not found');
    }

    return this.getOrderById(orderId);
  }

  static async cancelOrder(orderId: string, userId?: string): Promise<OrderResponse> {
    // If userId is provided, check if order belongs to user
    if (userId) {
      const [order] = await db
        .select()
        .from(schema.orders)
        .where(and(eq(schema.orders.id, orderId), eq(schema.orders.userId, userId)))
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

  static async getOrderStats(userId?: string): Promise<{
    totalOrders: number;
    totalRevenue: number;
    ordersByStatus: Record<string, number>;
  }> {
    const conditions = userId ? [eq(schema.orders.userId, userId)] : [];
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Get all orders for stats
    const orders = await db
      .select()
      .from(schema.orders)
      .where(whereClause);

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total), 0);

    const ordersByStatus = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalOrders,
      totalRevenue,
      ordersByStatus,
    };
  }
}