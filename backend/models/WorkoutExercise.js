//

module.exports = (sequelize, DataTypes) => {
  const WorkoutExercise = sequelize.define('WorkoutExercise', {
    type: DataTypes.STRING,
    exercise: DataTypes.STRING,
    reps: DataTypes.INTEGER,
    sets: DataTypes.INTEGER,
    duration: DataTypes.INTEGER,
    notes: DataTypes.TEXT,
    videos: DataTypes.JSONB,
  });

  return WorkoutExercise;
};