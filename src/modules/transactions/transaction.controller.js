const transactionService = require('./transaction.service');
const catchAsync = require('../../shared/utils/catchAsync');

class TransactionController {
  GetAll = catchAsync(async (req, res, _next) => {
    const userId = req.user.id;
    const { page = 1, limit = 20, type, categoryId, startDate, endDate, search } = req.query;
    const result = await transactionService.GetAll(userId, page, limit, {
      type,
      categoryId,
      startDate,
      endDate,
      search,
    });
    return res.json(result);
  });

  GetByCategory = catchAsync(async (req, res, _next) => {
    const userId = req.user.id;
    const categoryId = req.params.id;
    const { page = 1, limit = 20, type, startDate, endDate, search } = req.query;
    const result = await transactionService.GetByCategory(categoryId, userId, page, limit, {
      type,
      startDate,
      endDate,
      search,
    });
    return res.json(result);
  });

  GetById = catchAsync(async (req, res, _next) => {
    const userId = req.user.id;
    const transaction = await transactionService.GetById(req.params.id, userId);
    return res.json(transaction);
  });

  Create = catchAsync(async (req, res, _next) => {
    const userId = req.user.id;
    const { categoryId, amount, type, date, description } = req.body;
    const transaction = await transactionService.Create(
      userId,
      categoryId,
      amount,
      type,
      date,
      description
    );
    return res.status(201).json(transaction);
  });

  Update = catchAsync(async (req, res, _next) => {
    const userId = req.user.id;
    const updated = await transactionService.Update(req.params.id, userId, req.body);
    return res.json(updated);
  });

  Delete = catchAsync(async (req, res, _next) => {
    const userId = req.user.id;
    const result = await transactionService.Delete(req.params.id, userId);
    return res.json(result);
  });
}

module.exports = new TransactionController();
