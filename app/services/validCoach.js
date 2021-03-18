const validCoach = (req, res, next) => {


    if (error) {
        res.status(400).json({"message": error.message});
        console.log(error);
    } else {
        next();
    }
};

module.exports = validCoach;