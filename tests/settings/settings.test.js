const request = require('supertest');
const app = require('../../src/app');
const prisma = require('../../src/shared/database/prisma');

describe('Settings Module Integration Tests', () => {
  let accessToken;
  let userId;

  const testUser = {
    email: 'settings-test@example.com',
    password: 'Password123',
    name: 'Settings Tester',
  };

  beforeAll(async () => {
    await prisma.user.deleteMany({ where: { email: testUser.email } });
    const authRes = await request(app).post('/api/v1/auth/register').send(testUser);
    accessToken = authRes.body.accessToken;
    userId = authRes.body.user.id;
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { id: userId } });
    await prisma.$disconnect();
  });

  describe('GET /api/v1/settings', () => {
    it('should return default settings for a new user', async () => {
      const res = await request(app)
        .get('/api/v1/settings')
        .set('Cookie', [`accessToken=${accessToken}`]);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('theme');
    });
  });

  describe('PATCH /api/v1/settings/theme', () => {
    it('should update user theme', async () => {
      const res = await request(app)
        .patch('/api/v1/settings/theme')
        .set('Cookie', [`accessToken=${accessToken}`])
        .send({ theme: 'dark' });

      expect(res.statusCode).toEqual(200);
      expect(res.body.theme).toEqual('dark');
    });
  });
});
