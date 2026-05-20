const request = require('supertest');
const app = require('../src/app');

describe('System & Middleware Integration Tests', () => {
  let accessToken;

  beforeAll(async () => {
    const email = `system-tests-${Date.now()}@example.com`;
    const authRes = await request(app).post('/api/v1/auth/register').send({
      email,
      password: 'Password123',
      name: 'System Tester',
    });
    accessToken = authRes.body.accessToken;
  });

  describe('Global Routes', () => {
    it('should return 200 for /ping', async () => {
      const res = await request(app).get('/ping');
      expect(res.statusCode).toEqual(200);
    });

    it('should return 404 for non-existent routes', async () => {
      const res = await request(app)
        .get('/api/v1/non-existent')
        .set('Cookie', [`accessToken=${accessToken}`]);

      expect(res.statusCode).toEqual(404);
    });
  });

  describe('Error Middleware', () => {
    it('should handle SyntaxError (invalid JSON)', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .set('Content-Type', 'application/json')
        .send('{"invalid": json}');

      expect(res.statusCode).toEqual(400);
    });

    it('should handle Prisma P2025 (record not found)', async () => {
      const res = await request(app)
        .get('/api/v1/transactions/00000000-0000-0000-0000-000000000000')
        .set('Cookie', [`accessToken=${accessToken}`]);

      expect(res.statusCode).toEqual(404);
    });

    it('should handle Prisma P2003 (foreign key violation)', async () => {
      const res = await request(app)
        .post('/api/v1/transactions')
        .set('Cookie', [`accessToken=${accessToken}`])
        .send({
          categoryId: '00000000-0000-0000-0000-000000000000', // Non-existent category
          amount: 100,
          type: 'expense',
          date: '2026-05-20',
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toContain('зв’язку даних');
    });
  });
});
