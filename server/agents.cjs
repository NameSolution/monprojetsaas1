const express = require('express');
const router = express.Router();
const db = require('./db.cjs');

// Get all nodes for current hotel
router.get('/', async (req, res) => {
  try {
    const hotelId = req.user.hotel_id;
    const { rows } = await db.query(
      'SELECT * FROM agent_nodes WHERE hotel_id = $1 ORDER BY created_at',
      [hotelId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch nodes' });
  }
});

// Create or update node
router.post('/', async (req, res) => {
  const hotelId = req.user.hotel_id;
  const { id, prompt, response, next_id } = req.body;
  try {
    if (id) {
      const { rows } = await db.query(
        `UPDATE agent_nodes SET prompt=$1, response=$2, next_id=$3, updated_at=NOW()
         WHERE id=$4 AND hotel_id=$5 RETURNING *`,
        [prompt, response, next_id, id, hotelId]
      );
      return res.json(rows[0]);
    }
    const { rows } = await db.query(
      `INSERT INTO agent_nodes (hotel_id, prompt, response, next_id)
       VALUES ($1,$2,$3,$4) RETURNING *`,
      [hotelId, prompt, response, next_id]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save node' });
  }
});

router.delete('/:id', async (req, res) => {
  const hotelId = req.user.hotel_id;
  try {
    await db.query(
      'DELETE FROM agent_nodes WHERE id = $1 AND hotel_id = $2',
      [req.params.id, hotelId]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete node' });
  }
});

module.exports = router;
