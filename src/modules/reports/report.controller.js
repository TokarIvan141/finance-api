const reportService = require('./report.service');
const catchAsync = require('../../shared/utils/catchAsync');

class ReportController {
    GetSummary = catchAsync(async (req, res, next) => {
        const userId = req.user.id;
        const { startDate, endDate } = req.query;
        const summary = await reportService.GetSummary(userId, startDate, endDate);
        return res.json(summary);
    });

    GetByCategory = catchAsync(async (req, res, next) => {
        const userId = req.user.id;
        const { startDate, endDate, type } = req.query;
        const data = await reportService.GetByCategory(userId, startDate, endDate, type);
        return res.json(data);
    });

    GetTrend = catchAsync(async (req, res, next) => {
        const userId = req.user.id;
        const { startDate, endDate, interval } = req.query;
        const data = await reportService.GetTrend(userId, startDate, endDate, interval);
        return res.json(data);
    });

    GetBudgetUtilization = catchAsync(async (req, res, next) => {
        const userId = req.user.id;
        const data = await reportService.GetBudgetUtilization(userId);
        return res.json(data);
    });
}

module.exports = new ReportController();