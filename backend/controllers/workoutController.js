//controllers/workoutController.js

const { Workout, WorkoutExercise, ClientWorkout, sequelize } = require('../models');

exports.createWorkoutPlan = async (req, res) => {
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
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
};
  

  exports.getClientWorkouts = async (req, res) => {
    try {
      const { clientId } = req.params;
  
      const clientWorkouts = await ClientWorkout.findAll({
        where: { client_id: clientId },
        include: [
          {
            model: Workout,
            include: [WorkoutExercise],
          },
        ],
      });
  
      res.status(200).json(clientWorkouts);
    } catch (error) {
      console.error('Error fetching client workouts:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
