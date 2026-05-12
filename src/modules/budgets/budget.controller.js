const budgetService = require('./budget.service');

class BudgetController {
    async GetByCategoryId(req, res, next) {
        try {
            // TODO: [AUTH] Заменить на req.user.id
            const userId = "f47ac10b-58cc-4372-a567-0e02b2c3d479";
            const budget = await budgetService.GetByCategoryId(req.params.id, userId);
            res.json(budget);
        } catch (error) {
            next(error);
        }
    }

    async Create(req, res, next) {
        try {
            // TODO: [AUTH] Заменить на req.user.id
            const userId = "f47ac10b-58cc-4372-a567-0e02b2c3d479";
            const { amountLimit } = req.body;
            const budget = await budgetService.Create(userId, req.params.id, amountLimit);
            res.status(201).json(budget);
        } catch (error) {
            next(error);
        }
    }

    async Update(req, res, next) {
        try {
            // TODO: [AUTH] Заменить на req.user.id
            const userId = "f47ac10b-58cc-4372-a567-0e02b2c3d479";
            const { amountLimit } = req.body;
            const updated = await budgetService.UpdateByCategory(req.params.id, userId, amountLimit);
            res.json(updated);
        } catch (error) {
            next(error);
        }
    }

    async Delete(req, res, next) {
        try {
            // TODO: [AUTH] Заменить на req.user.id
            const userId = "f47ac10b-58cc-4372-a567-0e02b2c3d479";
            const result = await budgetService.DeleteByCategory(req.params.id, userId);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new BudgetController();