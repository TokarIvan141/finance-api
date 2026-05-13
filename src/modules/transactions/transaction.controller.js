const transactionService = require('./transaction.service');

class TransactionController {
    async GetAll(req, res, next) {
        try {
            const userId = req.user.id;
            const { page = 1, limit = 20, type, categoryId, startDate, endDate, search } = req.query;
            const result = await transactionService.GetAll(userId, page, limit, { type, categoryId, startDate, endDate, search });
            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    async GetByCategory(req, res, next) {
        try {
            const userId = req.user.id;
            const categoryId = req.params.id;
            const { page = 1, limit = 20, type, startDate, endDate, search } = req.query;
            const result = await transactionService.GetByCategory(categoryId, userId, page, limit, { type, startDate, endDate, search });
            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    async GetById(req, res, next) {
        try {
            const userId = req.user.id;
            const transaction = await transactionService.GetById(req.params.id, userId);
            res.json(transaction);
        } catch (error) {
            next(error);
        }
    }

    async Create(req, res, next) {
        try {
            const userId = req.user.id;
            const { categoryId, amount, type, date, description } = req.body;
            const transaction = await transactionService.Create(userId, categoryId, amount, type, date, description);
            res.status(201).json(transaction);
        } catch (error) {
            next(error);
        }
    }

    async Update(req, res, next) {
        try {
            const userId = req.user.id;
            const updated = await transactionService.Update(req.params.id, userId, req.body);
            res.json(updated);
        } catch (error) {
            next(error);
        }
    }

    async Delete(req, res, next) {
        try {
            const userId = req.user.id;
            const result = await transactionService.Delete(req.params.id, userId);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new TransactionController();