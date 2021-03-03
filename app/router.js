const express = require('express');

const router = express.Router();

const userController = require('./controllers/userController');


router.get('/users', userController.allUsers);
router.get('/members', userController.allMembers);
router.get('/members/:id(\\d+)', userController.oneMember);
router.get('/workouts', userController.allWorkoutsByMember);





module.exports = router;