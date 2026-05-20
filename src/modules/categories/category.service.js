const categoryRepo = require('./category.repository');
const ApiError = require('../../shared/utils/ApiError');

class CategoryService {
    async GetAll(userId, page, limit, search) {
        const pageNumber = parseInt(page, 10) || 1;
        const take = parseInt(limit, 10) || 20;
        const skip = (pageNumber - 1) * take;

        const categories = await categoryRepo.GetAll(userId, skip, take, search);
        const totalItems = await categoryRepo.CountAll(userId, search);
        const totalPages = Math.ceil(totalItems / take);

        return {
            data: categories,
            meta: {
                currentPage: pageNumber,
                itemsPerPage: take,
                totalItems,
                totalPages
            }
        };
    }

    async GetById(id, userId) {
        const category = await categoryRepo.GetById(id, userId);
        if (!category) throw ApiError.NotFound('Category not found');
        return category;
    }

    async Create(userId, name, type, color) {
        return await categoryRepo.Create({ userId, name, type, color });
    }

    async Update(id, userId, name) {
        await this.GetById(id, userId);
        return await categoryRepo.Update(id, { name });
    }

    async Delete(id, userId) {
        await this.GetById(id, userId);
        await categoryRepo.SoftDelete(id);
        return { message: 'Category soft deleted' };
    }
}

module.exports = new CategoryService();