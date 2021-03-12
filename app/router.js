const express = require('express');
const router = express.Router();

const authorizationMiddleware = require('./services/authorizationMiddleware');

const userController = require('./controllers/userController');
const workoutController = require('./controllers/workoutController');
const coachingController = require('./controllers/coachingController');
const authController = require('./controllers/authController');
const healthController = require('./controllers/healthController');
const specialtyController = require('./controllers/specialtyController');

//! rajouter la route pour avoir les données health d'un member par un coach!

router.get('/members', authorizationMiddleware, userController.allMembers);
router.get('/members/:id(\\d+)', authorizationMiddleware, userController.oneMember);
router.get('/members/:id(\\d+)/next-bookings', authorizationMiddleware, coachingController.checkMemberNextBookings);
router.get('/workouts', authorizationMiddleware, workoutController.allWorkoutsByMember);
router.get('/health', authorizationMiddleware, healthController.allHealthRecordsByMember);
router.post('/new-workout',authorizationMiddleware, workoutController.addWorkout);
router.patch('/edit-workout/:workoutId', authorizationMiddleware, workoutController.editWorkout);
router.delete('/delete-workout/:workoutId', authorizationMiddleware, workoutController.deleteWorkout);
router.post('/new-comment/:workoutId',authorizationMiddleware, workoutController.addComment);
router.patch('/edit-comment/:commentId',authorizationMiddleware, workoutController.editComment);
router.delete('/delete-comment/:commentId',authorizationMiddleware, workoutController.deleteComment);
router.get('/coachs',authorizationMiddleware, userController.allCoachs);
router.get('/coachs/:id(\\d+)', userController.oneCoach);
router.get('/coach-next-bookings',authorizationMiddleware, coachingController.coachNextBookings);
router.get('/coach-last-bookings',authorizationMiddleware, coachingController.coachLastBookings);

router.get('/member-next-bookings',authorizationMiddleware, coachingController.memberNextBookings);
// router.get('/member-last-bookings',authorizationMiddleware, coachingController.memberLastBookings);
router.get('/coaching/:id(\\d+)', authorizationMiddleware, coachingController.findACoachingById);
router.get('/specialties', authorizationMiddleware, specialtyController.allspecialties);

router.post('/new-coachings', authorizationMiddleware, coachingController.addCoachings);
router.post('/new-user', authorizationMiddleware, userController.newUser);
router.post('/register', authController.newPassword);
router.post('/login', authController.submitLogin);
router.patch('/users/:id(\\d+)', authorizationMiddleware, userController.editUser);

router.post('/specialties', specialtyController.newSpecialty);
router.get('/available-coachings', authorizationMiddleware, coachingController.findAvailableCoachings);
router.post('/book-coaching',authorizationMiddleware, coachingController.bookCoaching);

router.patch('/bookings/:coachingId/delete',authorizationMiddleware, coachingController.deleteBooking);


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