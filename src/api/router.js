const express = require('express');
const router = express.Router();
const CategoryController = require('../modules/categories/category.controller');
const TransactionController = require('../modules/transactions/transaction.controller');

router.get('/categories', CategoryController.GetAll);
router.get('/categories/:id', CategoryController.GetById);
router.get('/categories/:id/transactions', TransactionController.GetByCategory);
router.post('/categories', CategoryController.Create);
router.put('/categories/:id', CategoryController.Update);
router.delete('/categories/:id', CategoryController.Delete);

router.get('/transactions', TransactionController.GetAll);
router.get('/transactions/:id', TransactionController.GetById);
router.post('/transactions', TransactionController.Create);
router.put('/transactions/:id', TransactionController.Update);
router.delete('/transactions/:id', TransactionController.Delete);

module.exports = router;