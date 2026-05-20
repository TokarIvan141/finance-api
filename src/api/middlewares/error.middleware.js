const ApiError = require('../../shared/utils/ApiError');

module.exports = (err, req, res, _next) => {
  if (process.env.NODE_ENV !== 'test' || !err.status || err.status === 500) {
    console.error(`[ERROR] [${req.method}] ${req.url} ->`, err);
  }

  if (err instanceof ApiError) {
    return res.status(err.status).json({
      success: false,
      message: err.message,
    });
  }

  if (err.code && err.code.startsWith('P')) {
    switch (err.code) {
      case 'P2002': {
        const targetField = err.meta?.target ? ` (${err.meta.target})` : '';
        return res.status(400).json({
          success: false,
          message: `Запис із такими даними вже існує${targetField}`,
        });
      }
      case 'P2025':
        return res.status(404).json({
          success: false,
          message: 'Запитуваний запис не знайдено в базі даних',
        });
      case 'P2003':
        return res.status(400).json({
          success: false,
          message: 'Помилка зв’язку даних: вказаний залежний ID не існує',
        });
      default:
        return res.status(400).json({
          success: false,
          message: `Помилка бази даних (Код: ${err.code})`,
        });
    }
  }

  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      message: 'Некоректний синтаксис JSON у запиті',
    });
  }

  if (
    err.name === 'ValidationError' ||
    err.name === 'PrismaClientValidationError' ||
    err.message.includes('Argument') ||
    err.message.includes('Invalid Date')
  ) {
    return res.status(400).json({
      success: false,
      message: 'Передано некоректні дані: перевірте формати дат, чисел та обов’язкові поля',
    });
  }

  return res.status(500).json({
    success: false,
    message: 'Внутрішня помилка сервера',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
};
