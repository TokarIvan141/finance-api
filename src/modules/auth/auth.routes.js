const express = require('express');
const router = express.Router();
const AuthController = require('./auth.controller');
const authMiddleware = require('../../api/middlewares/auth.middleware');

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/refresh', AuthController.refresh);
router.post('/logout', AuthController.logout);

router.get('/me', authMiddleware, AuthController.me);

module.exports = router;