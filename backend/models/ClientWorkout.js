// C:\Users\jrochau\projects\trainerNexus\backend\models\ClientWorkout.js

module.exports = (sequelize, DataTypes) => {
  const ClientWorkout = sequelize.define('ClientWorkout', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    client_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    workout_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    assigned_at: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    status: {
      type: DataTypes.STRING(20),
      defaultValue: 'assigned'
    }
  }, {
    tableName: 'client_workouts',
    timestamps: false,
    underscored: true
  });

  ClientWorkout.associate = (models) => {
    ClientWorkout.belongsTo(models.Workout, { foreignKey: 'workout_id' });
    ClientWorkout.belongsTo(models.User, { foreignKey: 'client_id' });
  };

  return ClientWorkout;
};