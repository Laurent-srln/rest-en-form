const emailValidator = require('email-validator');


const authMapper = require('../mappers/authMapper');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const jwt = require('express-jwt');
const jsonwebtoken = require('jsonwebtoken');
const jwtSecret = require('../jwt/jwtSecret');

const authController = {

    submitLogin : async (req, res) => {

        try{
        const validEmail = emailValidator.validate(req.body.email);

        if (!validEmail){

            res.status(400).json({"message": `email non valide`})
        }

        else{
        const email = req.body.email
            
        const result = await authMapper.findUserByEmail(email);
        
        if (result){

            res.status(200).json(result);
        }
        }   
        }catch(err){
            res.status(400).json(err.message)
        }

    },
    
    newPassword : async (req, res) => {
        let config = req.body

        if(!config.password || !config.confirm) {
            res.json({"message": "Tous les champs doivent être remplis."})
        }

        if(config.password !== config.confirm) {
            res.json({"message": "Les deux mots de passe doivent être identique"})
        }

        const hashPassword = await bcrypt.hash(config.password, saltRounds);
        console.log(hashPassword);

        try {
            await authMapper.addPassword(config.email, hashPassword);
            res.json({"message": "Le nouveau mot de passe a bien été enregistré"})

        } catch (err) {
            res.status(400).json(err.message);
        }

    },

    checkConnexion : async (req, res) => {

        if(!req.body.password) {
            res.json({"message": "Merci de saisir votre mot de passe."});
            return;
        }

        try {
            const result = await authMapper.checkConnexion(req.body.email);

           await bcrypt.compare(req.body.password, result.password, function (err, isPasswordCorrect) {


                if (!isPasswordCorrect) {
                    res.json({logged: false});
                    return;
                }

                if (isPasswordCorrect) {
                    const jwtContent = { userId: result.id, email: result.email, role: result.role }
                    const jwtOptions = {
                        algorithm: 'HS256',
                        expiresIn: '10h'
                    };
                
                res.status(200).json({ 
                    logged: true,
                    token: jsonwebtoken.sign(jwtContent, jwtSecret, jwtOptions)});
                }

        })} catch (err) {
            res.status(400).json(err.message);
        }

       }   
    
}

module.exports = authController;