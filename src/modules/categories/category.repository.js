const prisma = require('../../shared/database/prisma');

class CategoryRepository {
  async GetAll(userId, skip, take, search) {
    const where = {
      userId: userId,
      deletedAt: null,
    };

    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive',
      };
    }

    return await prisma.category.findMany({
      where: where,
      skip: skip,
      take: take,
      orderBy: { createdAt: 'desc' },
    });
  }

  async CountAll(userId, search) {
    const where = {
      userId: userId,
      deletedAt: null,
    };

    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive',
      };
    }

    return await prisma.category.count({ where: where });
  }

  async GetById(id, userId) {
    return await prisma.category.findFirst({
      where: { id: id, userId: userId, deletedAt: null },
      include: { transactions: true },
    });
  }

  async Create(data) {
    return await prisma.category.create({ data });
  }

  async Update(id, data) {
    return await prisma.category.update({
      where: { id: id },
      data: data,
    });
  }

  async SoftDelete(id) {
    return await prisma.category.update({
      where: { id: id },
      data: { deletedAt: new Date() },
    });
  }
}

module.exports = new CategoryRepository();
