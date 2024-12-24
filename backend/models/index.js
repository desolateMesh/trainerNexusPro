const { Sequelize } = require('sequelize');
const sequelize = require('../config/db');

const User = require('./User')(sequelize, Sequelize.DataTypes);
const TrainerClient = require('./TrainerClient')(sequelize, Sequelize.DataTypes);
const Workout = require('./Workout')(sequelize, Sequelize.DataTypes);
const WorkoutExercise = require('./WorkoutExercise')(sequelize, Sequelize.DataTypes);
const ClientWorkout = require('./ClientWorkout')(sequelize, Sequelize.DataTypes);

// Associations
User.hasMany(TrainerClient, { foreignKey: 'trainer_id', as: 'trainerClients' });
TrainerClient.belongsTo(User, { foreignKey: 'client_id', as: 'client' });
Workout.hasMany(WorkoutExercise, { foreignKey: 'workout_id' });
WorkoutExercise.belongsTo(Workout, { foreignKey: 'workout_id' });

module.exports = {
  sequelize,
  Sequelize,
  User,
  TrainerClient,
  Workout,
  WorkoutExercise,
  ClientWorkout
};