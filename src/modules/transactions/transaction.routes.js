const express = require('express');
const router = express.Router();
const TransactionController = require('./transaction.controller');
const auditLog = require('../../api/middlewares/audit.middleware');

router.get('/categories/:id', TransactionController.GetByCategory);
router.get('/', TransactionController.GetAll);
router.get('/:id', TransactionController.GetById);
router.post('/', auditLog('CREATE_TRANSACTION'), TransactionController.Create);
router.put('/:id', auditLog('UPDATE_TRANSACTION'), TransactionController.Update);
router.delete('/:id', auditLog('DELETE_TRANSACTION'), TransactionController.Delete);

module.exports = router;
