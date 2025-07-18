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
      SELECT h.*
      FROM hotels h
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
    const result = await db.query(
      `SELECT h.*,
        COALESCE(json_agg(json_build_object('code', hl.lang_code,
                                     'name', l.name,
                                     'active', hl.is_active))
                 FILTER (WHERE hl.lang_code IS NOT NULL), '[]') AS languages
       FROM profiles pr
       JOIN hotels h ON h.id = pr.hotel_id
       LEFT JOIN hotel_languages hl ON hl.hotel_id = h.id
       LEFT JOIN languages l ON l.code = hl.lang_code
       WHERE pr.user_id = $1
       GROUP BY h.id`
      , [req.user.id]
    );

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
    const { name, description, logo_url, default_lang_code, contact_name, contact_email } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Hotel name is required' });
    }
    const result = await db.query(
      `INSERT INTO hotels (name, description, logo_url, default_lang_code, contact_name, contact_email)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [name, description, logo_url, default_lang_code, contact_name, contact_email]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create hotel' });
  }
});

// Update hotel
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, logo_url, default_lang_code, contact_name, contact_email, languages } = req.body;

  try {
    const result = await db.query(
      `UPDATE hotels
       SET name = COALESCE($1, name),
           description = COALESCE($2, description),
           logo_url = COALESCE($3, logo_url),
           default_lang_code = COALESCE($4, default_lang_code),
           contact_name = COALESCE($5, contact_name),
           contact_email = COALESCE($6, contact_email),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $7
       RETURNING *`,
      [name, description, logo_url, default_lang_code, contact_name, contact_email, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Hotel not found or access denied' });
    }

    if (Array.isArray(languages)) {
      const codes = languages.map(l => l.code);
      for (const lang of languages) {
        await db.query(
          `INSERT INTO hotel_languages (hotel_id, lang_code, is_active)
           VALUES ($1, $2, $3)
           ON CONFLICT (hotel_id, lang_code)
           DO UPDATE SET is_active = EXCLUDED.is_active`,
          [id, lang.code, !!lang.active]
        );
      }
      if (codes.length) {
        await db.query(
          `DELETE FROM hotel_languages WHERE hotel_id = $1 AND lang_code NOT IN (${codes.map((_,i)=>'$'+(i+2)).join(',')})`,
          [id, ...codes]
        );
      }
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

    // Clear references from profiles before deleting the hotel
    await db.query('UPDATE profiles SET hotel_id = NULL WHERE hotel_id = $1', [id]);
    await db.query('DELETE FROM hotel_languages WHERE hotel_id = $1', [id]);
    await db.query('DELETE FROM hotels WHERE id = $1', [id]);

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete hotel' });
  }
});

module.exports = router;
