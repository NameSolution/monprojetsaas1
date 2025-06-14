
const express = require('express');
// Use bcryptjs consistently across the project
const bcrypt = require('bcryptjs');
const db = require('./db.cjs');

const router = express.Router();

// Get all users (superadmin only)
router.get('/', async (req, res) => {
  try {
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const result = await db.query(`
      SELECT p.*, u.email, h.name as hotel_name
      FROM profiles p
      JOIN users u ON p.id = u.id
      LEFT JOIN hotels h ON p.hotel_id = h.id
      ORDER BY p.created_at DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Create user
router.post('/', async (req, res) => {
  const { email, password, name, role, hotel_id } = req.body;

  try {
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const hashed = await bcrypt.hash(password, 10);

    const userRes = await db.query(
      "INSERT INTO users (id, email, password_hash) VALUES (gen_random_uuid(), $1, $2) RETURNING id",
      [email, hashed]
    );

    const userId = userRes.rows[0].id;

    const profileRes = await db.query(
      "INSERT INTO profiles (id, name, role, hotel_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [userId, name, role, hotel_id]
    );

    res.json({ ...profileRes.rows[0], email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Update user
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, role, hotel_id } = req.body;

  try {
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const result = await db.query(`
      UPDATE profiles 
      SET name = $1, role = $2, hotel_id = $3, updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING *
    `, [name, role, hotel_id, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    await db.query('DELETE FROM profiles WHERE id = $1', [id]);
    await db.query('DELETE FROM users WHERE id = $1', [id]);

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

module.exports = router;
