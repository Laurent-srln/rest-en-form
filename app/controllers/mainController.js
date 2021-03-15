module.exports = {

    invalidToken : (err, req, res, next) => {
        if (err.name === 'UnauthorizedError') {
          console.log('401 UNAUTHORIZED - Invalid Token');
          res.status(401).json('Invalid token');
        }
      },

    notFound : (request, response, next) => {
        response.status(404).json({
            error: '404 Not Found'
        });
    },

}