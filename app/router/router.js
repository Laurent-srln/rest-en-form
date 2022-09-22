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
const testDataController = require('../controllers/testDataController');

/**
 * @swagger
 * tags:
 *  - name: RESET APP
 *    description: 
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
 *            id: 1
 *            date: '2021-02-06'
 *            description: 'Description of the workout'
 *            createdAt: '2021-02-06'
 *            updatedAt: null
 *            memberId: 2
 *            memberFirstname: 'John'
 *            memberLastname: 'Doe'
 *            weight: 80
 *            muscleMass: 80
 *            fatMass: 10
 *            boneMass: 10
 *            bodyWater: 60
 *            commentCoachId: 4
 *            commentCoachFirstname: 'Alex'
 *            commentCoachLastname: 'Térieur'
 *            commentContent: 'Comment about the workout & the health data'
 *            commentDate: '2021-02-07'
 *      healthData:
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
 *            memberId: 2
 *            memberFirstname: 'John'
 *            memberLastname: 'Doe'
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
 *              coachId:
 *                  type: integer
 *                  description: The id of the coach
 *              coachFirstname:
 *                  type: string
 *                  description: The firstname of the coach
 *              coachLastname:
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
 *            coachId: 4
 *            coachFirstname: 'Alex'
 *            coachLastname: 'Térieur'
 *            memberId: 2
 *            memberFirstname: 'John'
 *            memberLastname: 'Doe'
 *            createdAt: '2021-03-06T18:49:50.479Z'
 *            updatedAt: '2021-04-01T11:36:27.436Z'
 *      availableCoaching:
 *          type: object
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
 *              coachId:
 *                  type: integer
 *                  description: The id of the coach
 *              coachFirstname:
 *                  type: string
 *                  description: The firstname of the coach
 *              coachLastname:
 *                  type: string
 *                  description: The lastname of the coach
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
 *            coachId: 4
 *            coachFirstname: 'Alex'
 *            coachLastname: 'Térieur'
 *            createdAt: '2021-03-06T18:49:50.479Z'
 *            updatedAt: null
 *      newCoaching:
 *          type: object
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
 *              coachId:
 *                  type: integer
 *                  description: The id of the coach
 *              memberId:
 *                  type: integer
 *                  description: The id of the member
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
 *            coachId: 4
 *            memberId: null
 *            createdAt: '2021-03-06T18:49:50.479Z'
 *            updatedAt: null
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
 *            coachId: 4
 *            coachFirstname: 'Alex'
 *            coachLastname: 'Térieur'
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
 *            firstname: 'Juliette'
 *            lastname: 'Laborde'
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
 *            firstname: 'Martin'
 *            lastname: 'Durand'
 *            email: 'member3@gmail.com'
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
 *            firstname: 'Fabien'
 *            lastname: 'Galthier'
 *            email: 'f.galthier@gmail.com'
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
 *            firstname: 'Alex'
 *            lastname: 'Térieur'
 *            email: 'alex.terieur@gmail.com'
 *            role: 'COACH'
 *            specialties: [1, 3, 6]
 *            createdAt: '2021-03-15T18:49:50.479Z'
 *            updatedAt: '2021-03-22T11:36:27.436Z'
 *      error(400):
 *          type: object
 *          properties:
 *              message:
 *                  type: string
 *                  description: Details of the error
 *          example:
 *            message: "Le message détaillant l'erreur."
 *  securitySchemes:
 *      bearerAuth:
 *          type: apiKey
 *          name: Authorization
 *          in: header
 *          bearerFormat: JWT
 */

// RESET ROUTE
/**
 * @swagger
 * /reset:
 *      post:
 *          summary: Reset app with initial test data
 *          tags: [RESET APP]
 *          responses:
 *              200:
 *                  description: App reset with initial data
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  message:
 *                                      type: string
 *                              example:
 *                                  message: "L'application a bien été réinitialisée."
 *              400:
 *                  description: Bad request
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/error(400)'
 */
router.post('/reset', testDataController.resetApp);


// CONNEXION ROUTES
/**
 * @swagger
 * /register:
 *      post:
 *          summary: Register a new password for the user 
 *          tags: [LOGIN ROUTES]
 *          parameters:
 *              - in: query
 *                name: token
 *                schema:
 *                      type: string
 *                required: true
 *                description: The token
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
 *          responses:
 *              200:
 *                  description: Password correctly saved
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  message:
 *                                      type: string
 *                              example:
 *                                  message: 'Le nouveau mot de passe a bien été enregistré.'
 *              400:
 *                  description: Bad request
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/error(400)'
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
 *                              email: 'owner@gmail.com'
 *          responses:
 *              200:
 *                  description: New token generated and reset url sent
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  message:
 *                                      type: string
 *                              example:
 *                                  message: 'Un email a été envoyé à l.seraline@gmail.com.'
 *              400:
 *                  description: Bad request
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/error(400)'
 */
router.post('/forgotten-password', validator(newPasswordSchema), authController.getNewToken);
/**
 * @swagger
 * /login:
 *      post:
 *          summary: Log in to the site - owner@... member1@... member2@... coach1@... coach2@...
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
 *                              email: 'owner@gmail.com'
 *                              password: '1Password!'
 *          responses:
 *              200:
 *                  description: New authentification token generated
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  logged:
 *                                      type: boolean
 *                                  role:
 *                                      type: string
 *                                  token:
 *                                      type: string
 *                              example:
 *                                  message: true
 *                                  role: 'MEMBER'
 *                                  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiQWxBQkFTQGdtYWlsLmNvbSIsInJvbGUiOiJNRU1CRVIiLCJpYXQiOjE2MTYyMzIyMDAsImV4cCI6MTYxNjI2ODIwMH0.RFnz_3jOwd7f-GxILRYU19DCvTuic1q0tIfRQiTxqXM'
 *              400:
 *                  description: Bad request
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/error(400)'
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
 *                              properties:
 *                                  message:
 *                                      type: string
 *                                      example: "L'entrainement a bien été ajouté."
 *                                  workout:
 *                                      type: object
 *                                      $ref: '#/components/schemas/workout'
 *              400:
 *                  description: Bad request
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/error(400)'
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
 *              400:
 *                  description: Bad request
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/error(400)'
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
 *          responses:
 *              200:
 *                  description: The list of all the health data records of a member
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              items:
 *                                  $ref: '#/components/schemas/healthData'
 *              400:
 *                  description: Bad request
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/error(400)'
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
 *          responses:
 *              200:
 *                  description: The workout was succesfully modified
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  message:
 *                                      type: string
 *                                      example: "L'entrainement a bien été mis à jour."
 *                                  workout:
 *                                      type: object
 *                                      $ref: '#/components/schemas/workout'
 *              400:
 *                  description: Bad request
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/error(400)'
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
 *          responses:
 *              200:
 *                  description: The workout, its health data and its comment were succesfully deleted
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  message:
 *                                      type: string
 *                                      example: "L'entrainement a bien été supprimé."
 *                                  workout:
 *                                      type: object
 *                                      $ref: '#/components/schemas/workout'
 *              400:
 *                  description: Bad request
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/error(400)'
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
 *          responses:
 *              200:
 *                  description: The list of all the coachings still available for booking
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              items:
 *                                  $ref: '#/components/schemas/availableCoaching'
 *              400:
 *                  description: Bad request
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/error(400)'
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
 *          responses:
 *              200:
 *                  description: The list of the next bookings of the logged in member
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              items:
 *                                  $ref: '#/components/schemas/coaching'
 *              400:
 *                  description: Bad request
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/error(400)'
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
 *          responses:
 *              200:
 *                  description: The coaching was succesfully booked
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  message:
 *                                      type: string
 *                                      example: "Réservation bien enregistrée."
 *                                  coaching:
 *                                      type: object
 *                                      $ref: '#/components/schemas/coaching'
 *              400:
 *                  description: Bad request
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/error(400)'
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
 *          responses:
 *              200:
 *                  description: The booking was succesfully cancelled
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  message:
 *                                      type: string
 *                                      example: "Réservation annulée."
 *                                  coaching:
 *                                      type: object
 *                                      $ref: '#/components/schemas/coaching'
 *              400:
 *                  description: Bad request
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/error(400)'
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
 *          responses:
 *              200:
 *                  description: The comment was succesfully added
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  message:
 *                                      type: string
 *                                      example: "Le commentaire bien été ajouté."
 *                                  workout:
 *                                      type: object
 *                                      $ref: '#/components/schemas/workout'
 *              400:
 *                  description: Bad request
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/error(400)'
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
 *              400:
 *                  description: Bad request
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/error(400)'
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
 *          responses:
 *              200:
 *                  description: The comment was succesfully modified
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  message:
 *                                      type: string
 *                                      example: "Le commentaire a bien été modifié."
 *                                  workout:
 *                                      type: object
 *                                      $ref: '#/components/schemas/workout'
 *              400:
 *                  description: Bad request
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/error(400)'
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
 *          security:
 *              - bearerAuth: []
 *          responses:
 *              200:
 *                  description: The comment was succesfully deleted
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  message:
 *                                      type: string
 *                                      example: "Le commentaire a bien été supprimé."
 *                                  workout:
 *                                      type: object
 *                                      $ref: '#/components/schemas/workout'
 *              400:
 *                  description: Bad request
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/error(400)'
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
 *          responses:
 *              200:
 *                  description: The list of the next bookings of the logged in coach
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              items:
 *                                  $ref: '#/components/schemas/coaching'
 *              400:
 *                  description: Bad request
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/error(400)'
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
 *          responses:
 *              200:
 *                  description: The list of the last bookings of the logged in coach
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              items:
 *                                  $ref: '#/components/schemas/coaching'
 *              400:
 *                  description: Bad request
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/error(400)'
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
 *          responses:
 *              200:
 *                  description: The list of the next bookings of the member indicated in the parameter
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              items:
 *                                  $ref: '#/components/schemas/coaching'
 *              400:
 *                  description: Bad request
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/error(400)'
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
 *          responses:
 *              200:
 *                  description: The list of all the member
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              items:
 *                                  $ref: '#/components/schemas/member'
 *              400:
 *                  description: Bad request
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/error(400)'
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
 *          responses:
 *              200:
 *                  description: The specialty was succesfully added
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  message:
 *                                      type: string
 *                                      example: "La spécialité a bien été ajoutée."
 *                                  speciality:
 *                                      type: object
 *                                      $ref: '#/components/schemas/specialty'
 *              400:
 *                  description: Bad request
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/error(400)'
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
 *          responses:
 *              200:
 *                  description: The list of all specialties
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              items:
 *                                  $ref: '#/components/schemas/specialty'
 *              400:
 *                  description: Bad request
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/error(400)'
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
 *          responses:
 *              200:
 *                  description: The specialty was succesfully deleted
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  message:
 *                                      type: string
 *                                      example: "La spécialité a bien été supprimée."
 *                                  speciality:
 *                                      type: object
 *                                      $ref: '#/components/schemas/specialty'
 *              400:
 *                  description: Bad request
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/error(400)'
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
 *          responses:
 *              200:
 *                  description: The user was succesfully added
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  message:
 *                                      type: string
 *                                      example: "L'utilisateur a bien été ajouté."
 *                                  newUser:
 *                                      type: object
 *                                      anyOf:
 *                                          - $ref: '#/components/schemas/coach'
 *                                          - $ref: '#/components/schemas/member'
 *              400:
 *                  description: Bad request
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/error(400)'
 */
router.post('/new-user', validator(userSchema), userController.addUser);
//  authorizationMiddleware, validOwner,
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
 *          responses:
 *              200:
 *                  description: The member specified in parameter
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/member'
 *              400:
 *                  description: Bad request
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/error(400)'
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
 *          responses:
 *              200:
 *                  description: The coach specified in parameter
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/coach'
 *              400:
 *                  description: Bad request
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/error(400)'
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
 *          responses:
 *              200:
 *                  description: The user was succesfully modified
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  message:
 *                                      type: string
 *                                      example: "L'utilisateur a bien été modifié."
 *                                  updatedUser:
 *                                      type: object
 *                                      anyOf:
 *                                          - $ref: '#/components/schemas/coach'
 *                                          - $ref: '#/components/schemas/member'
 *              400:
 *                  description: Bad request
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/error(400)'
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
 *          responses:
 *              200:
 *                  description: The user was succesfully deleted
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  message:
 *                                      type: string
 *                                      example: "L'utilisateur a bien été supprimé."
 *                                  deletedUser:
 *                                      type: object
 *                                      anyOf:
 *                                          - $ref: '#/components/schemas/coach'
 *                                          - $ref: '#/components/schemas/member'
 *              400:
 *                  description: Bad request
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/error(400)'
 */
router.delete('/users/:id(\\d+)', authorizationMiddleware, validOwner, userController.deleteUser);
//      Coachings
/**
 * @swagger
 * /new-coachings:
 *      post:
 *          summary: Add new 15 minutes coaching slots
 *          tags: [Owner - Coachings]
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                        type: object
 *                        required:
 *                            - date
 *                            - start
 *                            - end
 *                            - coachId
 *                        properties:
 *                            date:
 *                                type: string
 *                                description: The date of the coaching slots
 *                            start:
 *                                type: string
 *                                description: The start time of the first slot
 *                            end:
 *                                type: string
 *                                description: The end time of the last slot
 *                            coachId:
 *                                type: integer
 *                                description: The id of the coach
 *                        example:
 *                          date: '2021-06-23'
 *                          start: '09:00'
 *                          end: '12:00'
 *                          coachId: 7
 *          security:
 *              - bearerAuth: []
 *          responses:
 *              200:
 *                  description: The coachings slots were succesfully added
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  message:
 *                                      type: string
 *                                      example: "Les créneaux de coaching ont bien été ajoutés."
 *                                  coachings:
 *                                      type: array
 *                                      items:
 *                                          $ref: '#/components/schemas/newCoaching'
 *              400:
 *                  description: Bad request
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/error(400)'
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
 *          responses:
 *              200:
 *                  description: All the coaching slots
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              items:
 *                                  $ref: '#/components/schemas/coaching'
 *              400:
 *                  description: Bad request
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/error(400)'
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
 *          responses:
 *              200:
 *                  description: The coach specified in parameter
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/coaching'
 *              400:
 *                  description: Bad request
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/error(400)'
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
 *          responses:
 *              200:
 *                  description: The coaching was succesfully deleted
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  message:
 *                                      type: string
 *                                      example: "Le coaching a bien été supprimé."
 *                                  coaching:
 *                                      $ref: '#/components/schemas/coaching'
 *              400:
 *                  description: Bad request
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/error(400)'
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
 *              400:
 *                  description: Bad request
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/error(400)'
 */
router.get('/coachs',authorizationMiddleware, userController.getAllCoachs);

// INVALID TOKEN
router.use(mainController.invalidToken);

//404 NOT FOUND
router.use(mainController.notFound);

module.exports = router;