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
export declare class OrderService {
    static createOrder(userId: string, items: OrderItemRequest[]): Promise<OrderResponse>;
    static getOrderById(orderId: string): Promise<OrderResponse>;
    static getUserOrders(userId: string, options?: {
        page?: number;
        limit?: number;
        status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
        sortBy?: 'createdAt' | 'total' | 'status';
        sortOrder?: 'asc' | 'desc';
    }): Promise<{
        orders: OrderResponse[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    static getAllOrders(options?: {
        page?: number;
        limit?: number;
        status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
        sortBy?: 'createdAt' | 'total' | 'status';
        sortOrder?: 'asc' | 'desc';
    }): Promise<{
        orders: OrderResponse[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    static updateOrderStatus(orderId: string, status: 'pending' | 'in_progress' | 'completed' | 'cancelled'): Promise<OrderResponse>;
    static cancelOrder(orderId: string, userId?: string): Promise<OrderResponse>;
    static getOrderStats(userId?: string): Promise<{
        totalOrders: number;
        totalRevenue: number;
        ordersByStatus: Record<string, number>;
    }>;
}
export {};
//# sourceMappingURL=orderService.d.ts.map