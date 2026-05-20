const Joi = require('joi');

const uuidParam = {
    params: Joi.object().keys({
        id: Joi.string().uuid().required()
    })
};

const paginationQuery = {
    query: Joi.object().keys({
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).max(100).default(20),
        search: Joi.string().allow('').optional()
    }).unknown(true)
};

const dateRangeQuery = {
    query: Joi.object().keys({
        startDate: Joi.date().iso().optional(),
        endDate: Joi.date().iso().min(Joi.ref('startDate')).optional()
    }).unknown(true)
};

module.exports = {
    uuidParam,
    paginationQuery,
    dateRangeQuery
};