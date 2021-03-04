const userMapper = require('../mappers/userMapper');

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
            res.status(404).json(err.message);
        }
    },

    //a modifier pour un member
    allWorkoutsByMember: async (req, res) => {

        const {id} = req.params //Ici, c'est l'id d'un user/member
        try{
        const workouts = await userMapper.findAllWorkoutsByMember(id);

        res.json(workouts)
        }catch(err){
            res.status(404).json(err.message);
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

        res.json(coach)
        }catch(err){
            res.status(404).json(err.message);
        }
    }

};

module.exports = userController;