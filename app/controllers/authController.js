const emailValidator = require('email-validator');


const authMapper = require('../mappers/authMapper');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const jsonwebtoken = require('jsonwebtoken');
const jwtSecret = require('../services/jwtSecret');

const authController = {

    submitLogin : async (req, res) => {
        
        const { email, password } = req.body;


        try{
        if(!password || !email) {
            res.json({"message": "All field must be completed."});
            return;
        }

        const validEmail = emailValidator.validate(email);

        if (!validEmail){

            return res.status(400).json({"message": `Invalid email`})
        }

            
        const result = await authMapper.checkConnexion(email);
        
        if (!result){

            return res.status(400).json({"message": `User not found.`});
        }

        await bcrypt.compare(password, result.password, function (err, isPasswordCorrect) {


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

   },
    
    newPassword : async (req, res) => {
        const newPassword = req.body;
        const token = req.query.token;
        console.log(req.query);
        try {
        
        if(!newPassword.password || !newPassword.confirm) {
            return res.json({"message": "Tous les champs doivent être remplis."})
        }

        if(newPassword.password !== newPassword.confirm) {
            return res.json({"message": "Les deux mots de passe doivent être identique"})
        }

        const foundToken = await authMapper.findToken(token);

        if(!foundToken) {
            return res.json({"message": "Token not found"})
        }

        const hashPassword = await bcrypt.hash(newPassword.password, saltRounds);
        console.log(hashPassword);

            await authMapper.addPassword(token, hashPassword);
            res.json({"message": "Le nouveau mot de passe a bien été enregistré"})

        } catch (err) {
            res.status(400).json(err.message);
        }

    } 
}
    

module.exports = authController;