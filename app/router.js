const express = require('express');
const router = express.Router();

const authorizationMiddleware = require('./jwt/authorizationMiddleware');

const userController = require('./controllers/userController');
const workoutController = require('./controllers/workoutController');
const coachingController = require('./controllers/coachingController');
const authController = require('./controllers/authController');
const healthController = require('./controllers/healthController');

router.get('/members', userController.allMembers);
router.get('/members/:id(\\d+)', userController.oneMember);
router.get('/workouts', authorizationMiddleware, workoutController.allWorkoutsByMember);
router.get('/health', authorizationMiddleware, healthController.allHealthRecordsByMember);
router.post('/members/:id(\\d+)/new-workout', workoutController.addWorkout);
router.get('/coachs',authorizationMiddleware, userController.allCoachs);
router.get('/coachs/:id(\\d+)', userController.oneCoach);
router.get('/coachs/:id(\\d+)/next-bookings', coachingController.coachNextBookings);
router.get('/coachs/:id(\\d+)/last-bookings', coachingController.coachLastBookings);

router.post('/new-coachings', coachingController.addCoachings);

router.post('/new-user', userController.newUser);
router.post('/new-password', authController.newPassword);
router.post('/login-password', authController.checkConnexion);
router.post('/login-email', authController.submitLogin);

router.post('/book-coaching', coachingController.findAvailableCoachings);

router.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
      console.log('<< 401 UNAUTHORIZED - Invalid Token');
      res.status(401).json('Invalid token');
    }
  })







module.exports = router;