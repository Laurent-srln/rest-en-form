const Joi = require('joi');

const workoutSchema = Joi.object({
    date: 
        Joi.date()
        .max('now')
        .required()
        .messages({
            'date.max': `L'enregistrement d'un entrainement pour une date future n'est pas autorisé.`,
            'date.base': `Une date valide doit être saisie.`,
            'any.required': `Une date valide doit être saisie..`
          }),
    content: 
        Joi.string()
        .allow(''),
    weight: 
        Joi.number()
        .integer()
        .min(20)
        .max(300)
        .required()
        .messages({
            'number.min': `Le poids doit être supérieur à 20kg.`,
            'number.max': `Le poids doit être inférieur à 300kg.`,
            'number.base': `Le poids doit être un nombre entier.`,
            'number.integer': `Le poids doit être un nombre entier.`,
            'any.required': `Un poids doit être saisi.`
          }),
    muscleMass: 
        Joi.number()
        .integer()
        .min(1)
        .max(100)
        .valid(Joi.expression("{100 - number(fatMass) - number(boneMass)}"))
        .required()
        .messages({
            'number.min': `Le pourcentage de masse musculaire doit être compris entre 0% et 100%.`,
            'number.max': `Le pourcentage de masse musculaire doit être compris entre 0% et 100%.`,
            'number.base': `Le pourcentage de masse musculaire doit être un nombre entier.`,
            'number.integer': `Le pourcentage de masse musculaire doit être un nombre entier.`,
            'any.required': `Le pourcentage de masse musculaire doit être saisi.`,
            'any.only': `La somme des pourcentages de masse musculaire, grasse et osseuse doit être égale à 100.`
          }),
    fatMass: 
        Joi.number()
        .integer()
        .min(0)
        .max(100)
        .required()
        .messages({
            'number.min': `Le pourcentage de masse grasse doit être compris entre 0% et 100%.`,
            'number.max': `Le pourcentage de masse grasse doit être compris entre 0% et 100%.`,
            'number.base': `Le pourcentage de masse grasse doit être un nombre entier.`,
            'number.integer': `Le pourcentage de masse grasse doit être un nombre entier.`,
            'any.required': `Le pourcentage de masse grasse doit être saisi.`
          }),
    boneMass: 
        Joi.number()
        .integer()
        .min(0)
        .max(100)
        .required()
        .messages({
            'number.min': `Le pourcentage de masse osseuse doit être compris entre 0% et 100%.`,
            'number.max': `Le pourcentage de masse osseuse doit être compris entre 0% et 100%.`,
            'number.base': `Le pourcentage de masse osseuse doit être un nombre entier.`,
            'number.integer': `Le pourcentage de masse osseuse doit être un nombre entier.`,
            'any.required': `Le pourcentage de masse osseuse doit être saisi.`
          }),
    bodyWater: 
        Joi.number()
        .integer()
        .min(0)
        .max(100)
        .required()
        .messages({
            'number.min': `Le pourcentage de masse hydrique doit être compris entre 0% et 100%.`,
            'number.max': `Le pourcentage de masse hydrique doit être compris entre 0% et 100%.`,
            'number.base': `Le pourcentage de masse hydrique doit être un nombre entier.`,
            'number.integer': `Le pourcentage de masse hydrique doit être un nombre entier.`,
            'any.required': `Le pourcentage de masse hydrique doit être saisi.`
          })
});

module.exports = workoutSchema;