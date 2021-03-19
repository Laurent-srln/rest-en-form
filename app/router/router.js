const express = require('express');
const router = express.Router();

// TOKEN AUTHENTIFICATION MIDDLEWARE
const authorizationMiddleware = require('../services/authorizationMiddleware');
const validCoach = require('../services/validCoach');
const validMember = require('../services/validMember');
const validOwner = require('../services/validOwner');

// JOI VALIDATION MIDDLEWARE
const validator = require('../services/validator');

// JOI SCHEMAS
const workoutSchema = require('../schemas/workout');
const userSchema = require('../schemas/user');
const specialtySchema = require('../schemas/specialty');
const setPasswordSchema = require('../schemas/setPassword');
const newPasswordSchema = require('../schemas/newPassword');
const loginSchema = require('../schemas/login');
const commentSchema = require('../schemas/comment');
const coachingTimePeriodSchema = require('../schemas/coachingTimePeriod');

// CONTROLLERS
const userController = require('../controllers/userController');
const workoutController = require('../controllers/workoutController');
const commentController = require('../controllers/commentController');
const coachingController = require('../controllers/coachingController');
const authController = require('../controllers/authController');
const healthController = require('../controllers/healthController');
const specialtyController = require('../controllers/specialtyController');
const mainController = require('../controllers/mainController');

/**
 * @swagger
 * tags:
 *  - name: LOGIN ROUTES
 *    description: Routes for authentication
 *  - name: MEMBERS ROUTES
 *    description: Routes for users logged in as members
 *  - name: Members - Workouts & Health Data
 *  - name: Members - Coachings
 *  - name: COACHS ROUTES
 *    description: Routes for users logged in as coach
 *  - name: Coachs - Workouts & Comments
 *  - name: Coachs - Coachings
 *  - name: Coachs - Members
 *  - name: OWNER ROUTES
 *    description: Routes for users logged in as owner
 *  - name: Owner - Specialties
 *  - name: Owner - Users
 *  - name: Owner - Coachings
 *  - name: ALL USERS ROUTES
 *    description: Routes for all users
 */


/**
 * @swagger
 * components:
 *  schemas:
 *      newWorkout:
 *          type: object
 *          required:
 *              - date
 *              - content
 *              - weight
 *              - muscleMass
 *              - fatMass
 *              - boneMass
 *              - bodyWater
 *          properties:
 *              date:
 *                  type: string
 *                  description: The date of the workout
 *              content:
 *                  type: string
 *                  description: The description of the workout
 *              weight:
 *                  type: integer
 *                  description: The body weight of the member
 *              muscleMass:
 *                  type: integer
 *                  description: The percentage of muscle mass
 *              fatMass:
 *                  type: integer
 *                  description: The percentage of fat mass
 *              boneMass:
 *                  type: integer
 *                  description: The percentage of bone mass
 *              bodyWater:
 *                  type: integer
 *                  description: The percentage of body water
 *          example:
 *            date: '2021-02-06'
 *            content: 'Description of the workout'
 *            weight: 80
 *            muscleMass: 85
 *            fatMass: 10
 *            boneMass: 5
 *            bodyWater: 60
 *      workout:
 *          type: object
 *          required:
 *              - id
 *              - date
 *              - description
 *              - createdAt
 *              - updatedAt
 *              - memberId
 *              - memberFirstname
 *              - memberLastname
 *              - weight
 *              - muscleMass
 *              - fatMass
 *              - boneMass
 *              - bodyWater
 *              - commentCoachId
 *              - commentCoachFirstname
 *              - commentCoachLastname
 *              - commentContent
 *              - commentDate
 *          properties:
 *              id:
 *                  type: integer
 *                  description: The id of the workout
 *              date:
 *                  type: string
 *                  description: The date of the workout
 *              description:
 *                  type: string
 *                  description: The description of the workout
 *              createdAt:
 *                  type: string
 *                  description: The creation date of the workout
 *              updatedAt:
 *                  type: string
 *                  description: The last modification date of the workout
 *              memberId:
 *                  type: integer
 *                  description: The id of the member linked to the workout
 *              memberFirstname:
 *                  type: string
 *                  description: The firstname of the member
 *              memberLastname:
 *                  type: string
 *                  description: The lastname of the member
 *              weight:
 *                  type: integer
 *                  description: The body weight of the member
 *              muscleMass:
 *                  type: integer
 *                  description: The percentage of muscle mass
 *              fatMass:
 *                  type: integer
 *                  description: The percentage of fat mass
 *              boneMass:
 *                  type: integer
 *                  description: The percentage of bone mass
 *              bodyWater:
 *                  type: integer
 *                  description: The percentage of body water
 *              commentCoachId:
 *                  type: integer
 *                  description: The id of the coach who wrote the comment linked to the workout
 *              commentCoachFirstname:
 *                  type: string
 *                  description: The firstname of the coach
 *              commentCoachLastname:
 *                  type: string
 *                  description: The lastname of the coach
 *              commentContent:
 *                  type: string
 *                  description: The content of the comment
 *              commentDate:
 *                  type: string
 *                  description: The date of the comment
 *          example:
 *            id:
 *            date: '2021-02-06'
 *            description: 'Description of the workout'
 *            createdAt: '2021-02-06'
 *            updatedAt: null
 *            memberId: 1
 *            memberFirstname: 'Mathilde'
 *            memberLastname: 'Martin'
 *            weight: 60
 *            muscleMass: 80
 *            fatMass: 10
 *            boneMass: 10
 *            bodyWater: 60
 *            commentCoachId: 2
 *            commentCoachFirstname: 'Gwenaël'
 *            commentCoachLastname: 'Dupont'
 *            commentContent: 'Comment about the workout & the health data'
 *            commentDate: '2021-02-07'
 *      healtData:
 *          type: object
 *          required:
 *              - id
 *              - createdAt
 *              - updatedAt
 *              - workoutId
 *              - workoutDate
 *              - weight
 *              - muscleMass
 *              - fatMass
 *              - boneMass
 *              - bodyWater
 *              - memberId
 *              - memberFirstname
 *              - memberLastname
 *          properties:
 *              id:
 *                  type: integer
 *                  description: The id of the healthData
 *              createdAt:
 *                  type: string
 *                  description: The creation date of the healthData
 *              updatedAt:
 *                  type: string
 *                  description: The last modification date of the healthData
 *              workoutId:
 *                  type: integer
 *                  description: The id of the workout linked to the healthData
 *              workoutDate:
 *                  type: string
 *                  description: The date of the workout
 *              weight:
 *                  type: integer
 *                  description: The body weight of the member
 *              muscleMass:
 *                  type: integer
 *                  description: The percentage of muscle mass
 *              fatMass:
 *                  type: integer
 *                  description: The percentage of fat mass
 *              boneMass:
 *                  type: integer
 *                  description: The percentage of bone mass
 *              bodyWater:
 *                  type: integer
 *                  description: The percentage of body water
 *              memberId:
 *                  type: integer
 *                  description: The id of the member linked to the workout
 *              memberFirstname:
 *                  type: string
 *                  description: The firstname of the member
 *              memberLastname:
 *                  type: string
 *                  description: The lastname of the member
 *          example:
 *            id: 1
 *            createdAt: '2021-02-06'
 *            updatedAt: null
 *            workoutId: 1
 *            workoutDate: '2021-02-06'
 *            weight: 80
 *            muscleMass: 85
 *            fatMass: 10
 *            boneMass: 5
 *            bodyWater: 60
 *            memberId: 1
 *            memberFirstname: 'Mathilde'
 *            memberLastname: 'Martin'
 *      coaching:
 *          type: object
 *          required:
 *              - id
 *              - startTime
 *              - endTime
 *              - coachId
 *              - coachFirstname
 *              - coachLastname
 *              - memberId
 *              - memberFirstname
 *              - memberLastname
 *              - createdAt
 *              - updatedAt
 *          properties:
 *              id:
 *                  type: integer
 *                  description: The id of the coaching
 *              startTime:
 *                  type: string
 *                  description: The start date and start time 
 *              endTime:
 *                  type: string
 *                  description: The end date and end time 
 *              commentCoachId:
 *                  type: integer
 *                  description: The id of the coach
 *              commentCoachFirstname:
 *                  type: string
 *                  description: The firstname of the coach
 *              commentCoachLastname:
 *                  type: string
 *                  description: The lastname of the coach
 *              memberId:
 *                  type: integer
 *                  description: The id of the member who booked
 *              memberFirstname:
 *                  type: string
 *                  description: The firstname of the member
 *              memberLastname:
 *                  type: string
 *                  description: The lastname of the member
 *              createdAt:
 *                  type: string
 *                  description: The creation date of the coaching
 *              updatedAt:
 *                  type: string
 *                  description: The last modification date of the coaching
 *          example:
 *            id: 1
 *            startTime: '2021-04-05T08:00:00.000Z'
 *            endTime: '2021-04-05T08:15:00.000Z'
 *            coachId: 2
 *            coachFirstname: 'Sountid'
 *            coachLastname: 'Chan'
 *            memberId: 1
 *            memberFirstname: 'Julien'
 *            memberLastname: 'Laurent'
 *            createdAt: '2021-03-06T18:49:50.479Z'
 *            updatedAt: '2021-04-01T11:36:27.436Z'
 *      comment:
 *          type: object
 *          required:
 *              - id
 *              - content
 *              - coachId
 *              - coachFirstname
 *              - coachLastname
 *              - workoutId
 *              - createdAt
 *              - updatedAt
 *          properties:
 *              id:
 *                  type: integer
 *                  description: The id of the comment
 *              commentCoachId:
 *                  type: integer
 *                  description: The id of the coach
 *              commentCoachFirstname:
 *                  type: string
 *                  description: The firstname of the coach
 *              commentCoachLastname:
 *                  type: string
 *                  description: The lastname of the coach
 *              workoutId:
 *                  type: integer
 *                  description: The id of the workout linked to the comment
 *              createdAt:
 *                  type: string
 *                  description: The creation date of the comment
 *              updatedAt:
 *                  type: string
 *                  description: The last modification date of the comment
 *          example:
 *            id: 1
 *            coachId: 2
 *            coachFirstname: 'Sountid'
 *            coachLastname: 'Chan'
 *            workoutId: 1
 *            createdAt: '2021-03-06T18:49:50.479Z'
 *            updatedAt: '2021-04-01T11:36:27.436Z'
 *      specialty:
 *          type: object
 *          required:
 *              - id
 *              - name
 *              - createdAt
 *              - updatedAt
 *          properties:
 *              id:
 *                  type: integer
 *                  description: The id of the comment
 *              name:
 *                  type: string
 *                  description: The name of the specialty
 *              createdAt:
 *                  type: string
 *                  description: The creation date of the specialty
 *              updatedAt:
 *                  type: string
 *                  description: The last modification date of the specialty
 *          example:
 *            id: 1
 *            name: 'Haltérophilie'
 *            createdAt: '2021-03-06T18:49:50.479Z'
 *            updatedAt: '2021-04-01T11:36:27.436Z'
 *      newMember:
 *          type: object
 *          required:
 *              - firstname
 *              - lastname
 *              - email
 *              - role
 *          properties:
 *              firstname:
 *                  type: string
 *                  description: The firstname of the member
 *              lastname:
 *                  type: string
 *                  description: The lastname of the member
 *              email:
 *                  type: string
 *                  description: The email of the member
 *              role:
 *                  type: string
 *                  description: The role
 *          example:
 *            firstname: 'Mathilde'
 *            lastname: 'Martin'
 *            email: 'mathilde.martin@gmail.com'
 *            role: 'MEMBER'
 *      member:
 *          type: object
 *          required:
 *              - id
 *              - firstname
 *              - lastname
 *              - email
 *              - role
 *              - createdAt
 *              - updatedAt
 *          properties:
 *              id:
 *                  type: integer
 *                  description: The id of the member
 *              firstname:
 *                  type: string
 *                  description: The firstname of the member
 *              lastname:
 *                  type: string
 *                  description: The lastname of the member
 *              email:
 *                  type: string
 *                  description: The email of the member
 *              role:
 *                  type: string
 *                  description: The role
 *              createdAt:
 *                  type: string
 *                  description: The creation date of the member
 *              updatedAt:
 *                  type: string
 *                  description: The last modification date of the member
 *          example:
 *            id: 1
 *            firstname: 'Mathilde'
 *            lastname: 'Martin'
 *            email: 'mathilde.martin@gmail.com'
 *            role: 'MEMBER'
 *            createdAt: '2021-03-15T18:49:50.479Z'
 *            updatedAt: '2021-03-22T11:36:27.436Z'
 *      newCoach:
 *          type: object
 *          required:
 *              - firstname
 *              - lastname
 *              - email
 *              - role
 *          properties:
 *              firstname:
 *                  type: string
 *                  description: The firstname of the coach
 *              lastname:
 *                  type: string
 *                  description: The lastname of the coach
 *              email:
 *                  type: string
 *                  description: The email of the coach
 *              role:
 *                  type: string
 *                  description: The role
 *              specialties:
 *                  type: array
 *                  items:
 *                      type: integer
 *                  description: The specialties of the coach
 *          example:
 *            firstname: 'Sountid'
 *            lastname: 'Dupont'
 *            email: 'sountid.dupont@gmail.com'
 *            role: 'COACH'
 *            specialties: [1, 3, 6]
 *      coach:
 *          type: object
 *          required:
 *              - id
 *              - firstname
 *              - lastname
 *              - email
 *              - role
 *              - createdAt
 *              - updatedAt
 *          properties:
 *              id:
 *                  type: integer
 *                  description: The id of the coach
 *              firstname:
 *                  type: string
 *                  description: The firstname of the coach
 *              lastname:
 *                  type: string
 *                  description: The lastname of the coach
 *              email:
 *                  type: string
 *                  description: The email of the coach
 *              role:
 *                  type: string
 *                  description: The role of the coach
 *              specialties:
 *                  type: array
 *                  items:
 *                      type: integer
 *                  description: The specialties of the coach
 *              createdAt:
 *                  type: string
 *                  description: The creation date of the coach
 *              updatedAt:
 *                  type: string
 *                  description: The last modification date of the coach
 *          example:
 *            id: 1
 *            firstname: 'Sountid'
 *            lastname: 'Dupont'
 *            email: 'sountid.dupont@gmail.com'
 *            role: 'COACH'
 *            specialties: [1, 3, 6]
 *            createdAt: '2021-03-15T18:49:50.479Z'
 *            updatedAt: '2021-03-22T11:36:27.436Z'
 *  securitySchemes:
 *      bearerAuth:
 *          type: apiKey
 *          name: Authorization
 *          in: header
 *          bearerFormat: JWT
 */


// CONNEXION ROUTES
/**
 * @swagger
 * /register:
 *      post:
 *          summary: Register a new password for the user 
 *          tags: [LOGIN ROUTES]
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          required:
 *                              - paswword
 *                              - confirm
 *                          properties: 
 *                              password:
 *                                  type: string
 *                                  description: The new password of the user
 *                              confirm:
 *                                  type: string
 *                                  description: The new password of the user
 *                          example:
 *                              password: '1Password!'
 *                              confirm: '1Password!'
 */
router.post('/register', validator(setPasswordSchema), authController.setPassword);
/**
 * @swagger
 * /forgotten-password:
 *      post:
 *          summary: Generate a password reset link and send it to the user
 *          tags: [LOGIN ROUTES]
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          required:
 *                              - email
 *                          properties: 
 *                              email:
 *                                  type: string
 *                                  description: The email of the user
 *                          example:
 *                              email: 'gwenaël.dupont@gmail.com'
 */
router.post('/forgotten-password', validator(newPasswordSchema), authController.getNewToken);
/**
 * @swagger
 * /login:
 *      post:
 *          summary: Log in to the site 
 *          tags: [LOGIN ROUTES]
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          required:
 *                              - email
 *                              - paswword
 *                          properties: 
 *                              email:
 *                                  type: string
 *                                  description: The email of the user
 *                              password:
 *                                  type: string
 *                                  description: The password of the user
 *                          example:
 *                              email: 'gwenaël.dupont@gmail.com'
 *                              password: '1Password!'
 */
router.post('/login', validator(loginSchema), authController.submitLogin);

// MEMBERS ROUTES
//      Workout & Health data

/**
 * @swagger
 * /new-workout:
 *      post:
 *          summary: Create a workout for the logged member
 *          tags: [Members - Workouts & Health Data]
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#components/schemas/newWorkout'
 *          security:
 *              - bearerAuth: []
 *          responses:
 *              200:
 *                  description: The workout was succesfully created
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              items:
 *                                  $ref: '#/components/schemas/newWorkout'
 */
router.post('/new-workout',authorizationMiddleware, validMember, validator(workoutSchema), workoutController.addWorkout);



/**
 * @swagger
 * /workouts:
 *      get:
 *          summary: Returns all the workouts of the logged in member
 *          tags: [Members - Workouts & Health Data]
 *          security:
 *              - bearerAuth: []
 *          responses:
 *              200:
 *                  description: The list of all the workouts of a member
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              items:
 *                                  $ref: '#/components/schemas/workout'
 */
router.get('/workouts', authorizationMiddleware, validMember, workoutController.getAllWorkoutsByMemberId);
/**
 * @swagger
 * /health:
 *      get:
 *          summary: Return all the healtd data records of the logged in member
 *          tags: [Members - Workouts & Health Data]
 *          security:
 *              - bearerAuth: []
 * */
router.get('/health', authorizationMiddleware, validMember, healthController.getAllHealthRecordsByMemberId);
/**
 * @swagger
 * /edit-workout/{workoutId}:
 *      patch:
 *          summary: Modifies the workout indicated in parameter
 *          tags: [Members - Workouts & Health Data]
 *          parameters:
 *              - in: path
 *                name: workoutId
 *                schema:
 *                      type: string
 *                required: true
 *                description: The workout id
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#components/schemas/newWorkout'
 *          security:
 *              - bearerAuth: []
 * */
router.patch('/edit-workout/:workoutId', authorizationMiddleware, validMember, workoutController.editWorkout);
/**
 * @swagger
 * /delete-workout/{workoutId}:
 *      delete:
 *          summary: Delete the workout indicated in parameter
 *          tags: [Members - Workouts & Health Data]
 *          parameters:
 *              - in: path
 *                name: workoutId
 *                schema:
 *                      type: string
 *                required: true
 *                description: The workout id
 *          security:
 *              - bearerAuth: []
 * */
router.delete('/delete-workout/:workoutId', authorizationMiddleware, validMember, workoutController.deleteWorkout);
//     Coachings
/**
 * @swagger
 * /available-coachings:
 *      get:
 *          summary: Return the coachings still available for booking
 *          tags: [Members - Coachings]
 *          security:
 *              - bearerAuth: []
 * */
router.get('/available-coachings', authorizationMiddleware, validMember, coachingController.getAvailableCoachings);
/**
 * @swagger
 * /member-next-bookings:
 *      get:
 *          summary: Return the next bookings of the logged in member
 *          tags: [Members - Coachings]
 *          security:
 *              - bearerAuth: []
 * */
router.get('/member-next-bookings',authorizationMiddleware, validMember, coachingController.getMemberNextBookingsByTokenId);
/**
 * @swagger
 * /book-coaching:
 *      patch:
 *          summary: Modifie the coaching indicated in the body to add the member_id
 *          tags: [Members - Coachings]
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          required:
 *                              - coachingId
 *                          properties: 
 *                              coachingId:
 *                                  type: string
 *                                  description: The id of the coaching
 *                          example:
 *                              coachingId: 10
 *          security:
 *              - bearerAuth: []
 * */
router.patch('/book-coaching',authorizationMiddleware, validMember, coachingController.addBooking);
/**
 * @swagger
 * /bookings/{coachingId}/delete:
 *      patch:
 *          summary: Modifie the coaching indicated in the parameter to remove the member_id
 *          tags: [Members - Coachings]
 *          parameters:
 *              - in: path
 *                name: coachingId
 *                schema:
 *                      type: string
 *                required: true
 *                description: The coaching id
 *          security:
 *              - bearerAuth: []
 * */
router.patch('/bookings/:coachingId/delete',authorizationMiddleware, validMember, coachingController.deleteBooking);

// COACHS ROUTES
//      Workout & Comments
/**
 * @swagger
 * /new-comment/{workoutId}:
 *      post:
 *          summary: Add a new comment linked to the workout indicated in parameter
 *          tags: [Coachs - Workouts & Comments]
 *          parameters:
 *              - in: path
 *                name: workoutId
 *                schema:
 *                      type: string
 *                required: true
 *                description: The workout id
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          required:
 *                              - content
 *                          properties: 
 *                              content:
 *                                  type: string
 *                                  description: The content of the comment
 *                          example:
 *                              content: 'The content of the comment'
 *          security:
 *              - bearerAuth: []
 * */
router.post('/new-comment/:workoutId',authorizationMiddleware, validCoach, validator(commentSchema), commentController.addComment);

/**
 * @swagger
 * /members/{id}/workouts:
 *      get:
 *          summary: Returns the workouts of a member
 *          tags: [Coachs - Workouts & Comments]
 *          parameters:
 *              - in: path
 *                name: id
 *                schema:
 *                      type: string
 *                required: true
 *                description: The member id
 *          security:
 *              - bearerAuth: []
 *          responses:
 *              200:
 *                  description: The workouts of a member
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              items:
 *                                  $ref: '#/components/schemas/workout'
 */
router.get('/members/:id(\\d+)/workouts', authorizationMiddleware, validCoach, workoutController.getMemberWorkoutsByParamsId); 
/**
 * @swagger
 * /edit-comment/{commentId}:
 *      patch:
 *          summary: Modifies the comment indicated in parameter
 *          tags: [Coachs - Workouts & Comments]
 *          parameters:
 *              - in: path
 *                name: commentId
 *                schema:
 *                      type: string
 *                required: true
 *                description: The comment id
 *          security:
 *              - bearerAuth: []
 * */
router.patch('/edit-comment/:commentId',authorizationMiddleware, validCoach, validator(commentSchema), commentController.editComment);
/**
 * @swagger
 * /delete-comment/{commentId}:
 *      delete:
 *          summary: Delete the comment indicated in parameter
 *          tags: [Coachs - Workouts & Comments]
 *          parameters:
 *              - in: path
 *                name: commentId
 *                schema:
 *                      type: string
 *                required: true
 *                description: The comment id
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          required:
 *                              - content
 *                          properties: 
 *                              content:
 *                                  type: string
 *                                  description: The new content of the comment
 *                          example:
 *                              content: 'The new content of the comment'
 *          security:
 *              - bearerAuth: []
 * */
router.delete('/delete-comment/:commentId',authorizationMiddleware, validCoach, commentController.deleteComment);
//      Coachings
/**
 * @swagger
 * /coach-next-bookings:
 *      get:
 *          summary: Returns the next coachings booked with the logged in coach
 *          tags: [Coachs - Coachings]
 *          security:
 *              - bearerAuth: []
 */
router.get('/coach-next-bookings',authorizationMiddleware, validCoach, coachingController.getCoachNextBookings);
/**
 * @swagger
 * /coach-last-bookings:
 *      get:
 *          summary: Returns the last coachings booked with the logged in coach
 *          tags: [Coachs - Coachings]
 *          security:
 *              - bearerAuth: []
 */
router.get('/coach-last-bookings',authorizationMiddleware, validCoach, coachingController.getCoachLastBookings);
/**
 * @swagger
 * /members/{id}/next-bookings:
 *      get:
 *          summary: Returns the next coachings booked of the member indicated in the parameter
 *          tags: [Coachs - Coachings]
 *          parameters:
 *              - in: path
 *                name: id
 *                schema:
 *                      type: string
 *                required: true
 *                description: The member id
 *          security:
 *              - bearerAuth: []
 */
router.get('/members/:id(\\d+)/next-bookings', authorizationMiddleware, validCoach, coachingController.getMemberNextBookingsByParamsId);
//      Members
/**
 * @swagger
 * /members:
 *      get:
 *          summary: Returns the list of all the members
 *          tags: [Coachs - Members]
 *          security:
 *              - bearerAuth: []
 */
router.get('/members', authorizationMiddleware, userController.getAllMembers);

// OWNER ROUTES
//      Specialties
/**
 * @swagger
 * /specialties:
 *      post:
 *          summary: Add a new specialty
 *          tags: [Owner - Specialties]
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          required:
 *                              - name
 *                          properties: 
 *                              name:
 *                                  type: string
 *                                  description: The name of the new specialty
 *                          example:
 *                              name: 'Specialty'
 *          security:
 *              - bearerAuth: []
 */
router.post('/specialties', authorizationMiddleware, validOwner, validator(specialtySchema), specialtyController.addSpecialty);
/**
 * @swagger
 * /specialties:
 *      get:
 *          summary: Returns the list of all specialties
 *          tags: [Owner - Specialties]
 *          security:
 *              - bearerAuth: []
 */
router.get('/specialties', authorizationMiddleware, validOwner, specialtyController.getAllSpecialties);
/**
 * @swagger
 * /specialties/{id]}:
 *      delete:
 *          summary: Delete the specialty indicated in the parameter
 *          tags: [Owner - Specialties]
 *          parameters:
 *              - in: path
 *                name: id
 *                schema:
 *                      type: string
 *                required: true
 *                description: The specialty id
 *          security:
 *              - bearerAuth: []
 */
router.delete('/specialties/:id(\\d+)', authorizationMiddleware, validOwner, specialtyController.deleteSpecialty);
//      Users
/**
 * @swagger
 * /new-user:
 *      post:
 *          summary: Add a new user and his specialties if it is a coach
 *          tags: [Owner - Users]
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          anyOf:
 *                              - $ref: '#components/schemas/newCoach'
 *                              - $ref: '#components/schemas/newMember'
 *          security:
 *              - bearerAuth: []
 */
router.post('/new-user', authorizationMiddleware, validOwner, validator(userSchema), userController.addUser);
/**
 * @swagger
 * /members/{id}:
 *      get:
 *          summary: Returns the member whose id is specified in parameter
 *          tags: [Owner - Users]
 *          parameters:
 *              - in: path
 *                name: id
 *                schema:
 *                      type: string
 *                required: true
 *                description: The member id
 *          security:
 *              - bearerAuth: []
 */
router.get('/members/:id(\\d+)', authorizationMiddleware, validOwner, userController.getMemberById);
/**
 * @swagger
 * /coachs/{id}:
 *      get:
 *          summary: Returns the coach whose id is specified in parameter
 *          tags: [Owner - Users]
 *          parameters:
 *              - in: path
 *                name: id
 *                schema:
 *                      type: string
 *                required: true
 *                description: The coach id
 *          security:
 *              - bearerAuth: []
 */
router.get('/coachs/:id(\\d+)', authorizationMiddleware, validOwner, userController.getCoachById);
/**
 * @swagger
 * /users/{id}:
 *      patch:
 *          summary: Modifies the user whose id is specified in parameter
 *          tags: [Owner - Users]
 *          parameters:
 *              - in: path
 *                name: id
 *                schema:
 *                      type: string
 *                required: true
 *                description: The user id
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                        type: object
 *                        required:
 *                            - firstname
 *                            - lastname
 *                            - email
 *                        properties:
 *                            firstname:
 *                                type: string
 *                                description: The firstname of the user
 *                            lastname:
 *                                type: string
 *                                description: The lastname of the user
 *                            email:
 *                                type: string
 *                                description: The email of the user
 *                            specialties:
 *                                type: array
 *                                items:
 *                                    type: integer
 *                                description: The specialties of the coach
 *                        example:
 *                          firstname: 'Sountid'
 *                          lastname: 'Dupont'
 *                          email: 'sountid.dupont@gmail.com'
 *                          specialties: [1, 3, 6]
 *          security:
 *              - bearerAuth: []
 */
router.patch('/users/:id(\\d+)', authorizationMiddleware, validOwner,userController.editUser);
/**
 * @swagger
 * /users/{id}:
 *      delete:
 *          summary: Delete the user whose id is specified in parameter
 *          tags: [Owner - Users]
 *          parameters:
 *              - in: path
 *                name: id
 *                schema:
 *                      type: string
 *                required: true
 *                description: The user id
 *          security:
 *              - bearerAuth: []
 */
router.delete('/users/:id(\\d+)', authorizationMiddleware, validOwner, userController.deleteUser);
//      Coachings
/**
 * @swagger
 * /new-coachings:
 *      post:
 *          summary: Add new 15 minutes coaching slots
 *          tags: [Owner - Coachings]
 *          security:
 *              - bearerAuth: []
 */
router.post('/new-coachings', authorizationMiddleware, validOwner, validator(coachingTimePeriodSchema), coachingController.addCoachings);
/**
 * @swagger
 * /coachings:
 *      get:
 *          summary: Returns all the coaching slots
 *          tags: [Owner - Coachings]
 *          security:
 *              - bearerAuth: []
 */
router.get('/coachings', authorizationMiddleware, validOwner, coachingController.getAllCoachings);
/**
 * @swagger
 * /coachings/{id}:
 *      get:
 *          summary: Returns the coaching whose id is specified in parameter
 *          tags: [Owner - Coachings]
 *          parameters:
 *              - in: path
 *                name: id
 *                schema:
 *                      type: string
 *                required: true
 *                description: The coaching id
 *          security:
 *              - bearerAuth: []
 */
router.get('/coaching/:id(\\d+)', authorizationMiddleware, validOwner, coachingController.getCoachingById);
/**
 * @swagger
 * /coachings/{id}:
 *      delete:
 *          summary: Delete the coaching whose id is specified in parameter
 *          tags: [Owner - Coachings]
 *          parameters:
 *              - in: path
 *                name: id
 *                schema:
 *                      type: string
 *                required: true
 *                description: The coaching id
 *          security:
 *              - bearerAuth: []
 */
router.delete('/coaching/:id(\\d+)', authorizationMiddleware, validOwner, coachingController.deleteCoachingById);

// ALL USERS ROUTES
/**
 * @swagger
 * /coachs:
 *      get:
 *          summary: Returns all the coachs
 *          tags: [ALL USERS ROUTES]
 *          security:
 *              - bearerAuth: []
 *          responses:
 *              200:
 *                  description: All the coachs
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              items:
 *                                  $ref: '#/components/schemas/coach'
 */
router.get('/coachs',authorizationMiddleware, userController.getAllCoachs);

// INVALID TOKEN
router.use(mainController.invalidToken);

//404 NOT FOUND
router.use(mainController.notFound);

module.exports = router;