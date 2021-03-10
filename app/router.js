const express = require('express');
const router = express.Router();

const authorizationMiddleware = require('./services/authorizationMiddleware');

const userController = require('./controllers/userController');
const workoutController = require('./controllers/workoutController');
const coachingController = require('./controllers/coachingController');
const authController = require('./controllers/authController');
const healthController = require('./controllers/healthController');
const specialtyController = require('./controllers/specialtyController');

router.get('/members', userController.allMembers);
router.get('/members/:id(\\d+)', userController.oneMember);
router.get('/workouts', authorizationMiddleware, workoutController.allWorkoutsByMember);
router.get('/health', authorizationMiddleware, healthController.allHealthRecordsByMember);
router.post('/new-workout',authorizationMiddleware, workoutController.addWorkout);
router.get('/coachs',authorizationMiddleware, userController.allCoachs);
router.get('/coachs/:id(\\d+)', userController.oneCoach);
router.get('/next-bookings',authorizationMiddleware, coachingController.coachNextBookings);
router.get('/last-bookings',authorizationMiddleware, coachingController.coachLastBookings);
router.get('/coaching/:id(\\d+)', coachingController.findACoachingById);
router.get('/specialties', specialtyController.allspecialties);

router.post('/new-coachings', coachingController.addCoachings);
router.post('/new-user', userController.newUser);
router.post('/register', authController.newPassword);
router.post('/login', authController.submitLogin);
router.post('/book-coaching', coachingController.findAvailableCoachings);
router.post('/specialties', specialtyController.newSpecialty);

router.delete('/coaching/:id(\\d+)', coachingController.deleteACoachingByPk);
router.delete('/users/:id(\\d+)', userController.deleteUser);
router.delete('/specialties/:id(\\d+)', specialtyController.deleteSpecialty);

router.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
      console.log('401 UNAUTHORIZED - Invalid Token');
      res.status(401).json('Invalid token');
    }
  })


module.exports = router;