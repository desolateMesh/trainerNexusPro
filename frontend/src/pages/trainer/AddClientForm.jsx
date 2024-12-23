// In your users controller
exports.createUser = async (req, res) => {
    try {
      const { 
        username, 
        email, 
        password, 
        first_name, 
        last_name, 
        phone, 
        role 
      } = req.body;
  
      // Create user
      const user = await User.create({
        username,
        email,
        password, // In production, hash this!
        first_name,
        last_name,
        phone,
        role
      });
  
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ message: 'Error creating user', error: error.message });
    }
  };
  
  // In your trainer controller
  exports.assignClient = async (req, res) => {
    try {
      const { trainerId, clientId, status = 'active' } = req.body;
  
      // Create trainer-client relationship
      const trainerClient = await TrainerClient.create({
        trainer_id: trainerId,
        client_id: clientId,
        status
      });
  
      res.status(201).json(trainerClient);
    } catch (error) {
      res.status(500).json({ message: 'Error assigning client', error: error.message });
    }
  };