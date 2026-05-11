const categoryService = require('./category.service');

class CategoryController {
    async GetAll(req, res, next) {
        try {
            // TODO: [AUTH] Заменить на req.user.id
            const userId = "f47ac10b-58cc-4372-a567-0e02b2c3d479";

            const { page = 1, limit = 20, search } = req.query;
            const result = await categoryService.GetAll(userId, page, limit, search);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    async GetById(req, res, next) {
        try {
            // TODO: [AUTH] Заменить на req.user.id
            const userId = "f47ac10b-58cc-4372-a567-0e02b2c3d479";

            const categoryId = req.params.id;
            const category = await categoryService.GetById(categoryId, userId);
            res.json(category);
        } catch (error) {
            next(error);
        }
    }

    async Create(req, res, next) {
        try {
            // TODO: [AUTH] Заменить на req.user.id
            const userId = "f47ac10b-58cc-4372-a567-0e02b2c3d479";

            const { name, type, color } = req.body;
            const category = await categoryService.Create(userId, name, type, color);
            res.status(201).json(category);
        } catch (error) {
            next(error);
        }
    }

    async Update(req, res, next) {
        try {
            // TODO: [AUTH] Заменить на req.user.id
            const userId = "f47ac10b-58cc-4372-a567-0e02b2c3d479";

            const categoryId = req.params.id;
            const { name } = req.body;

            const updatedCategory = await categoryService.Update(categoryId, userId, name);
            res.json(updatedCategory);
        } catch (error) {
            next(error);
        }
    }

    async Delete(req, res, next) {
        try {
            // TODO: [AUTH] Заменить на req.user.id
            const userId = "f47ac10b-58cc-4372-a567-0e02b2c3d479";

            const categoryId = req.params.id;
            const result = await categoryService.Delete(categoryId, userId);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new CategoryController();