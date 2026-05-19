const transactionRepo = require('../transactions/transaction.repository');
const ExcelJS = require('exceljs');
const ApiError = require('../../shared/utils/ApiError');

class ExportService {
    async ExportToExcel(userId, filters) {
        const transactions = await transactionRepo.GetAll(userId, 0, 100000, filters);

        if (!transactions || transactions.length === 0) {
            const hasActiveFilters = filters && (filters.type || filters.categoryId || filters.startDate || filters.endDate || filters.search);

            if (hasActiveFilters) {
                throw ApiError.NotFound('За вказаними фільтрами транзакцій не знайдено. Спробуйте змінити параметри пошуку');
            } else {
                throw ApiError.NotFound('У вашому профілі ще немає жодної транзакції для формування звіту');
            }
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Фінансовий звіт');

        worksheet.columns = [
            { header: 'Дата', key: 'date', width: 15 },
            { header: 'Категорія', key: 'category', width: 25 },
            { header: 'Тип', key: 'type', width: 15 },
            { header: 'Сума', key: 'amount', width: 15 },
            { header: 'Опис', key: 'description', width: 45 }
        ];

        const headerRow = worksheet.getRow(1);
        headerRow.height = 25;

        headerRow.eachCell((cell) => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF217346' }
            };
            cell.font = {
                name: 'Segoe UI',
                bold: true,
                color: { argb: 'FFFFFFFF' },
                size: 11
            };
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
            cell.border = {
                top: { style: 'thin', color: { argb: 'FF107C41' } },
                left: { style: 'thin', color: { argb: 'FF107C41' } },
                bottom: { style: 'thin', color: { argb: 'FF107C41' } },
                right: { style: 'thin', color: { argb: 'FF107C41' } }
            };
        });

        transactions.forEach(t => {
            const formattedDate = t.date instanceof Date
                ? t.date.toISOString().split('T')[0]
                : new Date(t.date).toISOString().split('T')[0];

            const row = worksheet.addRow({
                date: formattedDate,
                category: t.category ? t.category.name : 'Немає категорії',
                type: t.type === 'income' ? 'Дохід' : 'Витрата',
                amount: Number(t.amount),
                description: t.detail ? t.detail.description : ''
            });

            row.getCell('amount').numFmt = '#,##0.00';

            row.eachCell((cell) => {
                cell.font = { name: 'Segoe UI', size: 10 };
                cell.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
                cell.border = {
                    top: { style: 'thin', color: { argb: 'FFD9D9D9' } },
                    left: { style: 'thin', color: { argb: 'FFD9D9D9' } },
                    bottom: { style: 'thin', color: { argb: 'FFD9D9D9' } },
                    right: { style: 'thin', color: { argb: 'FFD9D9D9' } }
                };
            });

            if (t.type === 'expense') {
                row.getCell('type').font = { color: { argb: 'FF9C0006' }, name: 'Segoe UI' };
            } else {
                row.getCell('type').font = { color: { argb: 'FF006100' }, name: 'Segoe UI' };
            }
        });

        worksheet.autoFilter = 'A1:E1';
        worksheet.views = [{ state: 'frozen', xSplit: 0, ySplit: 1, activePane: 'bottomLeft' }];

        return await workbook.xlsx.writeBuffer();
    }
}

module.exports = new ExportService();