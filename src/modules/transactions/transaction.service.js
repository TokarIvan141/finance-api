const transactionRepo = require('./transaction.repository');
const budgetRepo = require('../budgets/budget.repository');
const ApiError = require('../../shared/utils/ApiError');

class TransactionService {
    async GetAll(userId, page, limit, filters) {
        const skip = (page - 1) * limit;
        const take = parseInt(limit);
        const transactions = await transactionRepo.GetAll(userId, skip, take, filters);
        const totalItems = await transactionRepo.CountAll(userId, filters);
        return this._formatResponse(transactions, totalItems, page, take);
    }

    async GetByCategory(categoryId, userId, page, limit, filters) {
        const skip = (page - 1) * limit;
        const take = parseInt(limit);
        const transactions = await transactionRepo.GetByCategory(categoryId, userId, skip, take, filters);
        const totalItems = await transactionRepo.CountByCategory(categoryId, userId, filters);
        return this._formatResponse(transactions, totalItems, page, take);
    }

    async GetById(id, userId) {
        const transaction = await transactionRepo.GetById(id, userId);
        if (!transaction) throw ApiError.NotFound('Transaction not found');
        return transaction;
    }

    async Create(userId, categoryId, amount, type, date, description) {
        if (type === 'expense') {
            const budget = await budgetRepo.GetByCategoryId(categoryId, userId);

            if (budget) {
                const alreadySpent = await transactionRepo.GetTotalSpentThisMonth(userId, categoryId);
                const totalAfterTransaction = Number(alreadySpent) + Number(amount);

                if (totalAfterTransaction > Number(budget.amountLimit)) {
                    throw ApiError.BadRequest(
                        `Budget limit exceeded. You have already spent ${alreadySpent} this month. Adding ${amount} would result in ${totalAfterTransaction}, which exceeds your limit of ${budget.amountLimit}.`
                    );
                }
            }
        }

        const data = { userId, categoryId, amount, type, date: new Date(date) };
        return await transactionRepo.CreateWithDetails(data, description);
    }

    async Update(id, userId, updateData) {
        const transaction = await this.GetById(id, userId);
        const { description, ...coreData } = updateData;
        if (coreData.date) coreData.date = new Date(coreData.date);
        return await transactionRepo.Update(id, coreData, description);
    }

    async Delete(id, userId) {
        await this.GetById(id, userId);
        await transactionRepo.SoftDelete(id);
        return { message: 'Transaction soft deleted' };
    }

    _formatResponse(data, totalItems, page, take) {
        return {
            data,
            meta: {
                currentPage: parseInt(page),
                itemsPerPage: take,
                totalItems,
                totalPages: Math.ceil(totalItems / take)
            }
        };
    }
}

module.exports = new TransactionService();