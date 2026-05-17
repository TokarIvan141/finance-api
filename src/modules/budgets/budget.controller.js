const budgetService = require('./budget.service');

class BudgetController {
  async GetByCategoryId(req, res, next) {
    try {
      const userId = req.user.id;
      const budget = await budgetService.GetByCategoryId(req.params.id, userId);
      res.json(budget);
    } catch (error) {
      next(error);
    }
  }

  async Create(req, res, next) {
    try {
      const userId = req.user.id;
      const { amountLimit } = req.body;
      const budget = await budgetService.Create(userId, req.params.id, amountLimit);
      res.status(201).json(budget);
    } catch (error) {
      next(error);
    }
  }

  async Update(req, res, next) {
    try {
      const userId = req.user.id;
      const { amountLimit } = req.body;
      const updated = await budgetService.UpdateByCategory(req.params.id, userId, amountLimit);
      res.json(updated);
    } catch (error) {
      next(error);
    }
  }

  async Delete(req, res, next) {
    try {
      const userId = req.user.id;
      const result = await budgetService.DeleteByCategory(req.params.id, userId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new BudgetController();
