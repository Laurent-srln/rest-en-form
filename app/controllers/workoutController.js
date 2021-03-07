const { config } = require('process');
const workoutMapper = require('../mappers/workoutMapper');

const dayjs = require('dayjs');
// Pour les timezones
const utc = require('dayjs/plugin/utc'); // dependent on utc plugin
const timezone = require('dayjs/plugin/timezone');
const isSameOrBefore = require('dayjs/plugin/isSameOrBefore');
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrBefore);
// On défini les locales
require('dayjs/locale/fr');
dayjs.locale('fr');


const workoutController = {
    addWorkout: async (req, res) => {

    
        const newWorkout = req.body;
        const memberId = req.params.id;

        if (!newWorkout.weight || !newWorkout.muscleMass || !newWorkout.fatMass || !newWorkout.boneMass || !newWorkout.bodyWater) {

            res.status(400).json({"message": `Tous les champs obligatoires doivent être remplis`})
            return;

        }

        if (!dayjs(newWorkout.date).isSameOrBefore(dayjs(), 'day')) {


            res.status(400).json({"message": `La date de l'entrainement doit ne peut être ultérieure à aujourd'hui`})
            return;
        };

        const workout = await workoutMapper.addWorkout(newWorkout, memberId);

        res.json(workout)
    }

};

module.exports = workoutController;

