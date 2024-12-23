//models/index.js

const { Sequelize } = require('sequelize');
const sequelize = require('../config/db');

const User = require('./User')(sequelize, Sequelize.DataTypes);
const TrainerClient = require('./TrainerClient')(sequelize, Sequelize.DataTypes);

// Define associations
User.hasMany(TrainerClient, {
  foreignKey: 'trainer_id',
  as: 'trainerClients',
});
TrainerClient.belongsTo(User, {
  foreignKey: 'client_id',
  as: 'client', // Alias used in your controller
});

module.exports = {
  sequelize,
  Sequelize,
  User,
  TrainerClient,
};
