const express = require('express');
const router = express.Router();
const db = require('./db.cjs');

// Fetch agent config for current hotel
router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query(
      'SELECT * FROM agents WHERE hotel_id = $1 LIMIT 1',
      [req.user.hotel_id]
    );
    if (rows.length === 0) {
      return res.json(null);
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch agent' });
  }
});

// Create or update agent config
router.post('/', async (req, res) => {
  const hotelId = req.user.hotel_id;
  const { name, persona, language, greeting, flow } = req.body;
  try {
    const { rows } = await db.query(
      'SELECT id FROM agents WHERE hotel_id = $1',
      [hotelId]
    );
    if (rows.length) {
      const result = await db.query(
        `UPDATE agents
         SET name=$1, persona=$2, language=$3, greeting=$4, flow=$5, updated_at=NOW()
         WHERE hotel_id=$6 RETURNING *`,
        [name, persona, language, greeting, flow, hotelId]
      );
      return res.json(result.rows[0]);
    }
    const insert = await db.query(
      `INSERT INTO agents (hotel_id, name, persona, language, greeting, flow)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [hotelId, name, persona, language, greeting, flow]
    );
    res.json(insert.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save agent' });
  }
});

module.exports = router;
