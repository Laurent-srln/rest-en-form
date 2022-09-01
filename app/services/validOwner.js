const jsonwebtoken = require('jsonwebtoken');

const validOwner = (req, res, next) => {

    const {role} = jsonwebtoken.decode(req.headers.authorization.substring(7));

    if (role !== 'OWNER') {
        res.status(403).json({"message": `Accès non autorisé.`});
        
    } else {
        next();
    }
};

module.exports = validOwner;