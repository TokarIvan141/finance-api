const express = require('express');
const router = express.Router();
const CategoryController = require('./category.controller');
const auditLog = require('../../api/middlewares/audit.middleware');

router.get('/', CategoryController.GetAll);
router.get('/:id', CategoryController.GetById);
router.post('/', auditLog('CREATE_CATEGORY'), CategoryController.Create);
router.put('/:id', auditLog('UPDATE_CATEGORY'), CategoryController.Update);
router.delete('/:id', auditLog('DELETE_CATEGORY'), CategoryController.Delete);

module.exports = router;
