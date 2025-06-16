const express = require('express');
const db = require('./db.cjs');
const router = express.Router();

// Get all hotels (superadmin only)
router.get('/', async (req, res) => {
  try {
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const result = await db.query(`
      SELECT h.*, p.name as plan_name, pr.name as user_name 
      FROM hotels h 
      LEFT JOIN subscription_plans p ON h.plan_id = p.id
      LEFT JOIN profiles pr ON h.user_id = pr.id
      ORDER BY h.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch hotels' });
  }
});

// Get hotel by user
router.get('/my-hotel', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT h.*, p.name as plan_name 
      FROM hotels h 
      LEFT JOIN subscription_plans p ON h.plan_id = p.id
      WHERE h.user_id = $1 OR EXISTS (
        SELECT 1 FROM profiles pr WHERE pr.id = $1 AND pr.hotel_id = h.id
      )
    `, [req.user.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Hotel not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch hotel' });
  }
});

// Create hotel
router.post('/', async (req, res) => {
  try {
    const { name, slug, plan_id, theme_color, welcome_message, contact_name, contact_email, address, phone, email } = req.body;
    const result = await db.query(`
      INSERT INTO hotels (user_id, name, slug, plan_id, theme_color, welcome_message, contact_name, contact_email, address, phone, email)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `, [req.user.id, name, slug, plan_id, theme_color, welcome_message, contact_name, contact_email, address, phone, email]);

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create hotel' });
  }
});

// Update hotel
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, theme_color, welcome_message, contact_name, contact_email, status } = req.body;

  try {
    const result = await db.query(`
      UPDATE hotels 
      SET name = $1, theme_color = $2, welcome_message = $3, contact_name = $4, 
          contact_email = $5, status = $6, updated_at = CURRENT_TIMESTAMP
      WHERE id = $7 AND (user_id = $8 OR $9 = 'superadmin')
      RETURNING *
    `, [name, theme_color, welcome_message, contact_name, contact_email, status, id, req.user.id, req.user.role]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Hotel not found or access denied' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update hotel' });
  }
});

// Delete hotel
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    await db.query('DELETE FROM hotels WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete hotel' });
  }
});

module.exports = router;