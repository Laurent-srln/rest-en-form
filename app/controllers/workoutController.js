const { config } = require('process');
const workoutMapper = require('../mappers/workoutMapper');

const jsonwebtoken = require('jsonwebtoken');

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
        const {userId} = jsonwebtoken.decode(req.headers.authorization.substring(7))

        try {

        if (!newWorkout.weight || !newWorkout.muscleMass || !newWorkout.fatMass || !newWorkout.boneMass || !newWorkout.bodyWater) {

            res.status(400).json({"message": `Tous les champs obligatoires doivent être remplis`})
            return;

        }

        if (!dayjs(newWorkout.date).isSameOrBefore(dayjs(), 'day')) {


            res.status(400).json({"message": `La date de l'entrainement doit ne peut être ultérieure à aujourd'hui`})
            return;
        };


        const workout = await workoutMapper.addWorkout(newWorkout, userId);

        res.json(workout)
        }
        catch (err) {
        res.status(400).json(err.message);

        };
    },

    getAllWorkoutsByMemberId: async (req, res) => {

        const {userId} = jsonwebtoken.decode(req.headers.authorization.substring(7))
        try{
        const workouts = await workoutMapper.getAllWorkoutsByMemberIdId(userId);

        res.json(workouts)
        }catch(err){
            res.status(400).json(err.message);
        }
    },

    editWorkout: async (req, res) => {

        let { workoutId } = req.params;
        workoutId = Number(workoutId);
        const updatedWorkout = req.body;
        const { userId } = jsonwebtoken.decode(req.headers.authorization.substring(7));

        try {

            const check = await workoutMapper.getWorkoutById(workoutId);

            if (!check) {

                res.status(400).json({"message": `Ce workout est introuvable.`})
                return;
            }

            if (check.member_id !== userId) {

                res.status(400).json({"message": `Vous ne pouvez pas modifier ce workout.`})
                return;
            }

            if (!updatedWorkout.weight || !updatedWorkout.muscleMass || !updatedWorkout.fatMass || !updatedWorkout.boneMass || !updatedWorkout.bodyWater) {
    
                res.status(400).json({"message": `Tous les champs obligatoires doivent être remplis`})
                return;
    
            }
    
            if (!dayjs(updatedWorkout.date).isSameOrBefore(dayjs(), 'day')) {
    
    
                res.status(400).json("Les modifications ont bien été enregistrées.")
                return;
            };
    
    
            const workout = await workoutMapper.editWorkout(workoutId, updatedWorkout);
    
            res.status(200).json({ "message" : `workout avec l'id ${workoutId} a bien été mis à jour`,workout})
            }
            catch (err) {
            res.status(400).json(err.message);
    
            };
    },

    deleteWorkout: async (req,res) => {

        try {

        const {userId} = jsonwebtoken.decode(req.headers.authorization.substring(7));
        let { workoutId } = req.params;
        workoutId = Number(workoutId);

        const check = await workoutMapper.getWorkoutById(workoutId);

        if (!check) {
            res.status(200).json("Ce workout est introuvable.");
            return;
        }

        if (check.member_id !== userId) {
            res.status(200).json("Cet utilisateur ne peut pas supprimer ce workout.");
            return;
        }

        await workoutMapper.deleteWorkout(workoutId, userId);

        res.status(200).json("Le workout a été supprimé.");
        return;
    }         catch (err) {
        res.status(400).json(err.message);

        };

    }
}

module.exports = workoutController;
