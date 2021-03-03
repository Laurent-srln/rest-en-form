const express = require('express');

const router = express.Router();

const userController = require('./controllers/userController');

router.get('/', (req,res) => {
    res.send('coucou');
    console.log('coucou');
});

router.get('/users', userController.allUsers);

router.get('/members', userController.allMembers);

router.get('/workouts', userController.allWorkouts);



module.exports = router;