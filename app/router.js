const express = require('express');
const authController = require('./controllers/authController');
const coachingController = require('./controllers/coachingController');
const authorizationMiddleware = require('./jwt/authorizationMiddleware');
<<<<<<< HEAD
const userController = require('./controllers/userController');
const workoutController = require('./controllers/workoutController');
=======
>>>>>>> 71a4520903e6f3e67f8b506fe0db810433788e89

const router = express.Router();



router.get('/users', userController.allUsers);
router.get('/members', userController.allMembers);
router.get('/members/:id(\\d+)', userController.oneMember);
router.get('/workouts', userController.allWorkoutsByMember);
router.post('/members/:id(\\d+)/new-workout', workoutController.addWorkout);
router.get('/coachs',authorizationMiddleware, userController.allCoachs);
router.get('/coachs/:id(\\d+)', userController.oneCoach);
router.get('/coachs/:id(\\d+)/bookings', coachingController.coachAllBookings);
router.get('/coachs/:id(\\d+)/next-bookings', coachingController.coachNextBookings);
router.get('/coachs/:id(\\d+)/last-bookings', coachingController.coachLastBookings);
router.get('/coaching/:id(\\d+)', coachingController.findACoachingById);

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


router.delete('/coaching/:id(\\d+)', coachingController.deleteACoachingByPk);
router.delete('/users/:id(\\d+)', userController.deleteUser);



router.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
      console.log('<< 401 UNAUTHORIZED - Invalid Token');
      res.status(401).json('Invalid token');
    }
  })







module.exports = router;