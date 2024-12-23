//routes/auth.js

const jwt = require('jsonwebtoken'); // Add this import
const { User } = require('../models');

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user with exact username and password match
    const user = await User.findOne({ 
      where: { 
        username,
        password // Direct password comparison as you specified
      }
    });

    if (!user) {
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
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};