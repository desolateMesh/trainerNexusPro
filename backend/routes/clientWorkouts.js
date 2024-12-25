// routes/clientWorkouts.js
const express = require('express');
const router = express.Router();
const { sequelize } = require('../models');
const jwt = require('jsonwebtoken');

// Auth middleware
const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

router.get('/assigned', auth, async (req, res) => {
  try {
    const results = await sequelize.query(`
      SELECT 
        cw.id AS client_workout_id,
        cw.client_id,
        w.id AS workout_id,
        w.name AS workout_name,
        w.description AS workout_description,
        we.exercise,
        we.type,
        we.reps,
        we.sets,
        we.duration,
        we.notes
      FROM client_workouts cw
      JOIN workouts w ON cw.workout_id = w.id
      LEFT JOIN workout_exercises we ON w.id = we.workout_id
      WHERE cw.client_id = :clientId
      ORDER BY cw.assigned_at DESC
    `, {
      replacements: { clientId: req.user.id },
      type: sequelize.QueryTypes.SELECT
    });

    res.json(results);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Failed to fetch workouts' });
  }
});

router.patch('/:workoutId/complete', async (req, res) => {
  const { workoutId } = req.params;
  const clientId = req.user.id; 

  try {
    const [result] = await sequelize.query(`
      UPDATE client_workouts 
      SET status = 'COMPLETED'
      WHERE workout_id = :workoutId AND client_id = :clientId
    `, {
      replacements: { workoutId, clientId },
    });

    if (result === 0) {
      return res.status(404).json({ message: 'Workout not found or already completed.' });
    }

    res.json({ message: 'Workout marked as complete.' });
  } catch (error) {
    console.error('Error marking workout complete:', error);
    res.status(500).json({ message: 'Failed to mark workout complete.' });
  }
});


module.exports = router;