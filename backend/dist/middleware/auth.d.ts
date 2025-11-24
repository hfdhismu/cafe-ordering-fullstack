import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from '../types';
declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}
export declare const authenticateToken: (req: Request, res: Response, next: NextFunction) => void;
export declare const requireRole: (roles: string | string[]) => (req: Request, res: Response, next: NextFunction) => any;
export declare const requireAdmin: (req: Request, res: Response, next: NextFunction) => any;
export declare const requireCustomer: (req: Request, res: Response, next: NextFunction) => any;
//# sourceMappingURL=auth.d.ts.map