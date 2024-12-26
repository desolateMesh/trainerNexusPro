//server.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const authController = require('./controllers/authController');
const trainerRoutes = require('./routes/trainerRoutes');
const userRoutes = require('./routes/userRoutes');
const workoutRoutes = require('./routes/workoutRoutes');
const clientWorkoutsRouter = require('./routes/clientWorkouts');


const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors()); 

// Debugging Middleware
app.use((req, res, next) => {
  console.log('Request:', {
    method: req.method,
    url: req.originalUrl,
    body: req.body,
  });
  next();
});

// Register Routes
app.use('/api/auth', authController.login);
app.use('/api/workouts', workoutRoutes); 
app.use('/api/trainer', trainerRoutes); 
app.use('/api/users', userRoutes);
app.use('/api/client-workouts', clientWorkoutsRouter);
app.use('/api/client-workouts', require('./routes/clientWorkouts'));
app.use('/api/training-sessions', require('./routes/scheduleRoutes'));

// Start the server and sync the database
const PORT = process.env.PORT || 5000;

sequelize
  .authenticate()
  .then(() => {
    console.log('✓ PostgreSQL connection established');
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('✕ PostgreSQL connection error:', err);
  });
