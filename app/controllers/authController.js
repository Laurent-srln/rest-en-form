const emailValidator = require('email-validator');
const authMapper = require('../mappers/authMapper');
const bcrypt = require('bcrypt');
const saltRounds = 10;

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
            res.json({"message": "Merci de remplir tous les champs"})
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
            const hashPassword = await authMapper.checkConnexion(req.body.email);

           await bcrypt.compare(req.body.password, hashPassword.password, function (err, isPasswordCorrect) {
               console.log(req.body.password);
               console.log(hashPassword.password);

                if (!isPasswordCorrect) {
                    res.json({ "message": "Impossible de vous connecter, veuillez réessayer" });
                    return;
                }
                res.status(200).json({ "message": "Connexion réussie" });

        })} catch (err) {
            res.status(400).json(err.message);
        }

       }   
    
}

module.exports = authController;