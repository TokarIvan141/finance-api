const express = require('express');
const router = express.Router();
const CategoryController = require('./category.controller');
const auditLog = require('../../api/middlewares/audit.middleware');
const validate = require('../../api/middlewares/validate.middleware');
const { createCategory, updateCategory } = require('../../shared/validations/category.validation');
const { uuidParam, paginationQuery } = require('../../shared/validations/common.validation');

router.get('/', validate(paginationQuery), CategoryController.GetAll);
router.get('/:id', validate(uuidParam), CategoryController.GetById);
router.post('/', validate(createCategory), auditLog('CREATE_CATEGORY'), CategoryController.Create);
router.put('/:id', validate(updateCategory), auditLog('UPDATE_CATEGORY'), CategoryController.Update);
router.delete('/:id', validate(uuidParam), auditLog('DELETE_CATEGORY'), CategoryController.Delete);

module.exports = router;