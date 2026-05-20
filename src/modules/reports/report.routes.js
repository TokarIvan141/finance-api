const express = require('express');
const router = express.Router();
const ReportController = require('./report.controller');
const validate = require('../../api/middlewares/validate.middleware');
const { reportByCategory, reportTrend } = require('../../shared/validations/report.validation');
const { dateRangeQuery } = require('../../shared/validations/common.validation');

router.get('/summary', validate(dateRangeQuery), ReportController.GetSummary);
router.get('/by-category', validate(reportByCategory), ReportController.GetByCategory);
router.get('/trend', validate(reportTrend), ReportController.GetTrend);
router.get('/budget-utilization', ReportController.GetBudgetUtilization);

module.exports = router;