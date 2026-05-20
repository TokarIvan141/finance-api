const Joi = require('joi');

const updateTheme = {
    body: Joi.object().keys({
        theme: Joi.string().valid('light', 'dark').required()
    })
};

module.exports = {
    updateTheme
};