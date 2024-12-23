//server.js

require('dotenv').config();  
const express = require('express');
const cors = require('cors');  
const sequelize = require('./config/db');  
const authController = require('./controllers/authController');   
const trainerRoutes = require('./routes/trainerRoutes');
const userRoutes = require('./routes/userRoutes');
const workoutRoutes = require('./routes/workoutRoutes');

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());  // Enable CORS if needed

// API routes
app.post('/api/auth/login', authController.login);
app.use('/api/trainer', trainerRoutes);
app.use('/api/workouts', workoutRoutes);

// Start the server and sync the database
const PORT = process.env.PORT || 5000;

sequelize.authenticate()
  .then(() => {
    console.log('✓ PostgreSQL connection established');
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('✕ PostgreSQL connection error:', err);
  });
