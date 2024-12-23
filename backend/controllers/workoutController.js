//controllers/workoutController.js

const { Workout, WorkoutExercise, ClientWorkout } = require('../models');

exports.createWorkoutPlan = async (req, res) => {
    try {
      const { name, description, exercises, clientIds } = req.body;
  
      // Create the workout plan
      const workout = await Workout.create({ name, description });
  
      // Add exercises
      const workoutExercises = exercises.map((exercise) => ({
        ...exercise,
        workout_id: workout.id,
      }));
      await WorkoutExercise.bulkCreate(workoutExercises);
  
      // Assign workout to clients
      const clientWorkouts = clientIds.map((clientId) => ({
        client_id: clientId,
        workout_id: workout.id,
      }));
      await ClientWorkout.bulkCreate(clientWorkouts);
  
      res.status(201).json({ message: 'Workout plan created and assigned successfully!' });
    } catch (error) {
      console.error('Error creating workout plan:', error);
      res.status(500).json({ error: 'Internal Server Error' });
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
  
