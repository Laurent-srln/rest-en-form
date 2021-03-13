const Joi = require('joi');

const UserSchema = Joi.object({
    firstname: 
        Joi.string().
        required()
        .messages({
            'string.base': `Un prénom doit être saisi.`,
            'string.empty': `Un prénom doit être saisi.`,
            'any.required': `Un prénom doit être saisi.`
          }),
    lastname: 
        Joi.string()
        .required()
        .messages({
            'string.base': `Un nom de famille doit être saisi.`,
            'string.empty': `Un nom de famille doit être saisi.`,
            'any.required': `Un nom de famille doit être saisi.`
          }),
    email: 
        Joi.string()
        .email({ minDomainSegments: 2})
        .required()
        .messages({
            'string.email': `Un email valide doit être saisi.`,
            'string.empty': `Un email valide doit être saisi.`,
            'any.required': `Un email valide doit être saisi.`
          }),
    role: 
        Joi.string()
        .valid('COACH', 'MEMBER')
        .required()
        .messages({
            'any.only': `Un rôle 'MEMBER' ou 'COACH' doit être précisé.`,
            'string.empty': `Un rôle 'MEMBER' ou 'COACH' doit être précisé.`,
            'any.required': `Un rôle 'MEMBER' ou 'COACH' doit être précisé.`
          }),
    specialties: 
        Joi.array()
        .items(Joi.number()
        .integer()
        .min(1))
        .messages({
            'number.min': `La spécialité sélectionnée n'existe pas.`,
            'number.base': `Les id de spécialités doivent être des nombres entiers.`,
            'number.integer': `Les id de spécialités doivent être des nombres entiers.`,
            'array.base': `Les id des spécialités doivent être fournis dans un tableau.`
          })
})

module.exports = UserSchema;