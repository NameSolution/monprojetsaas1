
const express = require('express');
const db = require('./db.cjs');

const router = express.Router();

// Get all plans
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM plans ORDER BY price ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create plan
router.post('/', async (req, res) => {
  try {
    const { name, price, features, max_hotels } = req.body;
    const result = await db.query(
      'INSERT INTO plans (name, price, features, max_hotels) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, price, features, max_hotels]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update plan
router.put('/:id', async (req, res) => {
  try {
    const { name, price, features, max_hotels } = req.body;
    const result = await db.query(
      'UPDATE plans SET name = $1, price = $2, features = $3, max_hotels = $4, updated_at = NOW() WHERE id = $5 RETURNING *',
      [name, price, features, max_hotels, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete plan
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM plans WHERE id = $1', [req.params.id]);
    res.json({ message: 'Plan deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
