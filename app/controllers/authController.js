const userMapper = require('../mappers/userMapper');
const emailValidator = require('email-validator');

const authController = {

    submitLogin : async (req, res) => {

        try{
        const validEmail = emailValidator.validate(req.body.email);

        if (!validEmail){

            res.status(400).json({"message": `email non valide`})
        }

        else{
        const email = req.body.email
            
        const result = await userMapper.findUserByEmail(email);
        
        if (result){
            res.status(200).json({"message":`email valide pour ${result.firstname}`});
        }
        }   
        }catch(err){
            res.status(400).json(err.message)
        }

    } 
}

module.exports = authController;