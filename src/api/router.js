const express = require('express');
const router = express.Router();
const CategoryController = require('../modules/categories/category.controller');
const TransactionController = require('../modules/transactions/transaction.controller');
const BudgetController = require('../modules/budgets/budget.controller');

router.get('/categories', CategoryController.GetAll);
router.get('/categories/:id', CategoryController.GetById);
router.post('/categories', CategoryController.Create);
router.put('/categories/:id', CategoryController.Update);
router.delete('/categories/:id', CategoryController.Delete);

router.get('/categories/:id/budget', BudgetController.GetByCategoryId);
router.post('/categories/:id/budget', BudgetController.Create);
router.put('/categories/:id/budget', BudgetController.Update);
router.delete('/categories/:id/budget', BudgetController.Delete);


router.get('/categories/:id/transactions', TransactionController.GetByCategory);


router.get('/transactions', TransactionController.GetAll);
router.get('/transactions/:id', TransactionController.GetById);
router.post('/transactions', TransactionController.Create);
router.put('/transactions/:id', TransactionController.Update);
router.delete('/transactions/:id', TransactionController.Delete);

module.exports = router;