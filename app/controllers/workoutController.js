const { config } = require('process');
const workoutMapper = require('../mappers/workoutMapper');

const workoutController = {
    addWorkout: async (req, res) => {

    
        const newWorkout = req.body;
        const memberId = req.params.id;

        if (!newWorkout.weight || !newWorkout.muscleMass || !newWorkout.fatMass || !newWorkout.boneMass || !newWorkout.bodyWater) {

            res.status(400).json({"message": `Tous les champs obligatoires doivent être remplis`})
            return;

        }

        const workout = await workoutMapper.addWorkout(newWorkout, memberId);

        res.json(workout)
    }

};

module.exports = workoutController;

