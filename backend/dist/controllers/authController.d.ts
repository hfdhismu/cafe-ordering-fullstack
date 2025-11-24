import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';
export declare class AuthController {
    static signup(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void>;
    static login(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void>;
    static getProfile(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void>;
    static updateProfile(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void>;
    static logout(req: Request, res: Response<ApiResponse>): Promise<void>;
}
//# sourceMappingURL=authController.d.ts.map