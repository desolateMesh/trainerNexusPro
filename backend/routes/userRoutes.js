// C:\Users\jrochau\projects\trainerNexus\backend\routes\userRoutes.js

const express = require('express');
const router = express.Router();
const { User } = require('../models'); // Import User model
const userController = require('../controllers/userController');

// POST /api/users/create
router.post('/create', userController.createUser);

// GET /api/users - Fetch all users
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll(); // Fetch all users
    res.status(200).json(users); // Return all users
  } catch (error) {
    console.error('Error fetching users:', error.message);
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
});

router.get('/client-workouts/:clientId', async (req, res) => {
    try {
      const workouts = await ClientWorkout.findAll({
        where: { client_id: req.params.clientId },
        include: [{
          model: Workout,
          include: [WorkoutExercise]
        }]
      });
      res.json(workouts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

module.exports = router;
