import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';
export declare class OrderController {
    static createOrder(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void>;
    static getOrderById(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void>;
    static getUserOrders(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void>;
    static getAllOrders(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void>;
    static updateOrderStatus(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void>;
    static cancelOrder(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void>;
    static getOrderStats(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void>;
    static getCartPreview(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=orderController.d.ts.map