const coachingMapper = require('../mappers/coachingMapper');

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
    coachAllBookings: async (req, res) => {

        const { id } = req.params;
        try{
        const bookings = await coachingMapper.findAllBookings(id);

        res.json(bookings)
        }catch(err){
        res.status(404).json(err.message)
    }
       
    },

    coachNextBookings: async (req, res) => {

        const { id } = req.params;
        try{
        const bookings = await coachingMapper.findNextBookings(id);
        
        res.json(bookings)
        }catch(err){
            res.status(404).json(err.message)
        }
    },

    coachLastBookings: async (req, res) => {

        const { id } = req.params;
        try{
        const bookings = await coachingMapper.findLastBookings(id);

        res.json(bookings)
        }catch(err){
            res.status(404).json(err.message)
        }
    },

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

        findAvailableCoachings: async (req,res) => {
            const { date } = req.body;

            if (dayjs(date).isSameOrBefore(dayjs(), 'day')) {

                res.status(400).json({"message": `La date sélectionnée doit être ultérieure à aujourd'hui.`})
                return;
            };

            try {
                const AvailableCoachings = await coachingMapper.findAvailableCoachings(date);
    
            res.json(AvailableCoachings)

            } catch(err){
                res.status(404).json(err.message)
            }

        }

};

module.exports = coachingController;