const Joi = require('joi');

const reportByCategory = {
    query: Joi.object().keys({
        startDate: Joi.date().iso().optional(),
        endDate: Joi.date().iso().min(Joi.ref('startDate')).optional(),
        type: Joi.string().valid('income', 'expense').default('expense')
    }).unknown(true)
};

const reportTrend = {
    query: Joi.object().keys({
        startDate: Joi.date().iso().optional(),
        endDate: Joi.date().iso().min(Joi.ref('startDate')).optional(),
        interval: Joi.string().valid('day', 'month').default('day')
    }).unknown(true)
};

module.exports = {
    reportByCategory,
    reportTrend
};