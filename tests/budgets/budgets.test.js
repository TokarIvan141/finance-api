const request = require('supertest');
const app = require('../../src/app');
const prisma = require('../../src/shared/database/prisma');

describe('Budgets Module Integration Tests', () => {
  let accessToken;
  let userId;
  let categoryId;

  const testUser = {
    email: 'budget-test@example.com',
    password: 'password123',
    name: 'Budget Tester',
  };

  beforeAll(async () => {
    await prisma.user.deleteMany({ where: { email: testUser.email } });
    const authRes = await request(app).post('/api/v1/auth/register').send(testUser);
    accessToken = authRes.body.accessToken;
    userId = authRes.body.user.id;

    const catRes = await request(app)
      .post('/api/v1/categories')
      .set('Cookie', [`accessToken=${accessToken}`])
      .send({ name: 'Entertainment', type: 'expense' });
    categoryId = catRes.body.id;
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { id: userId } });
    await prisma.$disconnect();
  });

  describe('POST /api/v1/categories/:id/budget', () => {
    it('should create a budget for a category', async () => {
      const budgetData = { amountLimit: 500 };

      const res = await request(app)
        .post(`/api/v1/categories/${categoryId}/budget`)
        .set('Cookie', [`accessToken=${accessToken}`])
        .send(budgetData);

      expect(res.statusCode).toEqual(201);
      expect(res.body.amountLimit.toString()).toEqual('500');
    });

    it('should fail if budget already exists', async () => {
      const res = await request(app)
        .post(`/api/v1/categories/${categoryId}/budget`)
        .set('Cookie', [`accessToken=${accessToken}`])
        .send({ amountLimit: 1000 });

      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toContain('already exists');
    });
  });

  describe('GET /api/v1/categories/:id/budget', () => {
    it('should return budget for a category', async () => {
      const res = await request(app)
        .get(`/api/v1/categories/${categoryId}/budget`)
        .set('Cookie', [`accessToken=${accessToken}`]);

      expect(res.statusCode).toEqual(200);
      expect(res.body.amountLimit.toString()).toEqual('500');
    });
  });
});
