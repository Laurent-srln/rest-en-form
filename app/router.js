const express = require('express');
const authController = require('./controllers/authController');
const coachingController = require('./controllers/coachingController');

const router = express.Router();

const userController = require('./controllers/userController');
const workoutController = require('./controllers/workoutController');


router.get('/users', userController.allUsers);
router.get('/members', userController.allMembers);
router.get('/members/:id(\\d+)', userController.oneMember);
router.get('/members/:id(\\d+)/workouts', userController.allWorkoutsByMember);
router.post('/members/:id(\\d+)/new-workout', workoutController.addWorkout);
router.get('/coachs', userController.allCoachs);
router.get('/coachs/:id(\\d+)', userController.oneCoach);
router.get('/coachs/:id(\\d+)/bookings', coachingController.coachAllBookings);
router.get('/coachs/:id(\\d+)/next-bookings', coachingController.coachNextBookings);
router.get('/coachs/:id(\\d+)/last-bookings', coachingController.coachLastBookings);

router.post('/new-coachings', coachingController.addCoachings);

router.post('/new-user', userController.newUser);
router.post('/new-password', authController.newPassword);
router.post('/login-password', authController.checkConnexion);
router.post('/login-email', authController.submitLogin);

router.post('/book-coaching', coachingController.findAvailableCoachings);







module.exports = router;