const Joi = require('joi');

const UserSchema = Joi.object({
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    email: Joi.string().email({ minDomainSegments: 2}).required(),
    role: Joi.string().valid('COACH', 'MEMBER').required(),
    specialties: Joi.array().items(Joi.number().integer().min(1))
})

module.exports = UserSchema;