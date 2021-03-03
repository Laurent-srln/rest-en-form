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

    //a modifier pour un member
    allWorkouts: async (req, res) => {
        const workouts = await userMapper.findAllWorkouts();

        res.json(workouts)
    }

};

module.exports = userController;