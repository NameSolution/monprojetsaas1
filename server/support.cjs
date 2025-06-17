
const express = require('express');
const db = require('./db.cjs');

const router = express.Router();

// Get all support tickets
router.get('/tickets', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT st.*, p.name AS submitter_name, u.email AS submitter_email,
             h.name AS hotel_name, h.contact_name, h.contact_email
        FROM support_tickets st
        LEFT JOIN users u ON st.user_id = u.id
        LEFT JOIN profiles p ON p.user_id = u.id
        LEFT JOIN hotels h ON st.hotel_id = h.id
       ORDER BY st.created_at DESC`);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create support ticket
router.post('/tickets', async (req, res) => {
  try {
    const { title, description, priority, hotel_id } = req.body;
    // Get submitter details
    const { rows: userRows } = await db.query(
      `SELECT p.name, u.email, p.hotel_id
         FROM users u
         JOIN profiles p ON u.id = p.user_id
        WHERE u.id = $1`,
      [req.user.id]
    );
    const userInfo = userRows[0] || {};
    const result = await db.query(
      `INSERT INTO support_tickets (user_id, hotel_id, submitter_name, submitter_email, title, description, priority, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'Nouveau') RETURNING *`,
      [
        req.user.id,
        hotel_id || userInfo.hotel_id || req.user.hotel_id,
        userInfo.name || '',
        userInfo.email || '',
        title,
        description,
        priority || 'Moyenne'
      ]
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
    const { status, description, internal_notes } = req.body;
    const result = await db.query(
      `UPDATE support_tickets SET status = $1, description = COALESCE($2, description),
        internal_notes = COALESCE($3, internal_notes), updated_at = NOW() WHERE id = $4 RETURNING *`,
      [status, description, internal_notes, req.params.id]
    );
    const ticketId = result.rows[0].id;
    const { rows } = await db.query(
      `SELECT st.*, p.name AS submitter_name, u.email AS submitter_email,
              h.name AS hotel_name, h.contact_name, h.contact_email
         FROM support_tickets st
         LEFT JOIN users u ON st.user_id = u.id
         LEFT JOIN profiles p ON p.user_id = u.id
         LEFT JOIN hotels h ON st.hotel_id = h.id
        WHERE st.id = $1`,
      [ticketId]
    );
    res.json(rows[0]);
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
