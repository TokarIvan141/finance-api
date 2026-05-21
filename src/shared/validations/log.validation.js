const Joi = require('joi');

const userLogs = {
  params: Joi.object().keys({
    userId: Joi.string().uuid().required(),
  }),
  query: Joi.object()
    .keys({
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(20),
    })
    .unknown(true),
};

module.exports = {
  userLogs,
};
