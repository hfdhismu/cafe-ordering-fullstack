import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

export const authRouter = Router();

// Public routes
authRouter.post('/signup', AuthController.signup);
authRouter.post('/login', AuthController.login);
authRouter.post('/logout', AuthController.logout);

// Protected routes
authRouter.get('/profile', authenticateToken, AuthController.getProfile);
authRouter.put('/profile', authenticateToken, AuthController.updateProfile);