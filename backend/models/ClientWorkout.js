//models/ClientWorkout.js

module.exports = (sequelize, DataTypes) => {
    const ClientWorkout = sequelize.define('ClientWorkout', {
      status: DataTypes.STRING,
    });
  
    ClientWorkout.associate = (models) => {
      ClientWorkout.belongsTo(models.Workout, { foreignKey: 'workout_id' });
      ClientWorkout.belongsTo(models.User, { foreignKey: 'client_id' });
    };
  
    return ClientWorkout;
  };
  