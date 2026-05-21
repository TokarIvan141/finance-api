const exportService = require('./export.service');
const catchAsync = require('../../shared/utils/catchAsync');

class ExportController {
  DownloadExcel = catchAsync(async (req, res, _next) => {
    const userId = req.user.id;
    const { type, categoryId, startDate, endDate, search } = req.query;

    const buffer = await exportService.ExportToExcel(userId, {
      type,
      categoryId,
      startDate,
      endDate,
      search,
    });
    const filename = `Finance_Report_${new Date().toISOString().split('T')[0]}.xlsx`;

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

    return res.send(buffer);
  });
}

module.exports = new ExportController();
