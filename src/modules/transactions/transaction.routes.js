const express = require('express');
const router = express.Router();
const TransactionController = require('./transaction.controller');
const auditLog = require('../../api/middlewares/audit.middleware');

router.get('/categories/:id/transactions', TransactionController.GetByCategory);
router.get('/transactions', TransactionController.GetAll);
router.get('/transactions/:id', TransactionController.GetById);
router.post('/transactions', auditLog('CREATE_TRANSACTION'), TransactionController.Create);
router.put('/transactions/:id', auditLog('UPDATE_TRANSACTION'), TransactionController.Update);
router.delete('/transactions/:id', auditLog('DELETE_TRANSACTION'), TransactionController.Delete);

module.exports = router;
