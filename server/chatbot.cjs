const express = require('express');
const db = require('./db.cjs');

const router = express.Router();

// Fetch public hotel config by slug
router.get('/hotel/:slug', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, name, theme_color, welcome_message, logo_url, default_lang_code FROM hotels WHERE slug = $1`,
      [req.params.slug]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Hotel not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch hotel config' });
  }
});

// Placeholder chatbot interaction endpoint
router.post('/ask', async (req, res) => {
  res.json({ response: 'Fonctionnalité bientôt disponible.' });
});

router.post('/interactions', async (req, res) => {
  res.json({ success: true });
});

module.exports = router;
