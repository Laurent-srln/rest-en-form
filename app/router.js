const express = require('express');
const coachingController = require('./controllers/coachingController');

const router = express.Router();

const userController = require('./controllers/userController');


router.get('/users', userController.allUsers);
router.get('/members', userController.allMembers);
router.get('/members/:id(\\d+)', userController.oneMember);
router.get('/members/:id(\\d+)/workouts', userController.allWorkoutsByMember);
router.get('/coachs', userController.allCoachs);
router.get('/coachs/:id(\\d+)', userController.oneCoach);
router.get('/coachs/:id(\\d+)/bookings', coachingController.coachAllBookings);
router.get('/coachs/:id(\\d+)/next-bookings', coachingController.coachNextBookings);
router.get('/coachs/:id(\\d+)/last-bookings', coachingController.coachLastBookings);

router.post('/new-coachings', coachingController.newCoachings);





module.exports = router;