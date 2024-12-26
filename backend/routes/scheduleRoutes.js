const express = require('express');
const router = express.Router();
const { db } = require('../config/db');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
  try {
    const { client_id, session_type, start_time, end_time, notes } = req.body;
    const trainer_id = req.user.id;
    
    const query = `
      INSERT INTO training_sessions 
      (trainer_id, client_id, session_type, start_time, end_time, notes)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    
    const values = [trainer_id, client_id, session_type, start_time, end_time, notes];
    const result = await db.query(query, values);
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: error.message });
  }
});
console.log('Values:', values);

// Get trainer's sessions
router.get('/trainer/sessions', auth, async (req, res) => {
  try {
    const query = `
      SELECT 
        ts.*,
        u.first_name,
        u.last_name,
        to_char(ts.start_time, 'YYYY-MM-DD"T"HH24:MI:SS') as start_time,
        to_char(ts.end_time, 'YYYY-MM-DD"T"HH24:MI:SS') as end_time
      FROM training_sessions ts
      JOIN users u ON ts.client_id = u.id
      WHERE ts.trainer_id = $1
      ORDER BY ts.start_time DESC
    `;
    
    const result = await db.query(query, [req.user.id]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching trainer sessions:', error);
    res.status(500).json({ error: 'Failed to fetch training sessions' });
  }
});

// Get client's sessions
router.get('/client/sessions', auth, async (req, res) => {
  try {
    const query = `
      SELECT 
        ts.*,
        u.first_name,
        u.last_name,
        to_char(ts.start_time, 'YYYY-MM-DD"T"HH24:MI:SS') as start_time,
        to_char(ts.end_time, 'YYYY-MM-DD"T"HH24:MI:SS') as end_time
      FROM training_sessions ts
      JOIN users u ON ts.trainer_id = u.id
      WHERE ts.client_id = $1
      ORDER BY ts.start_time DESC
    `;
    
    const result = await db.query(query, [req.user.id]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching client sessions:', error);
    res.status(500).json({ error: 'Failed to fetch training sessions' });
  }
});

// Update session
router.patch('/sessions/:id', auth, async (req, res) => {
  try {
    const { session_type, start_time, end_time, notes, status } = req.body;
    
    // Validate session_type length
    if (session_type && session_type.length > 50) {
      return res.status(400).json({ error: 'Session type must be 50 characters or less' });
    }

    // Validate status length and values
    if (status) {
      if (status.length > 20) {
        return res.status(400).json({ error: 'Status must be 20 characters or less' });
      }
      const validStatuses = ['scheduled', 'completed', 'cancelled', 'missed'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status value' });
      }
    }

    const query = `
      UPDATE training_sessions
      SET 
        session_type = COALESCE($1, session_type),
        start_time = COALESCE($2, start_time),
        end_time = COALESCE($3, end_time),
        notes = COALESCE($4, notes),
        status = COALESCE($5, status)
      WHERE id = $6 AND (trainer_id = $7 OR client_id = $7)
      RETURNING *
    `;
    
    const result = await db.query(query, [
      session_type,
      start_time,
      end_time,
      notes,
      status,
      req.params.id,
      req.user.id
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Session not found or unauthorized' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating session:', error);
    res.status(500).json({ error: 'Failed to update training session' });
  }
});

module.exports = router;