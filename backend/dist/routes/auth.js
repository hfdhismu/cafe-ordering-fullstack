"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const auth_1 = require("../middleware/auth");
exports.authRouter = (0, express_1.Router)();
// Public routes
exports.authRouter.post('/signup', authController_1.AuthController.signup);
exports.authRouter.post('/login', authController_1.AuthController.login);
exports.authRouter.post('/logout', authController_1.AuthController.logout);
// Protected routes
exports.authRouter.get('/profile', auth_1.authenticateToken, authController_1.AuthController.getProfile);
exports.authRouter.put('/profile', auth_1.authenticateToken, authController_1.AuthController.updateProfile);
//# sourceMappingURL=auth.js.map