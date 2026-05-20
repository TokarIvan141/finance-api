const request = require('supertest');
const app = require('../../src/app');
const prisma = require('../../src/shared/database/prisma');

describe('Robustness & Edge Case Tests', () => {
  let accessToken;
  let userId;
  let categoryId;

  const testUser = {
    email: '  Robust-User@Example.Com  ',
    password: 'Password123',
    name: 'Robust Tester',
  };

  beforeAll(async () => {
    // Clean up
    await prisma.user.deleteMany({
      where: { email: { contains: 'robust', mode: 'insensitive' } },
    });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { id: userId } });
    await prisma.$disconnect();
  });

  describe('Auth Normalization (Email Case & Spaces)', () => {
    it('should normalize email on registration and login', async () => {
      // 1. Register with spaces and mixed case
      const regRes = await request(app).post('/api/v1/auth/register').send(testUser);
      expect(regRes.statusCode).toBe(200);
      userId = regRes.body.user.id;
      const normalizedEmail = 'robust-user@example.com';
      expect(regRes.body.user.email).toBe(normalizedEmail);

      // 2. Login with different case and no spaces
      const loginRes = await request(app).post('/api/v1/auth/login').send({
        email: 'ROBUST-USER@example.com',
        password: testUser.password,
      });
      expect(loginRes.statusCode).toBe(200);
      accessToken = loginRes.body.accessToken;
    });

    it('should block Russian email domains', async () => {
      const ruRes = await request(app).post('/api/v1/auth/register').send({
        email: 'attacker@mail.ru',
        password: 'Password123',
        name: 'RU User',
      });
      expect(ruRes.statusCode).toBe(400);
      expect(ruRes.body.message).toContain('не підтримується');

      const suRes = await request(app).post('/api/v1/auth/register').send({
        email: 'attacker@yandex.su',
        password: 'Password123',
        name: 'SU User',
      });
      expect(suRes.statusCode).toBe(400);
    });

    it('should catch common email typos', async () => {
      const typoRes = await request(app).post('/api/v1/auth/register').send({
        email: 'user@gmsil.com',
        password: 'Password123',
        name: 'Typo User',
      });
      expect(typoRes.statusCode).toBe(400);
      expect(typoRes.body.message).toContain('можливо, ви мали на увазі gmail.com');
    });
  });

  describe('Transaction Data Integrity', () => {
    beforeAll(async () => {
      const catRes = await request(app)
        .post('/api/v1/categories')
        .set('Cookie', [`accessToken=${accessToken}`])
        .send({ name: 'Testing', type: 'expense' });
      categoryId = catRes.body.id;
    });

    it('should fail when amount is zero or negative', async () => {
      const negativeRes = await request(app)
        .post('/api/v1/transactions')
        .set('Cookie', [`accessToken=${accessToken}`])
        .send({
          categoryId,
          amount: -50,
          type: 'expense',
          date: '2026-05-20',
        });
      expect(negativeRes.statusCode).toBe(400);

      const zeroRes = await request(app)
        .post('/api/v1/transactions')
        .set('Cookie', [`accessToken=${accessToken}`])
        .send({
          categoryId,
          amount: 0,
          type: 'expense',
          date: '2026-05-20',
        });
      expect(zeroRes.statusCode).toBe(400);
    });

    it('should fail with invalid date format', async () => {
      const res = await request(app)
        .post('/api/v1/transactions')
        .set('Cookie', [`accessToken=${accessToken}`])
        .send({
          categoryId,
          amount: 100,
          type: 'expense',
          date: 'not-a-date',
        });
      expect(res.statusCode).toBe(400);
    });
  });

  describe('Report Date Logic', () => {
    it('should fail when startDate is after endDate', async () => {
      const res = await request(app)
        .get('/api/v1/reports/summary?startDate=2026-12-31&endDate=2026-01-01')
        .set('Cookie', [`accessToken=${accessToken}`]);

      expect(res.statusCode).toBe(400);
    });
  });
});
