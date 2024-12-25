// C:\Users\jrochau\projects\trainerNexus\backend\models\Workout.js
module.exports = (sequelize, DataTypes) => {
  const Workout = sequelize.define(
    'Workout',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: 'workouts',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      underscored: true, // Use snake_case for column names
    }
  );

  Workout.associate = (models) => {
    Workout.hasMany(models.WorkoutExercise, {
      foreignKey: 'workout_id',
      as: 'exercises',
    });
  };

  return Workout;
};
