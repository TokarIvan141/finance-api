const budgetRepo = require('./budget.repository');
const ApiError = require('../../shared/utils/ApiError');

class BudgetService {
    async GetByCategoryId(categoryId, userId) {
        const budget = await budgetRepo.GetByCategoryId(categoryId, userId);
        if (!budget) throw ApiError.NotFound('Budget not found for this category');
        return budget;
    }

    async Create(userId, categoryId, amountLimit) {
        const existing = await budgetRepo.GetByCategoryId(categoryId, userId);
        if (existing) throw ApiError.BadRequest('Budget already exists. Use PUT to update.');

        return await budgetRepo.Create({ userId, categoryId, amountLimit });
    }

    async UpdateByCategory(categoryId, userId, amountLimit) {
        const budget = await this.GetByCategoryId(categoryId, userId);
        return await budgetRepo.Update(budget.id, { amountLimit });
    }

    async DeleteByCategory(categoryId, userId) {
        const budget = await this.GetByCategoryId(categoryId, userId);
        await budgetRepo.Delete(budget.id);
        return { message: 'Budget permanently deleted' };
    }
}

module.exports = new BudgetService();