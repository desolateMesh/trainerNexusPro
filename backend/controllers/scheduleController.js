const { TrainingSession, User, TrainerClient } = require('../models');

const scheduleController = {
  createSession: async (req, res) => {
    try {
      const session = await TrainingSession.create(req.body);
      res.status(201).json(session);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getTrainerSessions: async (req, res) => {
    try {
      const sessions = await TrainingSession.findAll({
        where: { trainer_id: req.user.id },
        include: [{
          model: User,
          as: 'client',
          attributes: ['id', 'first_name', 'last_name']
        }],
        order: [['start_time', 'ASC']]
      });
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getClientSessions: async (req, res) => {
    try {
      const sessions = await TrainingSession.findAll({
        where: { client_id: req.user.id },
        include: [{
          model: User,
          as: 'trainer',
          attributes: ['id', 'first_name', 'last_name']
        }],
        order: [['start_time', 'ASC']]
      });
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  updateSession: async (req, res) => {
    try {
      const [updated] = await TrainingSession.update(req.body, {
        where: { 
          id: req.params.id,
          [Op.or]: [
            { trainer_id: req.user.id },
            { client_id: req.user.id }
          ]
        }
      });
      if (!updated) {
        return res.status(404).json({ error: 'Session not found' });
      }
      const session = await TrainingSession.findByPk(req.params.id);
      res.json(session);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = scheduleController;