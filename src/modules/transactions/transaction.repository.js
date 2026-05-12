const prisma = require('../../shared/database/prisma');

class TransactionRepository {
    async GetAll(userId, skip, take, filters) {
        const where = this._buildWhereClause(userId, filters);
        return await prisma.transaction.findMany({
            where,
            include: {
                detail: true,
                category: { select: { name: true, color: true } }
            },
            skip,
            take,
            orderBy: { date: 'desc' }
        });
    }

    async CountAll(userId, filters) {
        const where = this._buildWhereClause(userId, filters);
        return await prisma.transaction.count({ where });
    }

    async GetByCategory(categoryId, userId, skip, take, filters) {
        const where = this._buildWhereClause(userId, { ...filters, categoryId });
        return await prisma.transaction.findMany({
            where,
            include: { detail: true },
            skip,
            take,
            orderBy: { date: 'desc' }
        });
    }

    async CountByCategory(categoryId, userId, filters) {
        const where = this._buildWhereClause(userId, { ...filters, categoryId });
        return await prisma.transaction.count({ where });
    }

    async GetById(id, userId) {
        return await prisma.transaction.findFirst({
            where: { id, userId, deletedAt: null },
            include: { detail: true, category: true }
        });
    }

    async CreateWithDetails(data, description) {
        return await prisma.$transaction(async (tx) => {
            const transaction = await tx.transaction.create({ data });
            if (description) {
                await tx.transactionDetail.create({
                    data: { transactionId: transaction.id, description }
                });
            }
            return await tx.transaction.findUnique({
                where: { id: transaction.id },
                include: { detail: true }
            });
        });
    }

    async Update(id, data, description) {
        return await prisma.$transaction(async (tx) => {
            await tx.transaction.update({ where: { id }, data });
            if (description !== undefined) {
                await tx.transactionDetail.upsert({
                    where: { transactionId: id },
                    update: { description },
                    create: { transactionId: id, description }
                });
            }
            return await tx.transaction.findUnique({
                where: { id },
                include: { detail: true }
            });
        });
    }

    async SoftDelete(id) {
        return await prisma.transaction.update({
            where: { id },
            data: { deletedAt: new Date() }
        });
    }

    _buildWhereClause(userId, filters) {
        return {
            userId,
            deletedAt: null,
            ...(filters.type && { type: filters.type }),
            ...(filters.categoryId && { categoryId: filters.categoryId }),
            ...((filters.startDate || filters.endDate) && {
                date: {
                    ...(filters.startDate && { gte: new Date(filters.startDate) }),
                    ...(filters.endDate && { lte: new Date(filters.endDate) })
                }
            }),
            ...(filters.search && {
                detail: {
                    description: { contains: filters.search, mode: 'insensitive' }
                }
            })
        };
    }

    async GetTotalSpentThisMonth(userId, categoryId) {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        const result = await prisma.transaction.aggregate({
            where: {
                userId,
                categoryId,
                type: 'expense',
                deletedAt: null,
                date: {
                    gte: startOfMonth,
                    lte: endOfMonth
                }
            },
            _sum: { amount: true }
        });

        return result._sum.amount || 0;
    }
}

module.exports = new TransactionRepository();