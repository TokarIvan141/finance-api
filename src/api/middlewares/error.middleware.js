const ApiError = require('../../shared/utils/ApiError');

module.exports = (err, req, res, _next) => {
  console.error('Error:', err.message);

  if (err instanceof ApiError) {
    return res.status(err.status).json({
      success: false,
      message: err.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
};
