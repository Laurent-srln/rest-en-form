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

            res.status(400).json({"message": `Tous les champs obligatoires doivent être remplis.`})
            return;

        }

        if (!dayjs(newWorkout.date).isSameOrBefore(dayjs(), 'day')) {


            res.status(400).json({"message": `La date de l'entraînement doit ne peut être ultérieure à aujourd'hui.`})
            return;
        };


        const workoutId = await workoutMapper.addWorkout(newWorkout, userId);

        const workout = await workoutMapper.getWorkoutById(workoutId.id);

        res.status(200).json({"message": `L'entraînement a bien été ajouté.`, "workout": workout})
    } catch(err) {
        res.status(400).json({"message": err.message});
        };
    },

    getAllWorkoutsByMemberId: async (req, res) => {

        const {userId} = jsonwebtoken.decode(req.headers.authorization.substring(7))
        try{
        const workouts = await workoutMapper.getAllWorkoutsByMemberIdId(userId);

        res.status(200).json(workouts)
    } catch(err) {
        res.status(400).json({"message": err.message});
        }
    },

    getMemberWorkoutsByParamsId : async (req, res) => {

        let {id} = req.params;
        id = Number(id);
        try{
        const workouts = await workoutMapper.getAllWorkoutsByMemberIdId(id);
    
        res.status(200).json(workouts)
    } catch(err) {
        res.status(400).json({"message": err.message});
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

                res.status(400).json({"message": `Cet entraînement est introuvable.`})
                return;
            }

            if (check.memberId !== userId) {

                res.status(400).json({"message": `Vous ne pouvez pas modifier cet entraînement.`})
                return;
            }

            if (!updatedWorkout.weight || !updatedWorkout.muscleMass || !updatedWorkout.fatMass || !updatedWorkout.boneMass || !updatedWorkout.bodyWater) {
    
                res.status(400).json({"message": `Tous les champs obligatoires doivent être remplis.`})
                return;
    
            }
    
            if (!dayjs(updatedWorkout.date).isSameOrBefore(dayjs(), 'day')) {
    
    
                res.status(200).json({"message": "Les modifications ont bien été enregistrées."});
                return;
            };
    
    
            await workoutMapper.editWorkout(workoutId, updatedWorkout);
            const workout = await workoutMapper.getWorkoutById(workoutId);
    
            res.status(200).json({ "message" : `L'entraînement a bien été mis à jour.`, "workout": workout})
        } catch(err) {
            res.status(400).json({"message": err.message});
            };
    },

    deleteWorkout: async (req,res) => {

        try {

        const {userId} = jsonwebtoken.decode(req.headers.authorization.substring(7));
        let { workoutId } = req.params;
        workoutId = Number(workoutId);

        const check = await workoutMapper.getWorkoutById(workoutId);

        if (!check) {
            res.status(400).json("Cet entraînement est introuvable.");
            return;
        }

        if (check.memberId !== userId) {
            res.status(400).json({"message": "Cet utilisateur ne peut pas supprimer cet entraînement."});
            return;
        }
        const deletedWorkout = await workoutMapper.getWorkoutById(workoutId);
        await workoutMapper.deleteWorkout(workoutId, userId);

        res.status(200).json({"message": "L'entraînement a bien été supprimé.", "workout": deletedWorkout});
        return;
    } catch(err) {
        res.status(400).json({"message": err.message});
        };

    }
}

module.exports = workoutController;
