const express = require('express');
const router = express.Router();
const CategoryController = require('../modules/categories/category.controller');
const TransactionController = require('../modules/transactions/transaction.controller');
const BudgetController = require('../modules/budgets/budget.controller');
const ReportController = require('../modules/reports/report.controller');
const ExportController = require('../modules/export/export.controller');
const SettingController = require('../modules/settings/setting.controller');
const LogController = require('../modules/logs/log.controller');
const auditLog = require('./middlewares/audit.middleware');

router.get('/categories', CategoryController.GetAll);
router.get('/categories/:id', CategoryController.GetById);
router.post('/categories', auditLog('CREATE_CATEGORY'), CategoryController.Create);
router.put('/categories/:id', auditLog('UPDATE_CATEGORY'), CategoryController.Update);
router.delete('/categories/:id', auditLog('DELETE_CATEGORY'), CategoryController.Delete);

router.get('/categories/:id/budget', BudgetController.GetByCategoryId);
router.post('/categories/:id/budget', auditLog('CREATE_BUDGET'), BudgetController.Create);
router.put('/categories/:id/budget', auditLog('UPDATE_BUDGET'), BudgetController.Update);
router.delete('/categories/:id/budget', auditLog('DELETE_BUDGET'), BudgetController.Delete);

router.get('/categories/:id/transactions', TransactionController.GetByCategory);

router.get('/transactions', TransactionController.GetAll);
router.get('/transactions/:id', TransactionController.GetById);
router.post('/transactions', auditLog('CREATE_TRANSACTION'), TransactionController.Create);
router.put('/transactions/:id', auditLog('UPDATE_TRANSACTION'), TransactionController.Update);
router.delete('/transactions/:id', auditLog('DELETE_TRANSACTION'), TransactionController.Delete);

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