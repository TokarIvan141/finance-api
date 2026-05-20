const express = require('express');
const router = express.Router();
const TransactionController = require('./transaction.controller');
const auditLog = require('../../api/middlewares/audit.middleware');
const validate = require('../../api/middlewares/validate.middleware');
const { createTransaction, updateTransaction } = require('../../shared/validations/transaction.validation');
const { uuidParam, paginationQuery } = require('../../shared/validations/common.validation');

router.get('/categories/:id/transactions', validate(uuidParam), validate(paginationQuery), TransactionController.GetByCategory);
router.get('/transactions', validate(paginationQuery), TransactionController.GetAll);
router.get('/transactions/:id', validate(uuidParam), TransactionController.GetById);
router.post('/transactions', validate(createTransaction), auditLog('CREATE_TRANSACTION'), TransactionController.Create);
router.put('/transactions/:id', validate(updateTransaction), auditLog('UPDATE_TRANSACTION'), TransactionController.Update);
router.delete('/transactions/:id', validate(uuidParam), auditLog('DELETE_TRANSACTION'), TransactionController.Delete);

module.exports = router;
