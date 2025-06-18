const express = require('express');
const db = require('./db.cjs');

const router = express.Router();

// Get customization for the current user's hotel
router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query(
      'SELECT * FROM hotel_customizations WHERE hotel_id = $1',
      [req.user.hotel_id]
    );
    if (rows.length === 0) {
      return res.json({
        name: 'Assistant Virtuel',
        welcome_message: 'Bienvenue',
        theme_color: '#2563EB',
        logo_url: null,
        menu_items: []
      });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch customization' });
  }
});

// Update or insert customization
router.put('/', async (req, res) => {
  try {
    const { name, welcome_message, theme_color, logo_url, default_language, menu_items } = req.body;
    const { rows } = await db.query(
      'SELECT id FROM hotel_customizations WHERE hotel_id = $1',
      [req.user.hotel_id]
    );
    if (rows.length) {
      const result = await db.query(
        `UPDATE hotel_customizations
         SET name = COALESCE($1,name),
             welcome_message = COALESCE($2,welcome_message),
             theme_color = COALESCE($3,theme_color),
             logo_url = COALESCE($4,logo_url),
             default_language = COALESCE($5,default_language),
             menu_items = COALESCE($6,menu_items),
             updated_at = NOW()
         WHERE hotel_id = $7 RETURNING *`,
        [name, welcome_message, theme_color, logo_url, default_language, menu_items, req.user.hotel_id]
      );
      return res.json(result.rows[0]);
    } else {
      const result = await db.query(
        `INSERT INTO hotel_customizations (hotel_id, name, welcome_message, theme_color, logo_url, default_language, menu_items)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [req.user.hotel_id, name, welcome_message, theme_color, logo_url, default_language, menu_items]
      );
      return res.json(result.rows[0]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update customization' });
  }
});

module.exports = router;
