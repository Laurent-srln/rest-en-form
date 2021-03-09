const { config } = require('process');
const userMapper = require('../mappers/userMapper');
const emailValidator = require('email-validator');

const jsonwebtoken = require('jsonwebtoken');
const jwtSecret = require('../jwt/jwtSecret');


const userController = {
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

    allCoachs : async (req, res) => {

        try {
            const coachs = await userMapper.findAllCoachs();
    
    
        res.json(coachs)
        } catch(err){
            res.status(400).json(err.message);
        }
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
 
}

module.exports = userController;