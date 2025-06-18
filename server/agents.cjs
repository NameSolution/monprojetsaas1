const express = require('express');
const router = express.Router();
const db = require('./db.cjs');

// List versions for an agent. Superadmin can specify hotel_id query.
router.get('/versions', async (req, res) => {
  const hotelId =
    req.user.role === 'superadmin'
      ? req.query.hotel_id || req.user.hotel_id
      : req.user.hotel_id;
  try {
    const { rows } = await db.query(
      `SELECT id, created_at FROM agent_versions
       WHERE agent_id = $1
       ORDER BY created_at DESC
       LIMIT 20`,
      [hotelId]
    );
    res.json(rows);
  } catch (err) {
    console.error('Failed to fetch agent versions:', err);
    res.status(500).json({ error: 'Failed to fetch agent versions' });
  }
});

// Fetch agent config. Superadmins can specify ?hotel_id=XXX
router.get('/', async (req, res) => {
  const hotelId =
    req.user.role === 'superadmin'
      ? req.query.hotel_id || req.user.hotel_id
      : req.user.hotel_id;
  try {
    const { rows } = await db.query(
      'SELECT * FROM agents WHERE hotel_id = $1 LIMIT 1',
      [hotelId]
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

// Create or update agent config. Superadmins may set ?hotel_id=XXX
router.post('/', async (req, res) => {
  const hotelId =
    req.user.role === 'superadmin'
      ? req.query.hotel_id || req.body.hotel_id || req.user.hotel_id
      : req.user.hotel_id;
  const { name, persona, language, greeting, flow, modules, memory_vars } = req.body;
  try {
    const { rows } = await db.query(
      'SELECT id FROM agents WHERE hotel_id = $1',
      [hotelId]
    );
    if (rows.length) {
      const result = await db.query(
        `UPDATE agents
         SET name=$1, persona=$2, language=$3, greeting=$4, flow=$5, modules=$6, memory_vars=$7, updated_at=NOW()
         WHERE hotel_id=$8 RETURNING *`,
        [name, persona, language, greeting, flow, modules, memory_vars, hotelId]
      );
      await db.query(
        'INSERT INTO agent_versions (agent_id, flow) VALUES ($1,$2)',
        [hotelId, flow]
      );
      return res.json(result.rows[0]);
    }
    const insert = await db.query(
      `INSERT INTO agents (hotel_id, name, persona, language, greeting, flow, modules, memory_vars)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [hotelId, name, persona, language, greeting, flow, modules, memory_vars]
    );
    await db.query(
      'INSERT INTO agent_versions (agent_id, flow) VALUES ($1,$2)',
      [hotelId, flow]
    );
    res.json(insert.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save agent' });
  }
});

module.exports = router;
