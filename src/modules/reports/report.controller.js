const reportService = require('./report.service');

class ReportController {
    async GetSummary(req, res, next) {
        try {
            // TODO: [AUTH] Заменить на req.user.id
            const userId = "f47ac10b-58cc-4372-a567-0e02b2c3d479";
            const { startDate, endDate } = req.query;

            const summary = await reportService.GetSummary(userId, startDate, endDate);
            res.json(summary);
        } catch (error) {
            next(error);
        }
    }

    async GetByCategory(req, res, next) {
        try {
            // TODO: [AUTH] Заменить на req.user.id
            const userId = "f47ac10b-58cc-4372-a567-0e02b2c3d479";
            const { startDate, endDate, type } = req.query;

            const data = await reportService.GetByCategory(userId, startDate, endDate, type);
            res.json(data);
        } catch (error) {
            next(error);
        }
    }

    async GetTrend(req, res, next) {
        try {
            // TODO: [AUTH] Заменить на req.user.id
            const userId = "f47ac10b-58cc-4372-a567-0e02b2c3d479";
            const { startDate, endDate, interval } = req.query;

            const data = await reportService.GetTrend(userId, startDate, endDate, interval);
            res.json(data);
        } catch (error) {
            next(error);
        }
    }

    async GetBudgetUtilization(req, res, next) {
        try {
            // TODO: [AUTH] Заменить на req.user.id
            const userId = "f47ac10b-58cc-4372-a567-0e02b2c3d479";

            const data = await reportService.GetBudgetUtilization(userId);
            res.json(data);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ReportController();