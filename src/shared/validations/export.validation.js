const Joi = require('joi');

const exportExcel = {
  query: Joi.object()
    .keys({
      type: Joi.string().valid('income', 'expense').optional(),
      categoryId: Joi.string().uuid().optional(),
      startDate: Joi.date().iso().optional(),
      endDate: Joi.date().iso().min(Joi.ref('startDate')).optional(),
      search: Joi.string().allow('').optional(),
    })
    .unknown(true),
};

module.exports = {
  exportExcel,
};
