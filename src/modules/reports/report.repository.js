const prisma = require('../../shared/database/prisma');

class ReportRepository {
  async GetSummary(userId, startDate, endDate) {
    const whereClause = {
      userId,
      deletedAt: null,
      date: { gte: new Date(startDate), lte: new Date(endDate) },
    };

    const incomeObj = await prisma.transaction.aggregate({
      where: { ...whereClause, type: 'income' },
      _sum: { amount: true },
    });

    const expenseObj = await prisma.transaction.aggregate({
      where: { ...whereClause, type: 'expense' },
      _sum: { amount: true },
    });

    const totalIncome = incomeObj._sum.amount || 0;
    const totalExpense = expenseObj._sum.amount || 0;

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
    };
  }

  async GetByCategory(userId, startDate, endDate, type) {
    const grouped = await prisma.transaction.groupBy({
      by: ['categoryId'],
      where: {
        userId,
        type,
        deletedAt: null,
        date: { gte: new Date(startDate), lte: new Date(endDate) },
      },
      _sum: { amount: true },
    });

    const categoryIds = grouped.map((g) => g.categoryId).filter((id) => id !== null);
    const categories = await prisma.category.findMany({
      where: { id: { in: categoryIds } },
      select: { id: true, name: true, color: true },
    });

    return grouped
      .map((item) => {
        const category = categories.find((c) => c.id === item.categoryId);
        return {
          categoryId: item.categoryId,
          categoryName: category ? category.name : 'Unknown',
          color: category ? category.color : '#ccc',
          total: item._sum.amount,
        };
      })
      .sort((a, b) => b.total - a.total);
  }

  async GetTransactionsForTrend(userId, startDate, endDate) {
    return await prisma.transaction.findMany({
      where: {
        userId,
        deletedAt: null,
        date: { gte: new Date(startDate), lte: new Date(endDate) },
      },
      select: { date: true, amount: true, type: true },
      orderBy: { date: 'asc' },
    });
  }

  async GetBudgetUtilization(userId) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const budgets = await prisma.budget.findMany({
      where: { userId },
      include: { category: true },
    });

    const utilization = await Promise.all(
      budgets.map(async (budget) => {
        const spentObj = await prisma.transaction.aggregate({
          where: {
            userId,
            categoryId: budget.categoryId,
            type: 'expense',
            deletedAt: null,
            date: { gte: startOfMonth, lte: endOfMonth },
          },
          _sum: { amount: true },
        });

        const spent = spentObj._sum.amount || 0;
        const limit = Number(budget.amountLimit);
        const percentage = limit > 0 ? (spent / limit) * 100 : 0;

        return {
          categoryId: budget.categoryId,
          categoryName: budget.category.name,
          color: budget.category.color,
          limit: limit,
          spent: spent,
          remaining: limit - spent,
          percentage: Math.min(percentage, 100).toFixed(2),
        };
      })
    );

    return utilization;
  }
}

module.exports = new ReportRepository();
