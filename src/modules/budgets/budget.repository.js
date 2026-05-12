const prisma = require('../../shared/database/prisma');

class BudgetRepository {
    async GetAll(userId, skip, take) {
        return await prisma.budget.findMany({
            where: { userId },
            include: { category: { select: { name: true, color: true } } },
            skip,
            take,
            orderBy: { createdAt: 'desc' }
        });
    }

    async CountAll(userId) {
        return await prisma.budget.count({
            where: { userId }
        });
    }

    async GetById(id, userId) {
        return await prisma.budget.findFirst({
            where: { id, userId },
            include: { category: true }
        });
    }

    async GetByCategoryId(categoryId, userId) {
        return await prisma.budget.findFirst({
            where: { categoryId, userId }
        });
    }

    async Create(data) {
        return await prisma.budget.create({ data });
    }

    async Update(id, data) {
        return await prisma.budget.update({
            where: { id },
            data
        });
    }

    async Delete(id) {
        return await prisma.budget.delete({
            where: { id }
        });
    }
}

module.exports = new BudgetRepository();