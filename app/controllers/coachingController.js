const coachingMapper = require('../mappers/coachingMapper');

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
    }

};

module.exports = coachingController;