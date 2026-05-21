const reportRepo = require('./report.repository');
const ApiError = require('../../shared/utils/ApiError');

class ReportService {
  _getDefaultDates(startDate, endDate) {
    const now = new Date();
    const start = startDate ? new Date(startDate) : new Date(now.getFullYear(), now.getMonth(), 1);
    const end = endDate ? new Date(endDate) : new Date(now.getFullYear(), now.getMonth() + 1, 0);

    if (start > end) {
      throw ApiError.BadRequest('startDate cannot be greater than endDate');
    }

    return { start, end };
  }

  async GetSummary(userId, startDate, endDate) {
    const { start, end } = this._getDefaultDates(startDate, endDate);
    return await reportRepo.GetSummary(userId, start, end);
  }

  async GetByCategory(userId, startDate, endDate, type = 'expense') {
    const { start, end } = this._getDefaultDates(startDate, endDate);
    return await reportRepo.GetByCategory(userId, start, end, type);
  }

  async GetTrend(userId, startDate, endDate, interval = 'day') {
    const { start, end } = this._getDefaultDates(startDate, endDate);
    const transactions = await reportRepo.GetTransactionsForTrend(userId, start, end);

    const grouped = transactions.reduce((acc, curr) => {
      const dateStr = curr.date.toISOString();
      const key = interval === 'month' ? dateStr.substring(0, 7) : dateStr.substring(0, 10);

      if (!acc[key]) {
        acc[key] = { date: key, income: 0, expense: 0 };
      }

      if (curr.type === 'income') acc[key].income += Number(curr.amount);
      if (curr.type === 'expense') acc[key].expense += Number(curr.amount);

      return acc;
    }, {});

    return Object.values(grouped);
  }

  async GetBudgetUtilization(userId) {
    return await reportRepo.GetBudgetUtilization(userId);
  }
}

module.exports = new ReportService();
