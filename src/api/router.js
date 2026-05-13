const express = require('express');
const router = express.Router();
const CategoryController = require('../modules/categories/category.controller');
const AuthController = require('../modules/auth/auth.controller');
const authMiddleware = require('./middlewares/auth.middleware');

// Authentication routes
router.post('/auth/register', AuthController.register);
router.post('/auth/login', AuthController.login);
router.get('/auth/me', authMiddleware, AuthController.me);
router.post('/auth/refresh', AuthController.refresh);
router.post('/auth/logout', AuthController.logout);

// Category routes
router.get('/categories', authMiddleware, CategoryController.GetAll);
router.get('/categories/:id', authMiddleware, CategoryController.GetById);
router.post('/categories', authMiddleware, CategoryController.Create);
router.put('/categories/:id', authMiddleware, CategoryController.Update);
router.delete('/categories/:id', authMiddleware, CategoryController.Delete);

module.exports = router;
