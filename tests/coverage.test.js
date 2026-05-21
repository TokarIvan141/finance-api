const EventEmitter = require('events');

const auditLog = require('../src/api/middlewares/audit.middleware');
const authMiddleware = require('../src/api/middlewares/auth.middleware');
const errorMiddleware = require('../src/api/middlewares/error.middleware');
const ApiError = require('../src/shared/utils/ApiError');
const AuditLog = require('../src/models/nosql/AuditLog');
const UserSetting = require('../src/models/nosql/UserSetting');
const prisma = require('../src/shared/database/prisma');

const authService = require('../src/modules/auth/auth.service');
const budgetRepo = require('../src/modules/budgets/budget.repository');
const budgetService = require('../src/modules/budgets/budget.service');
const categoryController = require('../src/modules/categories/category.controller');
const categoryRepo = require('../src/modules/categories/category.repository');
const categoryService = require('../src/modules/categories/category.service');
const exportService = require('../src/modules/export/export.service');
const logController = require('../src/modules/logs/log.controller');
const logRepo = require('../src/modules/logs/log.repository');
const logService = require('../src/modules/logs/log.service');
const reportRepo = require('../src/modules/reports/report.repository');
const reportService = require('../src/modules/reports/report.service');
const settingRepo = require('../src/modules/settings/setting.repository');
const transactionController = require('../src/modules/transactions/transaction.controller');
const transactionRepo = require('../src/modules/transactions/transaction.repository');
const transactionService = require('../src/modules/transactions/transaction.service');

const dummyId = '00000000-0000-0000-0000-000000000000';

const createMockRes = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
};

describe('Coverage edge cases', () => {
  const emails = [];

  afterAll(async () => {
    if (emails.length > 0) {
      await prisma.user.deleteMany({ where: { email: { in: emails } } });
    }
    await AuditLog.deleteMany({ userId: /^coverage-/ });
    await UserSetting.deleteMany({ userId: /^coverage-/ });
    await prisma.$disconnect();
  });

  describe('middleware branches', () => {
    it('covers audit log async and sync error paths', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      jest.spyOn(AuditLog, 'create').mockRejectedValueOnce(new Error('create failed'));

      const res = new EventEmitter();
      res.statusCode = 201;
      const next = jest.fn();

      await auditLog('COVERAGE_ACTION')(
        {
          user: { id: 'coverage-user' },
          method: 'POST',
          originalUrl: '/coverage',
          body: { value: true },
          params: { id: '123' },
        },
        res,
        next
      );
      res.emit('finish');
      await new Promise((resolve) => setImmediate(resolve));

      const throwingReq = {
        user: null,
        method: 'POST',
        originalUrl: '/coverage',
        params: {},
      };
      Object.defineProperty(throwingReq, 'body', {
        get() {
          throw new Error('sync failed');
        },
      });

      const throwingRes = new EventEmitter();
      throwingRes.statusCode = 200;
      await auditLog('COVERAGE_ACTION')(throwingReq, throwingRes, jest.fn());
      throwingRes.emit('finish');

      expect(next).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalled();
    });

    it('covers auth middleware exception handling', () => {
      jest.spyOn(authService, 'validateAccessToken').mockImplementationOnce(() => {
        throw new Error('boom');
      });

      const next = jest.fn();
      authMiddleware({ cookies: { accessToken: 'token' } }, {}, next);

      expect(next).toHaveBeenCalledWith(expect.objectContaining({ status: 401 }));
    });

    it('covers direct error middleware branches', () => {
      const run = (err) => {
        const res = createMockRes();
        errorMiddleware(err, { method: 'GET', url: '/coverage' }, res, jest.fn());
        return res;
      };

      const duplicateWithTarget = new Error('duplicate');
      duplicateWithTarget.code = 'P2002';
      duplicateWithTarget.meta = { target: 'email' };
      expect(run(duplicateWithTarget).status).toHaveBeenCalledWith(400);

      const duplicateWithoutTarget = new Error('duplicate');
      duplicateWithoutTarget.code = 'P2002';
      expect(run(duplicateWithoutTarget).status).toHaveBeenCalledWith(400);

      const missing = new Error('missing');
      missing.code = 'P2025';
      expect(run(missing).status).toHaveBeenCalledWith(404);

      const unknownPrisma = new Error('unknown');
      unknownPrisma.code = 'P2999';
      expect(run(unknownPrisma).status).toHaveBeenCalledWith(400);

      expect(run({ name: 'ValidationError', message: '' }).status).toHaveBeenCalledWith(400);
      expect(run({ name: 'PrismaClientValidationError', message: '' }).status).toHaveBeenCalledWith(
        400
      );
      expect(run(new Error('Argument x is invalid')).status).toHaveBeenCalledWith(400);
      expect(run(new Error('Invalid Date')).status).toHaveBeenCalledWith(400);

      const generic = run(new Error('generic'));
      expect(generic.status).toHaveBeenCalledWith(500);

      const previousEnv = process.env.NODE_ENV;
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      process.env.NODE_ENV = 'development';
      const devError = run(new Error('dev generic'));
      process.env.NODE_ENV = previousEnv;
      expect(devError.json.mock.calls[0][0].error).toBe('dev generic');
      expect(consoleSpy).toHaveBeenCalled();
    });
  });

  describe('service and repository branches', () => {
    it('covers auth and ApiError edge branches', async () => {
      const refreshToken = authService.generateTokens({
        id: dummyId,
        email: 'missing@example.com',
      }).refreshToken;

      await expect(authService.refresh(refreshToken)).rejects.toMatchObject({ status: 401 });
      await expect(authService.getUserData(dummyId)).rejects.toMatchObject({ status: 404 });

      expect(ApiError.Unauthorized('explicit').message).toBe('explicit');
      expect(ApiError.Forbidden().message).toBe('Forbidden');
      expect(ApiError.Forbidden('no').status).toBe(403);
      expect(ApiError.Internal('server').status).toBe(500);
    });

    it('covers repository methods not exposed by integration routes', async () => {
      await budgetRepo.GetAll(dummyId, 0, 10);
      await budgetRepo.CountAll(dummyId);
      await budgetRepo.GetById(dummyId, dummyId);
      await expect(budgetService.GetByCategoryId(dummyId, dummyId)).rejects.toMatchObject({
        status: 404,
      });

      await categoryRepo.GetAll(dummyId, 0, 10, 'missing');
      await categoryRepo.CountAll(dummyId, 'missing');
      await categoryService.GetAll(dummyId);
    });

    it('covers controller success branches through mocked services', async () => {
      const categoryServiceModule = require('../src/modules/categories/category.service');
      const transactionServiceModule = require('../src/modules/transactions/transaction.service');

      jest
        .spyOn(categoryServiceModule, 'GetById')
        .mockResolvedValueOnce({ id: 'category-id', name: 'Mocked' });
      const categoryRes = { json: jest.fn() };
      await categoryController.GetById(
        { user: { id: 'user-id' }, params: { id: 'category-id' } },
        categoryRes,
        jest.fn()
      );
      expect(categoryRes.json).toHaveBeenCalledWith({ id: 'category-id', name: 'Mocked' });

      jest
        .spyOn(transactionServiceModule, 'GetById')
        .mockResolvedValueOnce({ id: 'transaction-id' });
      const transactionRes = { json: jest.fn() };
      await transactionController.GetById(
        { user: { id: 'user-id' }, params: { id: 'transaction-id' } },
        transactionRes,
        jest.fn()
      );
      expect(transactionRes.json).toHaveBeenCalledWith({ id: 'transaction-id' });
    });

    it('covers transaction service defaults and repository update branches', async () => {
      const email = `coverage-trans-${Date.now()}@example.com`;
      emails.push(email);
      const user = await prisma.user.create({
        data: { email, password: 'x', name: 'Coverage Transaction' },
      });
      const category = await prisma.category.create({
        data: { userId: user.id, name: 'Coverage Income', type: 'income' },
      });

      await transactionService.GetAll(user.id);
      await transactionService.GetByCategory(category.id, user.id);
      await expect(
        transactionService.Create(user.id, category.id, 0, 'income', '2026-05-20')
      ).rejects.toMatchObject({ status: 400 });

      const transaction = await transactionRepo.CreateWithDetails({
        userId: user.id,
        categoryId: category.id,
        amount: 10,
        type: 'income',
        date: new Date('2026-05-20'),
      });

      await transactionRepo.Update(transaction.id, { amount: 15 }, 'covered');
      await transactionService.Update(transaction.id, user.id, { date: '2026-05-21' });
      await transactionRepo.GetAll(user.id, 0, 10, { type: 'income' });
      await transactionRepo.GetAll(user.id, 0, 10, { search: 'covered' });
    });

    it('covers transaction budget non-exceeded branch', async () => {
      jest.spyOn(budgetRepo, 'GetByCategoryId').mockResolvedValueOnce({ amountLimit: 100 });
      jest.spyOn(transactionRepo, 'GetTotalSpentThisMonth').mockResolvedValueOnce(10);
      jest.spyOn(transactionRepo, 'CreateWithDetails').mockResolvedValueOnce({ id: 'created' });

      await expect(
        transactionService.Create('user-id', 'category-id', 20, 'expense', '2026-05-20')
      ).resolves.toEqual({ id: 'created' });
    });

    it('covers report branches for trends, sorting, and budget utilization', async () => {
      jest.spyOn(reportRepo, 'GetTransactionsForTrend').mockResolvedValueOnce([
        { date: new Date('2026-05-01'), amount: 5, type: 'income' },
        { date: new Date('2026-05-02'), amount: 3, type: 'expense' },
        { date: new Date('2026-05-03'), amount: 2, type: 'other' },
      ]);
      const trend = await reportService.GetTrend('user-id', '2026-05-01', '2026-05-31', 'month');
      expect(trend[0]).toMatchObject({ date: '2026-05', income: 5, expense: 3 });
      expect(() => reportService._getDefaultDates('2026-12-31', '2026-01-01')).toThrow();

      jest.spyOn(reportRepo, 'GetTransactionsForTrend').mockResolvedValueOnce([]);
      await expect(reportService.GetTrend('user-id')).resolves.toEqual([]);

      const email = `coverage-report-${Date.now()}@example.com`;
      emails.push(email);
      const user = await prisma.user.create({
        data: { email, password: 'x', name: 'Coverage Report' },
      });
      const firstCategory = await prisma.category.create({
        data: { userId: user.id, name: 'First', type: 'expense', color: '#111111' },
      });
      const secondCategory = await prisma.category.create({
        data: { userId: user.id, name: 'Second', type: 'expense', color: '#222222' },
      });
      const thirdCategory = await prisma.category.create({
        data: { userId: user.id, name: 'Third', type: 'expense', color: '#333333' },
      });
      await prisma.transaction.createMany({
        data: [
          {
            userId: user.id,
            categoryId: firstCategory.id,
            amount: 20,
            type: 'expense',
            date: new Date(),
          },
          {
            userId: user.id,
            categoryId: secondCategory.id,
            amount: 10,
            type: 'expense',
            date: new Date(),
          },
        ],
      });
      await prisma.budget.createMany({
        data: [
          { userId: user.id, categoryId: firstCategory.id, amountLimit: 100 },
          { userId: user.id, categoryId: secondCategory.id, amountLimit: 0 },
          { userId: user.id, categoryId: thirdCategory.id, amountLimit: 50 },
        ],
      });

      const byCategory = await reportRepo.GetByCategory(
        user.id,
        new Date('2020-01-01'),
        new Date('2030-01-01'),
        'expense'
      );
      expect(byCategory[0].total.toString()).toBe('20');

      const utilization = await reportRepo.GetBudgetUtilization(user.id);
      expect(utilization).toHaveLength(3);
    });

    it('covers export empty and expense formatting branches', async () => {
      jest.spyOn(transactionRepo, 'GetAll').mockResolvedValueOnce([]);
      await expect(exportService.ExportToExcel(dummyId)).rejects.toMatchObject({
        status: 404,
      });

      jest.spyOn(transactionRepo, 'GetAll').mockResolvedValueOnce([]);
      await expect(exportService.ExportToExcel(dummyId, {})).rejects.toMatchObject({
        status: 404,
      });

      jest.spyOn(transactionRepo, 'GetAll').mockResolvedValueOnce([]);
      await expect(exportService.ExportToExcel(dummyId, { type: 'income' })).rejects.toMatchObject({
        status: 404,
      });

      jest.spyOn(transactionRepo, 'GetAll').mockResolvedValueOnce([
        {
          date: '2026-05-20',
          category: null,
          type: 'expense',
          amount: 5,
          detail: null,
        },
      ]);
      await expect(exportService.ExportToExcel(dummyId, {})).resolves.toBeDefined();
    });

    it('covers log and settings branches', async () => {
      jest.spyOn(logService, 'getAllLogs').mockRejectedValueOnce(new Error('all logs failed'));
      const allLogsNext = jest.fn();
      await logController.GetAllLogs({}, { json: jest.fn() }, allLogsNext);
      expect(allLogsNext).toHaveBeenCalled();

      jest.spyOn(logService, 'getUserLogs').mockRejectedValueOnce(new Error('user logs failed'));
      const userLogsNext = jest.fn();
      await logController.GetUserLogs(
        { params: { userId: dummyId } },
        { json: jest.fn() },
        userLogsNext
      );
      expect(userLogsNext).toHaveBeenCalled();

      const createdLog = await logRepo.create({
        userId: 'coverage-log',
        action: 'COVERAGE',
        details: { ok: true },
      });
      expect(createdLog.action).toBe('COVERAGE');

      await settingRepo.GetSettings('coverage-setting');
      const existingSettings = await settingRepo.GetSettings('coverage-setting');
      expect(existingSettings.theme).toBe('light');
    });
  });
});
