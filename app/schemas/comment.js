const Joi = require('joi');

const commentSchema = Joi.object({
    workoutId:
        Joi.string()
        .pattern(new RegExp('^[1-9][0-9]*$'))
        .error(new Error (
            `Un id (nombre entier) doit être précisé.`
 )),
    commentId:
        Joi.string()
        .pattern(new RegExp('^[1-9][0-9]*$'))
        .error(new Error (
            `Un id (nombre entier) doit être précisé.`
 )),
    content:
        Joi.string()
        .invalid('')
        .required()
        .error(new Error (
            `Le commentaire ne peut pas être vide.`
 )),
}).xor('workoutId', 'commentId');

module.exports = commentSchema;