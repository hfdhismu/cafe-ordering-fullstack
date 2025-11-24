import { User } from '../types';
export declare class AuthService {
    static hashPassword(password: string): Promise<string>;
    static comparePassword(password: string, hash: string): Promise<boolean>;
    static generateToken(user: {
        id: string;
        email: string;
        role: string;
    }): string;
    static createUser(userData: {
        email: string;
        name: string;
        password: string;
        role?: 'admin' | 'customer';
    }): Promise<Omit<User, 'passwordHash'>>;
    static authenticateUser(email: string, password: string): Promise<{
        user: Omit<User, 'passwordHash'>;
        token: string;
    }>;
    static getUserById(userId: string): Promise<Omit<User, 'passwordHash'> | null>;
    static updateUser(userId: string, updates: {
        name?: string;
        email?: string;
    }): Promise<Omit<User, 'passwordHash'> | null>;
}
//# sourceMappingURL=authService.d.ts.map