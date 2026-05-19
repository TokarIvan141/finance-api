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

  async saveToken(userId, refreshToken) {
    return await prisma.token.upsert({
      where: { userId },
      update: { refreshToken },
      create: { userId, refreshToken },
    });
  }

  async findToken(refreshToken) {
    return await prisma.token.findFirst({
      where: { refreshToken },
    });
  }
}

module.exports = new AuthRepository();
