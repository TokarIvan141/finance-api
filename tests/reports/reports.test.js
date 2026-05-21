const request = require('supertest');
const app = require('../../src/app');
const prisma = require('../../src/shared/database/prisma');

describe('Reports Module Integration Tests', () => {
  let accessToken;
  let userId;
  let categoryId;

  const testUser = {
    email: 'reports-final@example.com',
    password: 'Password123',
    name: 'Reports Tester',
  };

  beforeAll(async () => {
    await prisma.user.deleteMany({ where: { email: testUser.email } });
    const authRes = await request(app).post('/api/v1/auth/register').send(testUser);
    accessToken = authRes.body.accessToken;
    userId = authRes.body.user.id;

    const catRes = await request(app)
      .post('/api/v1/categories')
      .set('Cookie', [`accessToken=${accessToken}`])
      .send({ name: 'Food', type: 'expense' });
    categoryId = catRes.body.id;

    await request(app)
      .post('/api/v1/transactions')
      .set('Cookie', [`accessToken=${accessToken}`])
      .send({
        categoryId,
        amount: 50,
        type: 'expense',
        date: new Date().toISOString().split('T')[0],
        description: 'Lunch',
      });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { id: userId } });
    await prisma.$disconnect();
  });

  describe('GET /api/v1/reports/summary', () => {
    it('should return summary report', async () => {
      const res = await request(app)
        .get('/api/v1/reports/summary')
        .set('Cookie', [`accessToken=${accessToken}`]);
      expect(res.statusCode).toEqual(200);
    });
  });

  describe('GET /api/v1/reports/by-category', () => {
    it('should return category report', async () => {
      const res = await request(app)
        .get('/api/v1/reports/by-category')
        .set('Cookie', [`accessToken=${accessToken}`]);
      expect(res.statusCode).toEqual(200);
    });
  });

  describe('GET /api/v1/reports/trend', () => {
    it('should return trend report', async () => {
      const res = await request(app)
        .get('/api/v1/reports/trend?interval=day')
        .set('Cookie', [`accessToken=${accessToken}`]);
      expect(res.statusCode).toEqual(200);
    });
  });

  describe('GET /api/v1/reports/budget-utilization', () => {
    it('should return budget utilization', async () => {
      const res = await request(app)
        .get('/api/v1/reports/budget-utilization')
        .set('Cookie', [`accessToken=${accessToken}`]);
      expect(res.statusCode).toEqual(200);
    });
  });
});
