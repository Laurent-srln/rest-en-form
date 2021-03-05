const { config } = require('process');
const userMapper = require('../mappers/userMapper');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const userController = {
    allUsers: async (req, res) => {
        const users = await userMapper.findAll();

        res.json(users)
    },

    allMembers: async (req, res) => {

        try{
        const members = await userMapper.findAllMembers();

        res.json(members)
        }catch(err){
            res.json(err.message)
        }
    },

    oneMember : async (req, res) => {

        const { id } = req.params;

        try{
        const member = await userMapper.findOneMember(id);

        res.json(member);
        }catch(err){
            res.status(400).json(err.message);
        }
    },

    //a modifier pour un member
    allWorkoutsByMember: async (req, res) => {

        const {id} = req.params //Ici, c'est l'id d'un user/member
        try{
        const workouts = await userMapper.findAllWorkoutsByMember(id);

        res.json(workouts)
        }catch(err){
            res.status(400).json(err.message);
        }
    },

    allCoachs : async (req, res) => {

        const coachs = await userMapper.findAllCoachs();

        res.json(coachs)
    },

    oneCoach : async (req, res) => {

        const {id} = req.params

        try{
        const coach = await userMapper.findOneCoach(id);

        console.log(coach);

        res.json(coach)
        }catch(err){
            res.status(400).json(err.message);
        }
    },

    NewUser : async (req, res) => {
        user = req.body

        try {
            const newUser = await userMapper.addUser(user);

            res.json(newUser)
        } catch (err) {
            res.status(400).json(err.message);
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
            await userMapper.addPassword(config.email, hashPassword);
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
            const hashPassword = await userMapper.checkConnexion(req.body.email);

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

module.exports = userController;