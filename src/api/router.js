const express = require('express');
const router = express.Router();

const authRoutes = require('../modules/auth/auth.routes');
const categoryRoutes = require('../modules/categories/category.routes');
const budgetRoutes = require('../modules/budgets/budget.routes');
const transactionRoutes = require('../modules/transactions/transaction.routes');

const ReportController = require('../modules/reports/report.controller');
const ExportController = require('../modules/export/export.controller');
const SettingController = require('../modules/settings/setting.controller');
const LogController = require('../modules/logs/log.controller');

const authMiddleware = require('./middlewares/auth.middleware');
const auditLog = require('./middlewares/audit.middleware');

router.use('/auth', authRoutes);

router.use(authMiddleware);

router.use('/categories', categoryRoutes);
router.use('/categories', budgetRoutes);
router.use('/', transactionRoutes);

router.get('/reports/summary', ReportController.GetSummary);
router.get('/reports/by-category', ReportController.GetByCategory);
router.get('/reports/trend', ReportController.GetTrend);
router.get('/reports/budget-utilization', ReportController.GetBudgetUtilization);
router.get('/export/xlsx', ExportController.DownloadExcel);

router.get('/settings', SettingController.GetSettings);
router.patch('/settings/theme', auditLog('UPDATE_THEME'), SettingController.UpdateTheme);

router.get('/logs', LogController.GetAllLogs);
router.get('/users/:userId/logs', LogController.GetUserLogs);

module.exports = router;