const express = require('express');
const router = express.Router();
const db = require('./db.cjs');

// List interactions for current user's hotel. Superadmins can filter by ?hotel_id
router.get('/', async (req, res) => {
  const hotelId =
    req.user.role === 'superadmin'
      ? req.query.hotel_id || req.user.hotel_id
      : req.user.hotel_id;
  try {
    const { rows } = await db.query(
      `SELECT id, hotel_id, session_id, timestamp, lang_code, user_input, bot_response, intent_detected, confidence_score, feedback
       FROM interactions
       WHERE hotel_id = $1
       ORDER BY timestamp DESC
       LIMIT 100`,
      [hotelId]
    );
    res.json(rows);
  } catch (err) {
    console.error('Failed to fetch interactions:', err);
    res.status(500).json({ error: 'Failed to fetch interactions' });
  }
});

module.exports = router;
