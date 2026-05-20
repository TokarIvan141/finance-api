const express = require('express');
const router = express.Router();
const BudgetController = require('./budget.controller');
const auditLog = require('../../api/middlewares/audit.middleware');
const validate = require('../../api/middlewares/validate.middleware');
const { setBudget } = require('../../shared/validations/budget.validation');
const { uuidParam } = require('../../shared/validations/common.validation');

router.get('/:id/budget', validate(uuidParam), BudgetController.GetByCategoryId);
router.post('/:id/budget', validate(setBudget), auditLog('CREATE_BUDGET'), BudgetController.Create);
router.put('/:id/budget', validate(setBudget), auditLog('UPDATE_BUDGET'), BudgetController.Update);
router.delete('/:id/budget', validate(uuidParam), auditLog('DELETE_BUDGET'), BudgetController.Delete);

module.exports = router;
