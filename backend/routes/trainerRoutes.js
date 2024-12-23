//routes/trainerRoutes.js

const express = require('express');
const router = express.Router();
const trainerController = require('../controllers/trainerController');

// Route to assign a client to a trainer
router.post('/assign-client', trainerController.assignClient);

// Route to fetch clients of a specific trainer
router.get('/clients/:trainerId', trainerController.getTrainerClients);

module.exports = router;
