"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRouter = void 0;
const express_1 = require("express");
const productController_1 = require("../controllers/productController");
const auth_1 = require("../middleware/auth");
exports.productRouter = (0, express_1.Router)();
// Public routes
exports.productRouter.get('/', productController_1.ProductController.getAllProducts);
exports.productRouter.get('/categories', productController_1.ProductController.getCategories);
exports.productRouter.get('/:id', productController_1.ProductController.getProductById);
// Protected routes (admin only)
exports.productRouter.post('/', auth_1.authenticateToken, auth_1.requireAdmin, productController_1.ProductController.createProduct);
exports.productRouter.put('/:id', auth_1.authenticateToken, auth_1.requireAdmin, productController_1.ProductController.updateProduct);
exports.productRouter.delete('/:id', auth_1.authenticateToken, auth_1.requireAdmin, productController_1.ProductController.deleteProduct);
exports.productRouter.patch('/:id/toggle-availability', auth_1.authenticateToken, auth_1.requireAdmin, productController_1.ProductController.toggleProductAvailability);
//# sourceMappingURL=products.js.map