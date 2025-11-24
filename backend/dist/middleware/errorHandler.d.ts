import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';
export declare class AppError extends Error {
    statusCode: number;
    isOperational: boolean;
    constructor(message: string, statusCode: number);
}
export declare const errorHandler: (err: Error | AppError, req: Request, res: Response<ApiResponse>, next: NextFunction) => void;
//# sourceMappingURL=errorHandler.d.ts.map