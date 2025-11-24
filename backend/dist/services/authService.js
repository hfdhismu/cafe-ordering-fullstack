"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = require("../config/database");
const drizzle_orm_1 = require("drizzle-orm");
class AuthService {
    static async hashPassword(password) {
        const saltRounds = 12;
        return bcryptjs_1.default.hash(password, saltRounds);
    }
    static async comparePassword(password, hash) {
        return bcryptjs_1.default.compare(password, hash);
    }
    static generateToken(user) {
        const jwtSecret = process.env.JWT_SECRET;
        const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
        if (!jwtSecret) {
            throw new Error('JWT secret not configured');
        }
        return jsonwebtoken_1.default.sign({
            userId: user.id,
            email: user.email,
            role: user.role,
        }, jwtSecret, { expiresIn });
    }
    static async createUser(userData) {
        const { email, name, password, role = 'customer' } = userData;
        // Check if user already exists
        const existingUser = await database_1.db
            .select()
            .from(database_1.schema.users)
            .where((0, drizzle_orm_1.eq)(database_1.schema.users.email, email))
            .limit(1);
        if (existingUser.length > 0) {
            throw new Error('User with this email already exists');
        }
        // Hash password
        const passwordHash = await this.hashPassword(password);
        // Create user
        const newUser = {
            email,
            name,
            passwordHash,
            role,
        };
        const [createdUser] = await database_1.db
            .insert(database_1.schema.users)
            .values(newUser)
            .returning();
        // Remove password hash from response
        const { passwordHash: _, ...userWithoutPassword } = createdUser;
        return userWithoutPassword;
    }
    static async authenticateUser(email, password) {
        // Find user by email
        const [user] = await database_1.db
            .select()
            .from(database_1.schema.users)
            .where((0, drizzle_orm_1.eq)(database_1.schema.users.email, email))
            .limit(1);
        if (!user) {
            throw new Error('Invalid email or password');
        }
        // Verify password
        const isPasswordValid = await this.comparePassword(password, user.passwordHash);
        if (!isPasswordValid) {
            throw new Error('Invalid email or password');
        }
        // Generate token
        const token = this.generateToken({
            id: user.id,
            email: user.email,
            role: user.role,
        });
        // Remove password hash from response
        const { passwordHash: _, ...userWithoutPassword } = user;
        return {
            user: userWithoutPassword,
            token,
        };
    }
    static async getUserById(userId) {
        const [user] = await database_1.db
            .select()
            .from(database_1.schema.users)
            .where((0, drizzle_orm_1.eq)(database_1.schema.users.id, userId))
            .limit(1);
        if (!user) {
            return null;
        }
        const { passwordHash: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    static async updateUser(userId, updates) {
        const [updatedUser] = await database_1.db
            .update(database_1.schema.users)
            .set({
            ...updates,
            updatedAt: new Date(),
        })
            .where((0, drizzle_orm_1.eq)(database_1.schema.users.id, userId))
            .returning();
        if (!updatedUser) {
            return null;
        }
        const { passwordHash: _, ...userWithoutPassword } = updatedUser;
        return userWithoutPassword;
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=authService.js.map