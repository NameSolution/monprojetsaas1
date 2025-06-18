const express = require('express');
const db = require('./db.cjs');
const router = express.Router();

// Return combined hotel and user info
router.get('/', async (req, res) => {
  try {
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({ error: 'Access denied' });
    }
    const result = await db.query(`
      SELECT h.id AS hotel_id, h.name AS hotel_name, h.slug, h.contact_name,
             h.contact_email, h.status, h.created_at, h.updated_at,
             u.id AS user_id, u.email, p.name AS user_name, p.role
        FROM hotels h
        JOIN users u ON h.user_id = u.id
        JOIN profiles p ON p.user_id = u.id
       ORDER BY h.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch clients' });
  }
});

module.exports = router;
