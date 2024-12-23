//controllers/trainerClient.js 

const { User, TrainerClient } = require('../models');

// Assign a client to a trainer
exports.assignClient = async (req, res) => {
  const { trainerId, clientId } = req.body;

  try {
    // Validate input
    if (!trainerId || !clientId) {
      return res.status(400).json({ error: 'Both trainerId and clientId are required' });
    }

    // Check if trainer exists and is of role 'trainer'
    const trainer = await User.findOne({ where: { id: trainerId, role: 'trainer' } });
    if (!trainer) {
      return res.status(404).json({ error: 'Trainer not found' });
    }

    // Check if client exists and is of role 'client'
    const client = await User.findOne({ where: { id: clientId, role: 'client' } });
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    // Create assignment
    const assignment = await TrainerClient.create({
      trainer_id: trainerId,
      client_id: clientId,
    });

    res.status(201).json({ message: 'Client assigned successfully', assignment });
  } catch (error) {
    console.error('Error assigning client:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Fetch clients for a specific trainer
exports.getTrainerClients = async (req, res) => {
  const { trainerId } = req.params;

  try {
    const clients = await TrainerClient.findAll({
      where: { trainer_id: trainerId },
      include: [
        {
          model: User,
          as: 'client', // Ensure this alias matches your model definition
          attributes: ['id', 'username', 'email', 'first_name', 'last_name', 'phone', 'profile_picture'],
        },
      ],
    });

    res.status(200).json(clients);
  } catch (error) {
    console.error('Error fetching trainer clients:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

