const coachingMapper = require('../mappers/coachingMapper');
const userMapper = require('../mappers/userMapper');
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

        res.status(200).json({"message": "Les créneaux de coaching ont bien été ajoutés.", "coachings": coachings})
    } catch(err) {
        res.status(400).json({"message": err.message});
        }

    },

    getAllCoachings : async (req, res) => {

        try{

            const result = await coachingMapper.getAllCoachings();

            res.status(200).json(result)

        }catch(err){
            res.status(400).json({"message" : err.message})
        }

    },

    getCoachingById : async (req, res) => {

        let {id} = req.params;
        id = Number(id);

        try{
        const result = await coachingMapper.getCoachingById(id);
        
        res.status(200).json(result);
        
    } catch(err) {
        res.status(400).json({"message": err.message});
        }

    },

    getAvailableCoachings: async (req,res) => {
        const { date } = req.query;

        if (dayjs(date).isSameOrBefore(dayjs(), 'day')) {

                res.status(400).json({"message": `La date sélectionnée doit être ultérieure à aujourd'hui.`})
                return;
        };

        try {
                const AvailableCoachings = await coachingMapper.getAvailableCoachings(date);
    
        res.status(200).json(AvailableCoachings)

    } catch(err) {
        res.status(400).json({"message": err.message});
        }

    },

    getMemberNextBookingsByTokenId: async (req, res) => {

        const {userId} = jsonwebtoken.decode(req.headers.authorization.substring(7));
        try{
        const bookings = await coachingMapper.getNextBookingsByMemberId(userId);
        
        res.status(200).json(bookings)
    } catch(err) {
        res.status(400).json({"message": err.message});
        }
    },

    getMemberNextBookingsByParamsId : async (req, res) => {

        let {id} = req.params;
        id = Number(id);

        console.log(id);
        try{
        
        const user = await userMapper.getUserById(id)

        if(!user) {

            res.status(400).json({"message": `pas de user avec cet id ${id}`})
            return;
        }

        const bookings = await coachingMapper.getNextBookingsByMemberId(id);
        
        res.status(200).json(bookings)
    } catch(err) {
        res.status(400).json({"message": err.message});
        }
        
    },

    getCoachNextBookings: async (req, res) => {

        const {userId} = jsonwebtoken.decode(req.headers.authorization.substring(7));
        try{
        const bookings = await coachingMapper.getNextBookingsbyCoachId(userId);
        
        res.status(200).json(bookings)
    } catch(err) {
        res.status(400).json({"message": err.message});
        }
    },

    getCoachLastBookings: async (req, res) => {

        const {userId} = jsonwebtoken.decode(req.headers.authorization.substring(7));
        try{
        const bookings = await coachingMapper.getLastBookingsbyCoachId(userId);

        res.status(200).json(bookings)
    } catch(err) {
        res.status(400).json({"message": err.message});
        }
    },

    addBooking: async (req,res) => {

        try {

            const { coachingId } = req.body;
            const {userId} = jsonwebtoken.decode(req.headers.authorization.substring(7));

            const check = await coachingMapper.getCoachingById(coachingId);

            if (check.memberId) {
                return res.status(400).json({"message": "Coaching déjà réservé."});
            }

            await coachingMapper.addBooking(userId,coachingId );
            
            const coaching = await coachingMapper.getCoachingById(coachingId);

            res.status(200).json({"message": 'Réservation bien enregistrée.', "coaching": coaching});

        } catch(err) {
            res.status(400).json({"message": err.message});
            }
    },

    deleteBooking: async (req,res) => {

        try {

        let { coachingId } = req.params;
        coachingId = Number(coachingId);
        const { userId } = jsonwebtoken.decode(req.headers.authorization.substring(7));

        const check = await coachingMapper.getCoachingById(coachingId);

        if (check.memberId !== userId) {
            return res.status(400).json({"message": "Vous n'avez pas réservé ce coaching."});
        }

        await coachingMapper.deleteBooking(userId, coachingId);

        const coaching = await coachingMapper.getCoachingById(coachingId);

        res.status(200).json({"message":'Réservation annulée.', "coaching": coaching})

    } catch(err) {
        res.status(400).json({"message": err.message});
        }
    },

    deleteCoachingById : async (req, res) => {

        try{
        let {id} = req.params;
        id = Number(id);
        
        const isCoaching = await coachingMapper.getCoachingById(id);

            const coaching = await coachingMapper.getCoachingById(id);
        
            await coachingMapper.deleteCoachingById(isCoaching.id);

            res.status(200).json({"message": "Coaching supprimé.", "coaching": coaching});

        } catch(err) {
            res.status(400).json({"message": err.message});
            }
               
    }

};

module.exports = coachingController;