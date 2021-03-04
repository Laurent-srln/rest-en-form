const express = require('express');
const coachingController = require('./controllers/coachingController');

const router = express.Router();

const userController = require('./controllers/userController');


router.get('/users', userController.allUsers);
router.get('/members', userController.allMembers);
router.get('/members/:id(\\d+)', userController.oneMember);
router.get('/workouts', userController.allWorkoutsByMember);
router.get('/coachs', userController.allCoachs);
router.get('/coach/:id(\\d+)/bookings', coachingController.coachAllBookings);
router.get('/coach/:id(\\d+)/next-bookings', coachingController.coachNextBookings);
router.get('/coach/:id(\\d+)/last-bookings', coachingController.coachLastBookings);





module.exports = router;