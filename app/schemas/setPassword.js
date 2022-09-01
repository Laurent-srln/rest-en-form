const Joi = require('joi');

//Minimum 8 and maximum 30 characters, at least one uppercase letter, one lowercase letter, one number and one special character

const setPasswordSchema = Joi.object({
    password: 
        Joi.string()
        .pattern(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,30}$'))
        .required()
        .error(new Error ('Le mot de passe doit contenir entre 8 et 30 caractères, au moins une lettre majuscule, une lettre minuscule, un nombre, un caractère spécial parmis : #?!@$%^&*-')),
    confirm: 
        Joi.string()
        .valid(Joi.ref('password'))
        .required()
        .error(new Error ('Les deux mots de passe doivent être identiques.'))
});

module.exports = setPasswordSchema;