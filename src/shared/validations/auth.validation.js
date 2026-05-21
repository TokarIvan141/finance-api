const Joi = require('joi');

const register = {
  body: Joi.object().keys({
    email: Joi.string().trim().lowercase().email().required(),
    password: Joi.string().min(8).pattern(new RegExp('(?=.*[0-9])(?=.*[A-Z])')).required(),
    name: Joi.string().min(2).max(50).required(),
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().trim().lowercase().email().required(),
    password: Joi.string().required(),
  }),
};

module.exports = {
  register,
  login,
};
