const request = require('supertest');
const app = require('../../src/app');
const prisma = require('../../src/shared/database/prisma');

describe('Export Module Integration Tests', () => {
  let accessToken;
  let userId;

  const testUser = {
    email: 'export-test@example.com',
    password: 'Password123',
    name: 'Export Tester',
  };

  beforeAll(async () => {
    await prisma.user.deleteMany({ where: { email: testUser.email } });
    const authRes = await request(app).post('/api/v1/auth/register').send(testUser);
    accessToken = authRes.body.accessToken;
    userId = authRes.body.user.id;

    // Create a dummy transaction to export
    const catRes = await request(app)
      .post('/api/v1/categories')
      .set('Cookie', [`accessToken=${accessToken}`])
      .send({ name: 'Salary', type: 'income' });

    await request(app)
      .post('/api/v1/transactions')
      .set('Cookie', [`accessToken=${accessToken}`])
      .send({
        categoryId: catRes.body.id,
        amount: 1000,
        type: 'income',
        date: '2026-05-20',
        description: 'Test export',
      });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { id: userId } });
    await prisma.$disconnect();
  });

  describe('GET /api/v1/export/xlsx', () => {
    it('should export transactions to excel file', async () => {
      const res = await request(app)
        .get('/api/v1/export/xlsx')
        .set('Cookie', [`accessToken=${accessToken}`]);

      expect(res.statusCode).toEqual(200);
      expect(res.headers['content-type']).toContain('spreadsheetml.sheet');
      expect(res.headers['content-disposition']).toContain('Finance_Report');
    });
  });
});
