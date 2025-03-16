const express = require('express');
const db = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Dodanie wpisu do harmonogramu
router.post('/schedule', authMiddleware, async (req, res) => {
    const { user_id, date, start_time, end_time } = req.body;

    try {
        const result = await db.query(
            `INSERT INTO schedule (user_id, date, start_time, end_time) 
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [user_id, date, start_time, end_time]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Błąd podczas zapisu harmonogramu' });
    }
});

// Pobranie harmonogramu dla danego tygodnia
router.get('/schedule', authMiddleware, async (req, res) => {
    const { start_date, end_date } = req.query;

    try {
        const result = await db.query(
            `SELECT u.username, u.full_name, s.date, s.start_time, s.end_time
             FROM schedule s
             JOIN users u ON s.user_id = u.id
             WHERE s.date BETWEEN $1 AND $2
             ORDER BY u.full_name ASC, s.date ASC, s.start_time ASC`,
            [start_date, end_date]
        );

        const scheduleByUser = {};
        result.rows.forEach(entry => {
            if (!scheduleByUser[entry.full_name]) {
                scheduleByUser[entry.full_name] = {};
            }
            scheduleByUser[entry.full_name][entry.date] = `${entry.start_time} - ${entry.end_time}`;
        });

        res.status(200).json(scheduleByUser);
    } catch (error) {
        res.status(500).json({ error: 'Błąd podczas pobierania harmonogramu' });
    }
});

module.exports = router;
