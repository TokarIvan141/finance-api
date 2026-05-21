const Joi = require('joi');

const setBudget = {
  params: Joi.object().keys({
    id: Joi.string().uuid().required(),
  }),
  body: Joi.object().keys({
    amountLimit: Joi.number().positive().precision(2).required(),
  }),
};

module.exports = {
  setBudget,
};
