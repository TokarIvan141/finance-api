const express = require('express');
const router = express.Router();
const BudgetController = require('./budget.controller');
const auditLog = require('../../api/middlewares/audit.middleware');

router.get('/:id/budget', BudgetController.GetByCategoryId);
router.post('/:id/budget', auditLog('CREATE_BUDGET'), BudgetController.Create);
router.put('/:id/budget', auditLog('UPDATE_BUDGET'), BudgetController.Update);
router.delete('/:id/budget', auditLog('DELETE_BUDGET'), BudgetController.Delete);

module.exports = router;
