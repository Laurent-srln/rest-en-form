const jsonwebtoken = require('jsonwebtoken');

const validCoach = (req, res, next) => {

    const {role} = jsonwebtoken.decode(req.headers.authorization.substring(7));

    if (role !== 'COACH') {
        res.status(403).json({"message": `Accès non autorisé.`});
        
    } else {
        next();
    }
};

module.exports = validCoach;