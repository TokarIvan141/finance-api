const prisma = require('../../shared/database/prisma');

class AuthRepository {
  async findByEmail(email) {
    return await prisma.user.findUnique({ where: { email } });
  }

  async findById(id) {
    return await prisma.user.findUnique({ where: { id } });
  }

  async createUser(email, password, name) {
    return await prisma.user.create({
      data: { email, password, name },
    });
  }
}

module.exports = new AuthRepository();
