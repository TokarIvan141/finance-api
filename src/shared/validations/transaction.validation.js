const Joi = require('joi');

const createTransaction = {
    body: Joi.object().keys({
        categoryId: Joi.string().uuid().required(),
        amount: Joi.number().positive().precision(2).required(),
        type: Joi.string().valid('income', 'expense').required(),
        date: Joi.date().iso().required(),
        description: Joi.string().allow('').max(500).optional()
    })
};

const updateTransaction = {
    params: Joi.object().keys({
        id: Joi.string().uuid().required()
    }),
    body: Joi.object().keys({
        categoryId: Joi.string().uuid().optional(),
        amount: Joi.number().positive().precision(2).optional(),
        type: Joi.string().valid('income', 'expense').optional(),
        date: Joi.date().iso().optional(),
        description: Joi.string().allow('').max(500).optional()
    }).min(1)
};

module.exports = {
    createTransaction,
    updateTransaction
};