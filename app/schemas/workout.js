const Joi = require('joi');

const workoutSchema = Joi.object({
    date: Joi.date().max('now').required(),
    content: Joi.string(),
    weight: Joi.number().integer().min(20).max(300).required(),
    muscleMass: Joi.number().integer().min(0).max(100).valid(Joi.expression("{100 - number(fatMass) - number(boneMass)}")).required(),
    fatMass: Joi.number().integer().min(0).max(100).required(),
    boneMass: Joi.number().integer().min(0).max(100).required(),
    bodyWater: Joi.number().integer().min(0).max(100).required()
});

module.exports = workoutSchema;