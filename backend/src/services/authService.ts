import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db, schema } from '../config/database';
import { eq } from 'drizzle-orm';
import { User, NewUser } from '../types';

export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  static generateToken(user: { id: string; email: string; role: string }): string {
    const jwtSecret = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

    if (!jwtSecret) {
      throw new Error('JWT secret not configured');
    }

    return jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      jwtSecret,
      { expiresIn }
    );
  }

  static async createUser(userData: {
    email: string;
    name: string;
    password: string;
    role?: 'admin' | 'customer';
  }): Promise<Omit<User, 'passwordHash'>> {
    const { email, name, password, role = 'customer' } = userData;

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const passwordHash = await this.hashPassword(password);

    // Create user
    const newUser: NewUser = {
      email,
      name,
      passwordHash,
      role,
    };

    const [createdUser] = await db
      .insert(schema.users)
      .values(newUser)
      .returning();

    // Remove password hash from response
    const { passwordHash: _, ...userWithoutPassword } = createdUser;
    return userWithoutPassword;
  }

  static async authenticateUser(email: string, password: string): Promise<{
    user: Omit<User, 'passwordHash'>;
    token: string;
  }> {
    // Find user by email
    const [user] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, email))
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

  static async getUserById(userId: string): Promise<Omit<User, 'passwordHash'> | null> {
    const [user] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, userId))
      .limit(1);

    if (!user) {
      return null;
    }

    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  static async updateUser(userId: string, updates: {
    name?: string;
    email?: string;
  }): Promise<Omit<User, 'passwordHash'> | null> {
    const [updatedUser] = await db
      .update(schema.users)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(schema.users.id, userId))
      .returning();

    if (!updatedUser) {
      return null;
    }

    const { passwordHash: _, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }
}