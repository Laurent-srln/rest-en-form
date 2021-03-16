/**
 * valide le payload d'une requête à partir du schéma passé en argument
 * @param {Joi.schema} schema 
 * @returns {Function} middleware Express prêt à l'emploi
 */

const validate = (schema) => (req, res, next) => {
    // on regarde ce qu'il y a dans req.body et on le valide par rapport au schema Joi
    const { error } = schema.validate({...req.body, ...req.params});

    // console.log({...req.body, ...req.params});

    if (error) {
        res.status(400).json({"message": error.message});
        console.log(error);
    } else {
        next();
    }
};

module.exports = validate;