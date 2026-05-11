const express = require('express');
const router = express.Router();
const CategoryController = require('../modules/categories/category.controller');

router.get('/categories', CategoryController.GetAll);
router.get('/categories/:id', CategoryController.GetById);
router.post('/categories', CategoryController.Create);
router.put('/categories/:id', CategoryController.Update);
router.delete('/categories/:id', CategoryController.Delete);

module.exports = router;