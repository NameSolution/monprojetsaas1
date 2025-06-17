const express = require('express');
const router = express.Router();
const db = require('./db.cjs');

// Get all knowledge items for current user's hotel
router.get('/', async (req, res) => {
  try {
    const hotelId = req.user.hotel_id;
    if (!hotelId) {
      return res.json([]);
    }
    const result = await db.query(
      `SELECT * FROM knowledge_items WHERE hotel_id = $1 ORDER BY created_at DESC`,
      [hotelId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch knowledge items' });
  }
});

// Create knowledge item
router.post('/', async (req, res) => {
  try {
    const hotelId = req.user.hotel_id;
    if (!hotelId) {
      return res.status(400).json({ error: 'No hotel assigned' });
    }
    const { info } = req.body;
    if (!info) return res.status(400).json({ error: 'Info is required' });
    const result = await db.query(
      `INSERT INTO knowledge_items (hotel_id, tenant_id, info)
       VALUES ($1, 1, $2)
       RETURNING *`,
      [hotelId, info]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create item' });
  }
});

// Update knowledge item
router.put('/:id', async (req, res) => {
  try {
    const hotelId = req.user.hotel_id;
    const { id } = req.params;
    const { info } = req.body;
    const result = await db.query(
      `UPDATE knowledge_items SET info = COALESCE($1, info), updated_at = CURRENT_TIMESTAMP
       WHERE id = $2 AND hotel_id = $3 RETURNING *`,
      [info, id, hotelId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update item' });
  }
});

// Delete knowledge item
router.delete('/:id', async (req, res) => {
  try {
    const hotelId = req.user.hotel_id;
    const { id } = req.params;
    const result = await db.query(
      `DELETE FROM knowledge_items WHERE id = $1 AND hotel_id = $2 RETURNING id`,
      [id, hotelId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

module.exports = router;
