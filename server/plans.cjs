
const express = require('express');
const db = require('./db.cjs');

const router = express.Router();

// Get all subscription plans
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM subscription_plans ORDER BY price ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create subscription plan
router.post('/', async (req, res) => {
  try {
    const { tenantId = 1, name, price, features } = req.body;
    const result = await db.query(
      'INSERT INTO subscription_plans (tenant_id, name, price, features) VALUES ($1, $2, $3, $4) RETURNING *',
      [tenantId, name, price, features]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update subscription plan
router.put('/:id', async (req, res) => {
  try {
    const { name, price, features } = req.body;
    const result = await db.query(
      'UPDATE subscription_plans SET name = $1, price = $2, features = $3, updated_at = NOW() WHERE id = $4 RETURNING *',
      [name, price, features, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete subscription plan
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM subscription_plans WHERE id = $1', [req.params.id]);
    res.json({ message: 'Plan deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
