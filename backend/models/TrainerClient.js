//models/TrainerClient.js

module.exports = (sequelize, DataTypes) => {
  const TrainerClient = sequelize.define(
    'TrainerClient',
    {
      trainer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      client_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      assigned_at: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      },
      status: {
        type: DataTypes.STRING(20),
        defaultValue: 'active',
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: 'trainer_clients', // Match the exact table name
      timestamps: false, // Disable Sequelize auto-timestamps
    }
  );

  return TrainerClient;
};