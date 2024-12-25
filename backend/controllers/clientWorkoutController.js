// C:\Users\jrochau\projects\trainerNexus\backend\controllers\clientWorkoutController.js

const { ClientWorkout, Workout, WorkoutExercise } = require('../models');
const { Op } = require('sequelize');

exports.getAssignedWorkouts = async (req, res) => {
  try {
    const clientId = req.user.id; // Assuming `req.user` is set by authentication middleware

    const assignedWorkouts = await ClientWorkout.findAll({
      where: {
        client_id: clientId,
        status: 'ASSIGNED',
      },
      include: [
        {
          model: Workout,
          include: [{ model: WorkoutExercise }],
        },
      ],
    });

    if (!assignedWorkouts.length) {
      return res.status(404).json({ message: 'No assigned workouts found.' });
    }

    res.status(200).json(assignedWorkouts);
  } catch (error) {
    console.error('Error fetching assigned workouts:', error);
    res.status(500).json({ message: 'Failed to fetch assigned workouts.' });
  }
};

exports.getWorkoutHistory = async (req, res) => {
  try {
    const clientId = req.user.id;

    const workoutHistory = await ClientWorkout.findAll({
      where: { client_id: clientId },
      include: [
        {
          model: Workout,
          include: [{ model: WorkoutExercise }],
        },
      ],
      order: [['assigned_at', 'DESC']],
    });

    res.status(200).json(workoutHistory);
  } catch (error) {
    console.error('Error fetching workout history:', error);
    res.status(500).json({ message: 'Failed to fetch workout history.' });
  }
};

exports.updateWorkoutStatus = async (req, res) => {
  const { workoutId } = req.params;
  const { status } = req.body;

  try {
    const updated = await ClientWorkout.update(
      { status },
      {
        where: {
          workout_id: workoutId,
          client_id: req.user.id, // Ensure the user can only update their workouts
        },
      }
    );

    if (updated[0] === 0) {
      return res.status(404).json({ message: 'Workout not found or not authorized to update.' });
    }

    res.json({ message: 'Workout status updated successfully.' });
  } catch (error) {
    console.error('Error updating workout status:', error);
    res.status(500).json({ message: 'Failed to update workout status.' });
  }
};
