const express = require('express');
const router = express.Router();

// TOKEN AUTHENTIFICATION MIDDLEWARE
const authorizationMiddleware = require('./services/authorizationMiddleware');
const validCoach = require('./services/validCoach');
const validMember = require('./services/validMember');
const validOwner = require('./services/validOwner');

// JOI VALIDATION MIDDLEWARE
const validator = require('./services/validator');

// JOI SCHEMAS
const workoutSchema = require('./schemas/workout');
const userSchema = require('./schemas/user');
const specialtySchema = require('./schemas/specialty');
const setPasswordSchema = require('./schemas/setPassword');
const newPasswordSchema = require('./schemas/newPassword');
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
const mainController = require('./controllers/mainController');


// CONNEXION ROUTES
router.post('/register', validator(setPasswordSchema), authController.setPassword);
router.post('/forgotten-password', validator(newPasswordSchema), authController.getNewToken);
router.post('/login', validator(loginSchema), authController.submitLogin);

// MEMBERS ROUTES
//      Workout & Health data
router.post('/new-workout',authorizationMiddleware, validMember, validator(workoutSchema), workoutController.addWorkout);
router.get('/workouts', authorizationMiddleware, validMember, workoutController.getAllWorkoutsByMemberId);
router.get('/health', authorizationMiddleware, validMember, healthController.getAllHealthRecordsByMemberId);
router.patch('/edit-workout/:workoutId', authorizationMiddleware, validMember, workoutController.editWorkout);
router.delete('/delete-workout/:workoutId', authorizationMiddleware, validMember, workoutController.deleteWorkout);
//     Coachings
router.get('/available-coachings', authorizationMiddleware, validMember, coachingController.getAvailableCoachings);
router.get('/member-next-bookings',authorizationMiddleware, validMember, coachingController.getMemberNextBookingsByTokenId);
router.post('/book-coaching',authorizationMiddleware, validMember, coachingController.addBooking);
router.patch('/bookings/:coachingId/delete',authorizationMiddleware, validMember, coachingController.deleteBooking);

// COACHS ROUTES
//      Workout & Comments
router.post('/new-comment/:workoutId',authorizationMiddleware, validCoach, validator(commentSchema), commentController.addComment);
router.get('/members/:id(\\d+)/workouts', authorizationMiddleware, validCoach, workoutController.getMemberWorkoutsByParamsId); 
router.patch('/edit-comment/:commentId',authorizationMiddleware, validCoach, validator(commentSchema), commentController.editComment);
router.delete('/delete-comment/:commentId',authorizationMiddleware, validCoach, commentController.deleteComment);
//      Coachings
router.get('/coach-next-bookings',authorizationMiddleware, validCoach, coachingController.getCoachNextBookings);
router.get('/coach-last-bookings',authorizationMiddleware, validCoach, coachingController.getCoachLastBookings);
router.get('/members/:id(\\d+)/next-bookings', authorizationMiddleware, validCoach, coachingController.getMemberNextBookingsByParamsId);
//      Members
router.get('/members', authorizationMiddleware, userController.getAllMembers);

// OWNER ROUTES
//      Specialties
router.post('/specialties', authorizationMiddleware, validOwner, validator(specialtySchema), specialtyController.addSpecialty);
router.get('/specialties', authorizationMiddleware, validOwner, specialtyController.getAllSpecialties);
router.delete('/specialties/:id(\\d+)', authorizationMiddleware, validOwner, specialtyController.deleteSpecialty);
//      Users
router.post('/new-user', authorizationMiddleware, validOwner, validator(userSchema), userController.addUser);
router.get('/members/:id(\\d+)', authorizationMiddleware, validOwner, userController.getMemberById);
router.get('/coachs/:id(\\d+)', authorizationMiddleware, validOwner, userController.getCoachById);
router.patch('/users/:id(\\d+)', authorizationMiddleware, validOwner,userController.editUser);
router.delete('/users/:id(\\d+)', authorizationMiddleware, validOwner, userController.deleteUser);
//      Coachings
router.post('/new-coachings', authorizationMiddleware, validOwner, validator(coachingTimePeriodSchema), coachingController.addCoachings);
router.get('/coaching/:id(\\d+)', authorizationMiddleware, validOwner, coachingController.getCoachingById);
router.delete('/coaching/:id(\\d+)', authorizationMiddleware, validOwner, coachingController.deleteCoachingById);

// ALL USERS ROUTES
router.get('/coachs',authorizationMiddleware, userController.getAllCoachs);

// INVALID TOKEN
router.use(mainController.invalidToken);

//404 NOT FOUND
router.use(mainController.notFound);

module.exports = router;