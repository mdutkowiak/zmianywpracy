const express = require('express');
const { Pool } = require('pg');
const router = express.Router();

// PostgreSQL Connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Endpoint do pobrania harmonogramu dla użytkownika
router.get('/schedule', async (req, res) => {
  const { userId } = req.query;  // Zakładamy, że userId jest przekazywane w zapytaniu

  try {
    const result = await pool.query('SELECT * FROM schedules WHERE user_id = $1', [userId]);
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint do zapisania harmonogramu dla użytkownika
router.post('/schedule', async (req, res) => {
  const { userId, startDate, endDate, startTime, endTime } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO schedules (user_id, start_date, end_date, start_time, end_time) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [userId, startDate, endDate, startTime, endTime]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint do usunięcia harmonogramu dla użytkownika
router.delete('/schedule', async (req, res) => {
  const { scheduleId } = req.body;

  try {
    await pool.query('DELETE FROM schedules WHERE id = $1', [scheduleId]);
    res.status(204).send();  // Usunięto rekord, brak odpowiedzi
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
