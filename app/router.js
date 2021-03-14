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
router.post('/register', validator(setPasswordSchema), authController.newPassword);
router.post('/login', validator(loginSchema), authController.submitLogin);

// MEMBERS ROUTES
//      Workout & Helth data
router.post('/new-workout',authorizationMiddleware, validator(workoutSchema), workoutController.addWorkout);
router.get('/workouts', authorizationMiddleware, workoutController.allWorkoutsByMember);
router.get('/health', authorizationMiddleware, healthController.allHealthRecordsByMember);
router.patch('/edit-workout/:workoutId', authorizationMiddleware, workoutController.editWorkout);
router.delete('/delete-workout/:workoutId', authorizationMiddleware, workoutController.deleteWorkout);
//     Coachings
router.get('/available-coachings', authorizationMiddleware, coachingController.findAvailableCoachings);
router.get('/member-next-bookings',authorizationMiddleware, coachingController.memberNextBookings);
router.post('/book-coaching',authorizationMiddleware, coachingController.bookCoaching);
router.patch('/bookings/:coachingId/delete',authorizationMiddleware, coachingController.deleteBooking);

// COACHS ROUTES
//      Workout & Comments
router.post('/new-comment/:workoutId',authorizationMiddleware, validator(commentSchema), commentController.addComment);
router.patch('/edit-comment/:commentId',authorizationMiddleware, validator(commentSchema), commentController.editComment);
router.delete('/delete-comment/:commentId',authorizationMiddleware, commentController.deleteComment);
//      Coachings
router.get('/coach-next-bookings',authorizationMiddleware, coachingController.coachNextBookings);
router.get('/coach-last-bookings',authorizationMiddleware, coachingController.coachLastBookings);
router.get('/members/:id(\\d+)/next-bookings', authorizationMiddleware, coachingController.checkMemberNextBookings);
//      Members
router.get('/members', authorizationMiddleware, userController.allMembers);

// OWNER ROUTES
//      Specialties
router.post('/specialties', validator(specialtySchema), specialtyController.newSpecialty);
router.get('/specialties', authorizationMiddleware, specialtyController.allspecialties);
router.delete('/specialties/:id(\\d+)', specialtyController.deleteSpecialty);
//      Users
router.post('/new-user', authorizationMiddleware, validator(userSchema), userController.newUser);
router.get('/members/:id(\\d+)', authorizationMiddleware, userController.oneMember);
router.get('/coachs/:id(\\d+)', userController.oneCoach);
router.patch('/users/:id(\\d+)', authorizationMiddleware, validator(userSchema), userController.editUser);
router.delete('/users/:id(\\d+)', userController.deleteUser);
//      Coachings
router.post('/new-coachings', authorizationMiddleware, validator(coachingTimePeriodSchema), coachingController.addCoachings);
router.get('/coaching/:id(\\d+)', authorizationMiddleware, coachingController.findACoachingById);
router.delete('/coaching/:id(\\d+)', coachingController.deleteACoachingByPk);

// ALL USERS ROUTES
router.get('/coachs',authorizationMiddleware, userController.allCoachs);

// INVALID TOKEN
router.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
      console.log('401 UNAUTHORIZED - Invalid Token');
      res.status(401).json('Invalid token');
    }
  })

  //! 404 - to do


module.exports = router;