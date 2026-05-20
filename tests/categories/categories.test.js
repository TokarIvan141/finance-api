const request = require('supertest');
const app = require('../../src/app');
const prisma = require('../../src/shared/database/prisma');

describe('Categories Module Integration Tests', () => {
  let accessToken;
  let userId;
  const testUser = {
    email: 'cat-test@example.com',
    password: 'Password123',
    name: 'Cat Tester',
  };

  beforeAll(async () => {
    await prisma.user.deleteMany({ where: { email: testUser.email } });
    const res = await request(app).post('/api/v1/auth/register').send(testUser);
    accessToken = res.body.accessToken;
    userId = res.body.user.id;
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { id: userId } });
    await prisma.$disconnect();
  });

  describe('POST /api/v1/categories', () => {
    it('should create a new category', async () => {
      const categoryData = {
        name: 'Food',
        type: 'expense',
        color: '#ff0000',
      };

      const res = await request(app)
        .post('/api/v1/categories')
        .set('Cookie', [`accessToken=${accessToken}`])
        .send(categoryData);

      expect(res.statusCode).toEqual(201);
      expect(res.body.name).toEqual(categoryData.name);
      expect(res.body.userId).toEqual(userId);
    });
  });

  describe('GET /api/v1/categories', () => {
    it('should return all user categories', async () => {
      const res = await request(app)
        .get('/api/v1/categories')
        .set('Cookie', [`accessToken=${accessToken}`]);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('data');
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.data[0].userId).toEqual(userId);
    });
  });

  describe('PUT /api/v1/categories/:id', () => {
    it('should update an existing category', async () => {
      const categories = await prisma.category.findMany({ where: { userId } });
      const categoryId = categories[0].id;

      const updatedData = { name: 'Groceries' };

      const res = await request(app)
        .put(`/api/v1/categories/${categoryId}`)
        .set('Cookie', [`accessToken=${accessToken}`])
        .send(updatedData);

      expect(res.statusCode).toEqual(200);
      expect(res.body.name).toEqual('Groceries');
    });
  });

  describe('DELETE /api/v1/categories/:id', () => {
    it('should soft delete a category', async () => {
      const categories = await prisma.category.findMany({ where: { userId } });
      const categoryId = categories[0].id;

      const res = await request(app)
        .delete(`/api/v1/categories/${categoryId}`)
        .set('Cookie', [`accessToken=${accessToken}`]);

      expect(res.statusCode).toEqual(200);

      const deletedCategory = await prisma.category.findUnique({ where: { id: categoryId } });
      expect(deletedCategory.deletedAt).not.toBeNull();
    });

    it('should return 404 for non-existent category', async () => {
      const res = await request(app)
        .get('/api/v1/categories/00000000-0000-0000-0000-000000000000')
        .set('Cookie', [`accessToken=${accessToken}`]);
      expect(res.statusCode).toEqual(404);
    });

    it('should fail with invalid category type', async () => {
      const res = await request(app)
        .post('/api/v1/categories')
        .set('Cookie', [`accessToken=${accessToken}`])
        .send({ name: 'Invalid', type: 'invalid-type' });

      expect(res.statusCode).toEqual(400);
    });
  });
});
