
const express = require('express');
const db = require('./db.cjs');

const router = express.Router();

// Get all support tickets
router.get('/tickets', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM support_tickets ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create support ticket
router.post('/tickets', async (req, res) => {
  try {
    const { title, description, priority } = req.body;
    const result = await db.query(
      'INSERT INTO support_tickets (user_id, title, description, priority, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [req.user.id, title, description, priority || 'medium', 'open']
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update support ticket
router.put('/tickets/:id', async (req, res) => {
  try {
    const { status, description } = req.body;
    const result = await db.query(
      'UPDATE support_tickets SET status = $1, description = COALESCE($2, description), updated_at = NOW() WHERE id = $3 RETURNING *',
      [status, description, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete support ticket (superadmin only)
router.delete('/tickets/:id', async (req, res) => {
  try {
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    await db.query('DELETE FROM support_tickets WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
