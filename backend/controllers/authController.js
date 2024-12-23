//controllers/authController.js

const jwt = require('jsonwebtoken');
const { User } = require('../models');

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    console.log('Login attempt:', { username }); // Debugging log

    // Find user with exact username and password match
    const user = await User.findOne({ 
      where: { 
        username,
        password 
      }
    });

    if (!user) {
      console.log('User not found'); // Debugging log
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create token
    const token = jwt.sign(
      { 
        id: user.id,
        username: user.username,
        role: user.role 
      },
      process.env.JWT_SECRET, 
      { expiresIn: '24h' }
    );

    // Send response
    res.json({
      token,
      userId: user.id,
      username: user.username,
      role: user.role,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email
    });

  } catch (error) {
    console.error('Login error details:', error);
    res.status(500).json({ 
      message: 'Server error during login',
      error: error.toString() 
    });
  }
};