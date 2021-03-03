const userMapper = require('../mappers/userMapper');

const userController = {
    allUsers: async (req, res) => {
        const users = await userMapper.findAll();

        res.json(users)
    },

    allMembers: async (req, res) => {
        const members = await userMapper.findAllMembers();

        res.json(members)
    },

    oneMember : async (req, res) => {

        const { id } = req.params;

        const member = await userMapper.findOneMember(id);

        res.json(member);

    },

    //a modifier pour un member
    allWorkoutsByMember: async (req, res) => {
        const workouts = await userMapper.findAllWorkoutsByMember();

        res.json(workouts)
    }

};

module.exports = userController;