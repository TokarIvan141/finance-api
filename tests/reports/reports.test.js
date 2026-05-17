const request = require('supertest');
const app = require('../../src/app');
const prisma = require('../../src/shared/database/prisma');

describe('Reports Module Integration Tests', () => {
  let accessToken;
  let userId;

  beforeAll(async () => {
    const testUser = {
      email: 'report-test@example.com',
      password: 'password123',
      name: 'Report Tester',
    };
    await prisma.user.deleteMany({ where: { email: testUser.email } });
    const authRes = await request(app).post('/api/v1/auth/register').send(testUser);
    accessToken = authRes.body.accessToken;
    userId = authRes.body.user.id;
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { id: userId } });
    await prisma.$disconnect();
  });

  it('should return summary report', async () => {
    const res = await request(app)
      .get('/api/v1/reports/summary')
      .set('Cookie', [`accessToken=${accessToken}`]);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('totalIncome');
    expect(res.body).toHaveProperty('totalExpense');
    expect(res.body).toHaveProperty('balance');
  });

  it('should return budget utilization report', async () => {
    const res = await request(app)
      .get('/api/v1/reports/budget-utilization')
      .set('Cookie', [`accessToken=${accessToken}`]);

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
