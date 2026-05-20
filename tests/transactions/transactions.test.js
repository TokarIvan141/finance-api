const request = require('supertest');
const app = require('../../src/app');
const prisma = require('../../src/shared/database/prisma');

describe('Transactions Module Integration Tests', () => {
  let accessToken;
  let userId;
  let categoryId;

  const testUser = {
    email: 'trans-test@example.com',
    password: 'Password123',
    name: 'Trans Tester',
  };

  beforeAll(async () => {
    await prisma.user.deleteMany({ where: { email: testUser.email } });
    const authRes = await request(app).post('/api/v1/auth/register').send(testUser);
    accessToken = authRes.body.accessToken;
    userId = authRes.body.user.id;

    const catRes = await request(app)
      .post('/api/v1/categories')
      .set('Cookie', [`accessToken=${accessToken}`])
      .send({ name: 'Salary', type: 'income' });
    categoryId = catRes.body.id;
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { id: userId } });
    await prisma.$disconnect();
  });

  describe('POST /api/v1/transactions', () => {
    it('should create a new transaction with details', async () => {
      const transData = {
        categoryId,
        amount: 1500.5,
        type: 'income',
        date: new Date().toISOString().split('T')[0],
        description: 'Monthly salary bonus',
      };

      const res = await request(app)
        .post('/api/v1/transactions')
        .set('Cookie', [`accessToken=${accessToken}`])
        .send(transData);

      expect(res.statusCode).toEqual(201);
      expect(res.body.amount.toString()).toEqual('1500.5');
      expect(res.body.detail.description).toEqual('Monthly salary bonus');
    });
  });

  describe('GET /api/v1/transactions', () => {
    it('should return paginated transactions', async () => {
      const res = await request(app)
        .get('/api/v1/transactions?page=1&limit=10')
        .set('Cookie', [`accessToken=${accessToken}`]);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('data');
      expect(res.body).toHaveProperty('meta');
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('should filter transactions by date', async () => {
      const res = await request(app)
        .get('/api/v1/transactions?startDate=2026-01-01&endDate=2026-12-31')
        .set('Cookie', [`accessToken=${accessToken}`]);

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should filter transactions by category', async () => {
      const res = await request(app)
        .get(`/api/v1/transactions/categories/${categoryId}`)
        .set('Cookie', [`accessToken=${accessToken}`]);

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('PUT /api/v1/transactions/:id', () => {
    it('should update a transaction', async () => {
      const listRes = await request(app)
        .get('/api/v1/transactions')
        .set('Cookie', [`accessToken=${accessToken}`]);
      const transId = listRes.body.data[0].id;

      const res = await request(app)
        .put(`/api/v1/transactions/${transId}`)
        .set('Cookie', [`accessToken=${accessToken}`])
        .send({ amount: 2000 });

      expect(res.statusCode).toEqual(200);
      expect(res.body.amount.toString()).toEqual('2000');
    });
  });

  describe('DELETE /api/v1/transactions/:id', () => {
    it('should soft delete a transaction', async () => {
      const listRes = await request(app)
        .get('/api/v1/transactions')
        .set('Cookie', [`accessToken=${accessToken}`]);
      const transId = listRes.body.data[0].id;

      const res = await request(app)
        .delete(`/api/v1/transactions/${transId}`)
        .set('Cookie', [`accessToken=${accessToken}`]);

      expect(res.statusCode).toEqual(200);
    });
  });

  describe('Security Check: Accessing other user data', () => {
    let otherToken;
    beforeAll(async () => {
      const otherRes = await request(app).post('/api/v1/auth/register').send({
        email: 'other@example.com',
        password: 'Password123',
        name: 'Other User',
      });
      otherToken = otherRes.body.accessToken;
    });

    afterAll(async () => {
      await prisma.user.deleteMany({ where: { email: 'other@example.com' } });
    });

    it('should not allow user to access another users transaction', async () => {
      const transactions = await prisma.transaction.findMany({ where: { userId } });
      const transId = transactions[0].id;

      const res = await request(app)
        .get(`/api/v1/transactions/${transId}`)
        .set('Cookie', [`accessToken=${otherToken}`]);

      expect(res.statusCode).toEqual(404);
    });
  });

  describe('Budget Limit Logic', () => {
    it('should allow transaction even if budget is exceeded (per current logic)', async () => {
      // 1. Create a category
      const catRes = await request(app)
        .post('/api/v1/categories')
        .set('Cookie', [`accessToken=${accessToken}`])
        .send({ name: 'Limited', type: 'expense' });
      const catId = catRes.body.id;

      // 2. Set a tiny budget
      await request(app)
        .post(`/api/v1/budgets/${catId}/budget`)
        .set('Cookie', [`accessToken=${accessToken}`])
        .send({ amountLimit: 10 });

      // 3. Create a huge transaction
      const res = await request(app)
        .post('/api/v1/transactions')
        .set('Cookie', [`accessToken=${accessToken}`])
        .send({
          categoryId: catId,
          amount: 100,
          type: 'expense',
          date: '2026-05-20',
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toContain('limit exceeded');
    });
  });
});
