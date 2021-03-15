const express = require('express');
const router = express.Router();

// TOKEN AUTHENTIFICATION MIDDLEWARE
const authorizationMiddleware = require('./services/authorizationMiddleware');

// JOI VALIDATION MIDDLEWARE
const validator = require('./services/validator');

// JOI SCHEMAS
const workoutSchema = require('./schemas/workout');
const userSchema = require('./schemas/user');
const specialtySchema = require('./schemas/specialty');
const setPasswordSchema = require('./schemas/setPassword');
const loginSchema = require('./schemas/login');
const commentSchema = require('./schemas/comment');
const coachingTimePeriodSchema = require('./schemas/coachingTimePeriod');

// CONTROLLERS
const userController = require('./controllers/userController');
const workoutController = require('./controllers/workoutController');
const commentController = require('./controllers/commentController');
const coachingController = require('./controllers/coachingController');
const authController = require('./controllers/authController');
const healthController = require('./controllers/healthController');
const specialtyController = require('./controllers/specialtyController');


// CONNEXION ROUTES
router.post('/register', validator(setPasswordSchema), authController.setPassword);
router.post('/login', validator(loginSchema), authController.submitLogin);

// MEMBERS ROUTES
//      Workout & Helth data
router.post('/new-workout',authorizationMiddleware, validator(workoutSchema), workoutController.addWorkout);
router.get('/workouts', authorizationMiddleware, workoutController.getAllWorkoutsByMemberId);
router.get('/health', authorizationMiddleware, healthController.getAllHealthRecordsByMemberId);
router.patch('/edit-workout/:workoutId', authorizationMiddleware, workoutController.editWorkout);
router.delete('/delete-workout/:workoutId', authorizationMiddleware, workoutController.deleteWorkout);
//     Coachings
router.get('/available-coachings', authorizationMiddleware, coachingController.getAvailableCoachings);
router.get('/member-next-bookings',authorizationMiddleware, coachingController.getMemberNextBookingsByTokenId);
router.post('/book-coaching',authorizationMiddleware, coachingController.addBooking);
router.patch('/bookings/:coachingId/delete',authorizationMiddleware, coachingController.deleteBooking);

// COACHS ROUTES
//      Workout & Comments
router.post('/new-comment/:workoutId',authorizationMiddleware, validator(commentSchema), commentController.addComment);
router.patch('/edit-comment/:commentId',authorizationMiddleware, validator(commentSchema), commentController.editComment);
router.delete('/delete-comment/:commentId',authorizationMiddleware, commentController.deleteComment);
//      Coachings
router.get('/coach-next-bookings',authorizationMiddleware, coachingController.getCoachNextBookings);
router.get('/coach-last-bookings',authorizationMiddleware, coachingController.getCoachLastBookings);
router.get('/members/:id(\\d+)/next-bookings', authorizationMiddleware, coachingController.getMemberNextBookingsByParamsId);
//      Members
router.get('/members', authorizationMiddleware, userController.getAllMembers);

// OWNER ROUTES
//      Specialties
router.post('/specialties', validator(specialtySchema), specialtyController.addSpecialty);
router.get('/specialties', authorizationMiddleware, specialtyController.getAllSpecialties);
router.delete('/specialties/:id(\\d+)', specialtyController.deleteSpecialty);
//      Users
router.post('/new-user', authorizationMiddleware, validator(userSchema), userController.addUser);
router.get('/members/:id(\\d+)', authorizationMiddleware, userController.getMemberById);
router.get('/coachs/:id(\\d+)', userController.getCoachById);
router.patch('/users/:id(\\d+)', authorizationMiddleware,userController.editUser);
router.delete('/users/:id(\\d+)', userController.deleteUser);
//      Coachings
router.post('/new-coachings', authorizationMiddleware, validator(coachingTimePeriodSchema), coachingController.addCoachings);
router.get('/coaching/:id(\\d+)', authorizationMiddleware, coachingController.getCoachingById);
router.delete('/coaching/:id(\\d+)', coachingController.deleteCoachingById);

// ALL USERS ROUTES
router.get('/coachs',authorizationMiddleware, userController.getAllCoachs);

// INVALID TOKEN
router.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
      console.log('401 UNAUTHORIZED - Invalid Token');
      res.status(401).json('Invalid token');
    }
  })

  //! 404 - to do


module.exports = router;