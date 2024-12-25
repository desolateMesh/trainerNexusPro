//C:\Users\jrochau\projects\trainerNexus\backend\models\WorkoutExercise.js

module.exports = (sequelize, DataTypes) => {
  const WorkoutExercise = sequelize.define(
    'WorkoutExercise',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      workout_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'workouts', // Name of the referenced table
          key: 'id',
        },
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      exercise: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      reps: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      sets: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      duration: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      videos: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
    },
    {
      tableName: 'workout_exercises', // Explicitly map to correct table
      timestamps: true, // Automatically create `createdAt` and `updatedAt`
      createdAt: 'created_at', // Map to your database column
      updatedAt: 'updated_at', // Map to your database column
      underscored: true, // Use snake_case for column names
    }
  );

  WorkoutExercise.associate = (models) => {
    WorkoutExercise.belongsTo(models.Workout, {
      foreignKey: 'workout_id',
      as: 'workout',
    });
  };

  return WorkoutExercise;
};
