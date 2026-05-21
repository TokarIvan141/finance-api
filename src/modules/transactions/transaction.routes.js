const express = require('express');
const router = express.Router();
const TransactionController = require('./transaction.controller');
const auditLog = require('../../api/middlewares/audit.middleware');
const validate = require('../../api/middlewares/validate.middleware');
const {
  createTransaction,
  updateTransaction,
} = require('../../shared/validations/transaction.validation');
const { uuidParam, paginationQuery } = require('../../shared/validations/common.validation');

router.get(
  '/categories/:id',
  validate(uuidParam),
  validate(paginationQuery),
  TransactionController.GetByCategory
);
router.get('/', validate(paginationQuery), TransactionController.GetAll);
router.get('/:id', validate(uuidParam), TransactionController.GetById);
router.post(
  '/',
  validate(createTransaction),
  auditLog('CREATE_TRANSACTION'),
  TransactionController.Create
);
router.put(
  '/:id',
  validate(updateTransaction),
  auditLog('UPDATE_TRANSACTION'),
  TransactionController.Update
);
router.delete(
  '/:id',
  validate(uuidParam),
  auditLog('DELETE_TRANSACTION'),
  TransactionController.Delete
);

module.exports = router;
