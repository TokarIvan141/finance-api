const express = require('express');
const router = express.Router();

const authRoutes = require('../modules/auth/auth.routes');
const categoryRoutes = require('../modules/categories/category.routes');
const budgetRoutes = require('../modules/budgets/budget.routes');
const transactionRoutes = require('../modules/transactions/transaction.routes');
const reportRoutes = require('../modules/reports/report.routes');
const exportRoutes = require('../modules/export/export.routes');
const settingRoutes = require('../modules/settings/setting.routes');
const logRoutes = require('../modules/logs/log.routes');

const authMiddleware = require('../../src/api/middlewares/auth.middleware');
router.use('/auth', authRoutes);

router.use(authMiddleware);

router.use('/categories', categoryRoutes);
router.use('/budgets', budgetRoutes);
router.use('/transactions', transactionRoutes);
router.use('/reports', reportRoutes);
router.use('/export', exportRoutes);
router.use('/settings', settingRoutes);
router.use('/', logRoutes);

module.exports = router;
