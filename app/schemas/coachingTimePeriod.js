const Joi = require('joi');

const coachingTimePeriodSchema = Joi.object({
    date:
        Joi.date()
        .min('now')
        .required()
        .messages({
            'date.min': `La création de créneaux coaching pour une date passée n'est pas permise.`,
            'date.base': `Une date valide doit être saisie.`,
            'any.required': `Une date valide doit être saisie.`
      }),
    start:
        Joi.string()
        .pattern(new RegExp('^([0-9]{2})\:([0-9]{2})$'))
        .required()
        .error(new Error (
          `Des heures de début et de fin doivent être précisées au format '00:00'.`)),
    end:
        Joi.string()
        .pattern(new RegExp('^([0-9]{2})\:([0-9]{2})$'))
        .required()
        .error(new Error (
        `Des heures de début et de fin doivent être précisées au format '00:00'.`)),
    coachId:
        Joi.number()
        .integer()
        .min(1)
        .required()
        .error(new Error (
            `L'id (nombre entier) du coach concerné doit être précisé.`)),

});

module.exports = coachingTimePeriodSchema;