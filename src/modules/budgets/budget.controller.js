const budgetService = require('./budget.service');
const catchAsync = require('../../shared/utils/catchAsync');

class BudgetController {
  GetByCategoryId = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const budget = await budgetService.GetByCategoryId(req.params.id, userId);
    return res.json(budget);
  });

  Create = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const { amountLimit } = req.body;
    const budget = await budgetService.Create(userId, req.params.id, amountLimit);
    return res.status(201).json(budget);
  });

  Update = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const { amountLimit } = req.body;
    const updated = await budgetService.UpdateByCategory(req.params.id, userId, amountLimit);
    return res.json(updated);
  });

  Delete = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const result = await budgetService.DeleteByCategory(req.params.id, userId);
    return res.json(result);
  });
}

module.exports = new BudgetController();
