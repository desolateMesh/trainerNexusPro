// models/Workout.js
module.exports = (sequelize, DataTypes) => {
  const Workout = sequelize.define('Workout', {
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
  }, {
    tableName: 'workouts',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true
  });

  Workout.associate = (models) => {
    Workout.hasMany(models.WorkoutExercise, { foreignKey: 'workout_id' });
  };

  return Workout;
};