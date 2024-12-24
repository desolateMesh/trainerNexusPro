const express = require('express');
const router = express.Router();
const workoutController = require('../controllers/workoutController');

router.post('/create', workoutController.createWorkoutPlan);
router.get('/client/:clientId', workoutController.getClientWorkouts);

router.post('/workouts/create', async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const { name, description, client_id, exercises } = req.body;
    
    const workout = await Workout.create({
      name,
      description
    }, { transaction: t });

    if (exercises?.length) {
      await WorkoutExercise.bulkCreate(
        exercises.map(exercise => ({
          workout_id: workout.id,
          type: exercise.type,
          exercise: exercise.exercise_name,
          reps: exercise.reps,
          sets: exercise.sets,
          duration: exercise.duration,
          laps: exercise.laps,
          notes: exercise.notes
        })),
        { transaction: t }
      );
    }

    await ClientWorkout.create({
      client_id,
      workout_id: workout.id,
      status: 'ASSIGNED'
    }, { transaction: t });

    await t.commit();
    res.status(201).json(workout);
  } catch (error) {
    await t.rollback();
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;