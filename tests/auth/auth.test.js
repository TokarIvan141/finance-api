const request = require('supertest');
const app = require('../../src/app');
const prisma = require('../../src/shared/database/prisma');

describe('Auth Module Integration Tests', () => {
  const testUser = {
    email: 'test@example.com',
    password: 'Password123',
    name: 'Test User',
  };

  beforeAll(async () => {
    await prisma.user.deleteMany({
      where: {
        email: testUser.email,
      },
    });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: {
        email: testUser.email,
      },
    });
    await prisma.$disconnect();
  });

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user successfully', async () => {
      const res = await request(app).post('/api/v1/auth/register').send(testUser);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('user');
      expect(res.body.user.email).toEqual(testUser.email);
      expect(res.body).toHaveProperty('accessToken');
      expect(res.headers['set-cookie']).toBeDefined();
    });

    it('should not register a user with an existing email', async () => {
      const res = await request(app).post('/api/v1/auth/register').send(testUser);

      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('вже зареєстрований');
    });

    it('should fail registration with missing fields', async () => {
      const res = await request(app).post('/api/v1/auth/register').send({
        email: 'incomplete@example.com',
      });

      expect(res.statusCode).not.toBe(200);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should login successfully with correct credentials', async () => {
      const res = await request(app).post('/api/v1/auth/login').send({
        email: testUser.email,
        password: testUser.password,
      });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('accessToken');
      expect(res.body.user.email).toEqual(testUser.email);
    });

    it('should fail login with incorrect password', async () => {
      const res = await request(app).post('/api/v1/auth/login').send({
        email: testUser.email,
        password: 'Wrongpassword123',
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toContain('не знайдено або пароль невірний');
    });

    it('should fail login with non-existent email', async () => {
      const res = await request(app).post('/api/v1/auth/login').send({
        email: 'nonexistent@example.com',
        password: 'Password123',
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toContain('не знайдено');
    });
  });

  describe('GET /api/v1/auth/me', () => {
    let accessToken;

    beforeAll(async () => {
      const res = await request(app).post('/api/v1/auth/login').send({
        email: testUser.email,
        password: testUser.password,
      });
      accessToken = res.body.accessToken;
    });

    it('should return user data when authenticated', async () => {
      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Cookie', [`accessToken=${accessToken}`]);

      expect(res.statusCode).toEqual(200);
      expect(res.body.email).toEqual(testUser.email);
    });

    it('should fail when no token is provided', async () => {
      const res = await request(app).get('/api/v1/auth/me');

      expect(res.statusCode).toEqual(401);
    });
  });

  describe('POST /api/v1/auth/logout', () => {
    it('should clear cookies on logout', async () => {
      const res = await request(app).post('/api/v1/auth/logout');

      expect(res.statusCode).toEqual(200);
      const cookies = res.headers['set-cookie'].join(';');
      expect(cookies).toContain('accessToken=;');
      expect(cookies).toContain('refreshToken=;');
    });
  });

  describe('POST /api/v1/auth/refresh', () => {
    it('should refresh tokens using a valid refresh token', async () => {
      const loginRes = await request(app).post('/api/v1/auth/login').send({
        email: testUser.email,
        password: testUser.password,
      });

      const refreshToken = loginRes.headers['set-cookie']
        .find((c) => c.startsWith('refreshToken='))
        .split(';')[0];

      const res = await request(app).post('/api/v1/auth/refresh').set('Cookie', [refreshToken]);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('accessToken');
    });

    it('should fail refresh when token is missing', async () => {
      const res = await request(app).post('/api/v1/auth/refresh');
      expect(res.statusCode).toEqual(401);
    });

    it('should fail refresh with an invalid token', async () => {
      const res = await request(app)
        .post('/api/v1/auth/refresh')
        .set('Cookie', ['refreshToken=invalid-token']);
      expect(res.statusCode).toEqual(401);
    });
  });

  describe('Unauthorized Access', () => {
    it('should fail /me when token is invalid', async () => {
      const res = await request(app).get('/api/v1/auth/me').set('Cookie', ['accessToken=invalid']);
      expect(res.statusCode).toEqual(401);
    });
  });
});
