const reportService = require('./report.service');

class ReportController {
    async GetSummary(req, res, next) {
        try {
            const userId = req.user.id;
            const { startDate, endDate } = req.query;

            const summary = await reportService.GetSummary(userId, startDate, endDate);
            res.json(summary);
        } catch (error) {
            next(error);
        }
    }

    async GetByCategory(req, res, next) {
        try {
            const userId = req.user.id;
            const { startDate, endDate, type } = req.query;

            const data = await reportService.GetByCategory(userId, startDate, endDate, type);
            res.json(data);
        } catch (error) {
            next(error);
        }
    }

    async GetTrend(req, res, next) {
        try {
            const userId = req.user.id;
            const { startDate, endDate, interval } = req.query;

            const data = await reportService.GetTrend(userId, startDate, endDate, interval);
            res.json(data);
        } catch (error) {
            next(error);
        }
    }

    async GetBudgetUtilization(req, res, next) {
        try {
            const userId = req.user.id;

            const data = await reportService.GetBudgetUtilization(userId);
            res.json(data);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ReportController();