const { User, TrainerClient } = require('../models'); // Import models
const { Op } = require('sequelize');

exports.createUser = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      first_name,
      last_name,
      phone,
      role = 'client',
    } = req.body;

    const trainerId = req.body.trainerId; // Expect trainerId in the request

    // Check if username or email already exists
    const existingUser = await User.findOne({
      where: { [Op.or]: [{ username }, { email }] },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password, // Hash this in production
      first_name,
      last_name,
      phone,
      role,
    });

    // If the user is a client, associate with the trainer
    if (role === 'client' && trainerId) {
      await TrainerClient.create({
        trainer_id: trainerId,
        client_id: user.id,
        status: 'active',
      });
    }

    res.status(201).json(user);
  } catch (error) {
    console.error('Error creating user:', error.message);
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
};
