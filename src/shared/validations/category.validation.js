const Joi = require('joi');

const createCategory = {
    body: Joi.object().keys({
        name: Joi.string().min(2).max(50).required(),
        type: Joi.string().valid('income', 'expense').required(),
        color: Joi.string().pattern(/^#([0-9A-F]{3}){1,2}$/i).optional()
    })
};

const updateCategory = {
    params: Joi.object().keys({
        id: Joi.string().uuid().required()
    }),
    body: Joi.object().keys({
        name: Joi.string().min(2).max(50).optional(),
        color: Joi.string().pattern(/^#([0-9A-F]{3}){1,2}$/i).optional()
    }).min(1)
};

module.exports = {
    createCategory,
    updateCategory
};