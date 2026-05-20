const Joi = require('joi');
const ApiError = require('../../shared/utils/ApiError');

const validate = (schema) => (req, res, next) => {
    const validSchema = Joi.compile(schema);
    const object = {};

    if (schema.params) object.params = req.params;
    if (schema.query) object.query = req.query;
    if (schema.body) object.body = req.body;

    const { value, error } = validSchema.validate(object, { abortEarly: false, stripUnknown: true });

    if (error) {
        const errorMessage = error.details
            .map((details) => details.message.replace(/['"]/g, ''))
            .join(', ');

        return next(ApiError.BadRequest(`Помилка валідації: ${errorMessage}`));
    }

    if (value.params) req.params = value.params;
    if (value.query) req.query = value.query;
    if (value.body) req.body = value.body;

    return next();
};

module.exports = validate;