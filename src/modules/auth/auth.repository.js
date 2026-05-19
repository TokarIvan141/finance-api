const prisma = require('../../shared/database/prisma');

class AuthRepository {
    async findByEmail(email) {
        return await prisma.user.findUnique({ where: { email } });
    }

    async findById(id) {
        return await prisma.user.findUnique({ where: { id } });
    }

    async create(userData) {
        return await prisma.user.create({ data: userData });
    }
}

module.exports = new AuthRepository();