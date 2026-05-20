const express = require('express');
const router = express.Router();
const AuthController = require('./auth.controller');
const authMiddleware = require('../../api/middlewares/auth.middleware');
const auditLog = require('../../api/middlewares/audit.middleware');

router.post('/register', auditLog('REGISTER'), AuthController.register);
router.post('/login', auditLog('LOGIN'), AuthController.login);
router.post('/refresh', AuthController.refresh);
router.post('/logout', AuthController.logout);

router.get('/me', authMiddleware, AuthController.me);

module.exports = router;
