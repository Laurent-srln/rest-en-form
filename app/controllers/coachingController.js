const coachingMapper = require('../mappers/coachingMapper');

const coachingController = {
    coachAllBookings: async (req, res) => {

        const { id } = req.params;
        const bookings = await coachingMapper.findAllBookings(id);

        res.json(bookings)
    },

    coachNextBookings: async (req, res) => {

        const { id } = req.params;
        const bookings = await coachingMapper.findNextBookings(id);

        res.json(bookings)
    },

    coachLastBookings: async (req, res) => {

        const { id } = req.params;
        const bookings = await coachingMapper.findLastBookings(id);

        res.json(bookings)
    },

    newCoachings: async (req, res) => {
        const newCoachings = req.body;

        try {
            await coachingMapper.save(newCoachings);
            res.json(newCoachings);
        } catch(err) {
            res.status(403).json(err.message);
        }
    }

};

module.exports = coachingController;