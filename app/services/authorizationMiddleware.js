const jwt = require('express-jwt');
const jsonwebtoken = require('jsonwebtoken');

const jwtSecret = require('./jwtSecret');

const authorizationMiddleware = jwt({ secret: jwtSecret, algorithms: ['HS256'] });

module.exports = authorizationMiddleware;





