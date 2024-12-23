//models/Workout.js

module.exports = (sequelize, DataTypes) => {
    const Workout = sequelize.define('Workout', {
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
    });
  
    Workout.associate = (models) => {
      Workout.hasMany(models.WorkoutExercise, { foreignKey: 'workout_id' });
    };
  
    return Workout;
  };
  