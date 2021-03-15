const coachingMapper = require('../mappers/coachingMapper');
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

const coachingController = {

    addCoachings : async (req, res) => {

        const params = req.body;

        if (dayjs(params.date).isSameOrBefore(dayjs(), 'day')) {

            res.status(400).json({"message": `La date sélectionnée doit être ultérieure à aujourd'hui.`})
            return;
        };

        if (dayjs(params.date + params.end).isSameOrBefore(dayjs(params.date + params.start))) {

            res.status(400).json({"message": `L'heure de fin doit être supérieure à l'heure de début.`})
            return;
        };

        const startMin = dayjs(params.date + params.start).format('mm');
        const endMin = dayjs(params.date + params.end).format('mm'); 

        console.log(startMin);

        if ((startMin !== '00' && startMin !== '15' && startMin !== '30' && startMin !== '45') || (endMin !== '00' && endMin !== '15' && endMin !== '30' && endMin !== '45'))  {

            res.status(400).json({"message": `Les minutes doivent être égales à 0, 15, 30 ou 45.`})
            return;
        };

        try {
            const coachings = await coachingMapper.addCoachings(params);

        res.json(coachings)
        } catch(err){
            res.status(404).json(err.message)
        }

    },

    getCoachingById : async (req, res) => {

        const {id} = req.params;

        try{
        const result = await coachingMapper.getCoachByIding(id);
        
        console.log(result);
        
        }catch(err){
            res.status(400).json(err.message)
        }

    },

    getAvailableCoachings: async (req,res) => {
        const { selectedDate } = req.query;

        if (dayjs(selectedDate).isSameOrBefore(dayjs(), 'day')) {

                res.status(400).json({"message": `La date sélectionnée doit être ultérieure à aujourd'hui.`})
                return;
        };

        try {
                const AvailableCoachings = await coachingMapper.getAvailableCoachings(selectedDate);
    
        res.json(AvailableCoachings)

        } catch(err){
                res.status(404).json(err.message)
        }

    },

    getMemberNextBookingsByTokenId: async (req, res) => {

        const {userId} = jsonwebtoken.decode(req.headers.authorization.substring(7));
        try{
        const bookings = await coachingMapper.getNextBookingsByMemberId(userId);
        
        res.json(bookings)
        }catch(err){
            res.status(404).json(err.message)
        }
    },

    getMemberNextBookingsByParamsId : async (req, res) => {

        const {id} = req.params;
        try{
        const bookings = await coachingMapper.getNextBookingsByMemberId(id);
        
        res.json(bookings)
        }catch(err){
            res.status(404).json(err.message)
        }
        
    },

    getCoachNextBookings: async (req, res) => {

        const {userId} = jsonwebtoken.decode(req.headers.authorization.substring(7));
        try{
        const bookings = await coachingMapper.getNextBookingsbyCoachId(userId);
        
        res.json(bookings)
        }catch(err){
            res.status(404).json(err.message)
        }
    },

    getCoachLastBookings: async (req, res) => {

        const {userId} = jsonwebtoken.decode(req.headers.authorization.substring(7));
        try{
        const bookings = await coachingMapper.getLastBookingsbyCoachId(userId);

        res.json(bookings)
        }catch(err){
            res.status(404).json(err.message)
        }
    },

    addBooking: async (req,res) => {

        try {

            const { coachingId } = req.body;
            const {userId} = jsonwebtoken.decode(req.headers.authorization.substring(7));

            const check = await coachingMapper.getCoachByIding(coachingId);

            if (check.member_id) {
                return res.json("Coaching déjà réserevé.");
            }

            const coaching = await coachingMapper.addBooking(userId,coachingId );

            res.json('Réservation bien enregistrée.');
        } catch(err){
            res.status(400).json(err.message);
        } 
    },

    deleteBooking: async (req,res) => {

        try {

        const { coachingId } = req.params;
        const { userId } = jsonwebtoken.decode(req.headers.authorization.substring(7));

        const check = await coachingMapper.getCoachByIding(coachingId);

        if (check.member_id !== userId) {
            return res.json("Vous n'avez pas réservé ce coaching.");
        }

        await coachingMapper.deleteBooking(userId, coachingId);

        res.json('Réservation annulée.')

    } catch(err){
            res.status(400).json(err.message);
        } 
    },

    deleteCoachingById : async (req, res) => {

        try{
        const {id} = req.params;
        
        const isCoaching = await coachingMapper.getCoachByIding(id);
        
            await coachingMapper.deleteCoachingById(isCoaching.id);

            res.json("Coaching supprimé");

        }catch(err){
            res.status(400).json("id déjà supprimé");
        }
               
    }

};

module.exports = coachingController;