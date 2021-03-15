const Joi = require('joi');

const loginSchema = Joi.object({
    email:
        Joi.string()
            .email({ minDomainSegments: 2})
            .required()
            .messages({
                'string.email': `Un email valide doit être saisi.`,
                'string.empty': `Un email valide doit être saisi.`,
                'any.required': `Un email valide doit être saisi.`
            })
    
});

module.exports = loginSchema;