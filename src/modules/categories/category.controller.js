const categoryService = require('./category.service');
const catchAsync = require('../../shared/utils/catchAsync');

class CategoryController {
  GetAll = catchAsync(async (req, res, _next) => {
    const userId = req.user.id;
    const { page = 1, limit = 20, search } = req.query;
    const result = await categoryService.GetAll(userId, page, limit, search);
    return res.json(result);
  });

  GetById = catchAsync(async (req, res, _next) => {
    const userId = req.user.id;
    const categoryId = req.params.id;
    const category = await categoryService.GetById(categoryId, userId);
    return res.json(category);
  });

  Create = catchAsync(async (req, res, _next) => {
    const userId = req.user.id;
    const { name, type, color } = req.body;
    const category = await categoryService.Create(userId, name, type, color);
    return res.status(201).json(category);
  });

  Update = catchAsync(async (req, res, _next) => {
    const userId = req.user.id;
    const categoryId = req.params.id;
    const { name } = req.body;
    const updatedCategory = await categoryService.Update(categoryId, userId, name);
    return res.json(updatedCategory);
  });

  Delete = catchAsync(async (req, res, _next) => {
    const userId = req.user.id;
    const categoryId = req.params.id;
    const result = await categoryService.Delete(categoryId, userId);
    return res.json(result);
  });
}

module.exports = new CategoryController();
