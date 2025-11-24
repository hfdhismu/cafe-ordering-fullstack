import { Router } from 'express';
import { ProductController } from '../controllers/productController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

export const productRouter = Router();

// Public routes
productRouter.get('/', ProductController.getAllProducts);
productRouter.get('/categories', ProductController.getCategories);
productRouter.get('/:id', ProductController.getProductById);

// Protected routes (admin only)
productRouter.post('/', authenticateToken, requireAdmin, ProductController.createProduct);
productRouter.put('/:id', authenticateToken, requireAdmin, ProductController.updateProduct);
productRouter.delete('/:id', authenticateToken, requireAdmin, ProductController.deleteProduct);
productRouter.patch('/:id/toggle-availability', authenticateToken, requireAdmin, ProductController.toggleProductAvailability);