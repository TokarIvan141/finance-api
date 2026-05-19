const express = require('express');
const router = express.Router();
const ReportController = require('./report.controller');

router.get('/summary', ReportController.GetSummary);
router.get('/by-category', ReportController.GetByCategory);
router.get('/trend', ReportController.GetTrend);
router.get('/budget-utilization', ReportController.GetBudgetUtilization);

module.exports = router;