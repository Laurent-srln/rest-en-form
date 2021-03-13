const Joi = require('joi');

const specialtySchema = Joi.object({
    name: 
        Joi.string()
        .required()
        .messages({
            'string.base': `Un nom de spécialité doit être saisi.`,
            'string.empty': `Un nom de spécialité doit être saisi.`,
            'any.required': `Un nom de spécialité doit être saisi.`
          })
});

module.exports = specialtySchema;