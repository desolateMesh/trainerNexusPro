const express = require('express');
const router = express.Router();
const workoutController = require('../controllers/workoutController');

router.post('/create', workoutController.createWorkoutPlan);
router.get('/client/:clientId', workoutController.getClientWorkouts);

module.exports = router;
