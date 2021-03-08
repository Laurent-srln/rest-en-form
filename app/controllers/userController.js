const { config } = require('process');
const userMapper = require('../mappers/userMapper');
const emailValidator = require('email-validator');

const jsonwebtoken = require('jsonwebtoken');
const jwtSecret = require('../jwt/jwtSecret');
const { deleteUser } = require('../mappers/userMapper');


const userController = {
    allUsers: async (req, res) => {
        const users = await userMapper.findAll();
console.log(process.env.DATABASE_URL);
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

        const {id} = req.params;
        
        try{
        const member = await userMapper.findOneMember(id);

        res.json(member);
        }catch(err){
            res.status(400).json(err.message);
        }
    },

    //a modifier pour un member
    allWorkoutsByMember: async (req, res) => {

        const {userId} = jsonwebtoken.decode(req.headers.authorization.substring(7)) //Ici, c'est l'id d'un user/member
        try{
        const workouts = await userMapper.findAllWorkoutsByMember(userId);

        res.json(workouts)
        }catch(err){
            res.status(400).json(err.message);
        }
    },

    allCoachs : async (req, res) => {

        console.log(jsonwebtoken.decode(req.headers.authorization.substring(7)));

        try {
            const coachs = await userMapper.findAllCoachs();
        
        coachs.forEach( coach => coach.specialities = coach.specialities.split(","));
        
        res.json(coachs)
        } catch(err){
            res.status(400).json(err.message);
        }
    },

    oneCoach : async (req, res) => {

        const {id} = req.params

        try{
        const coach = await userMapper.findOneCoach(id);
        
        coach.specialities = coach.specialities.split(",");

        res.json(coach)
        }catch(err){
            res.status(400).json(err.message);
        }
    },

    newUser : async (req, res) => {
        user = req.body

        const validEmail = emailValidator.validate(user.email);

        if (!user.email || !user.firstname || !user.lastname || !user.role ) {
            res.status(400).json({"message": `Tous les champs obligatoires doivent être remplis`})
            return;
        };

        if (!validEmail){

            res.status(400).json({"message": `email non valide`})
            return;
        };


        try {
            const newUser = await userMapper.addUser(user);

            res.json(newUser)
        } catch (err) {
            res.status(400).json(err.message);
        };
    },

    deleteUser : async (req, res) => {

        const {id} = req.params;
        
        const isUser = await userMapper.findOneUser(id);
        
        if(!isUser) {
            res.status(400).json("Pas de user à cet id, veuillez en entrer un valide")
        }
        else {
            await userMapper.deleteOneUser(isUser.id);

            res.json("cet user a bien été supprimé")
        }   
        
    }
 
}

module.exports = userController;