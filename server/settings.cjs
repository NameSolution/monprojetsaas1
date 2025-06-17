const express = require('express');
const db = require('./db.cjs');

const router = express.Router();

// Get AI settings
router.get('/ai', async (req, res) => {
  try {
    const { rows } = await db.query("SELECT key, value FROM settings WHERE key IN ('ai_api_url','ai_api_key')");
    const settings = Object.fromEntries(rows.map(r => [r.key, r.value]));
    res.json({ ai_api_url: settings.ai_api_url || '', ai_api_key: settings.ai_api_key || '' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// Update AI settings
router.put('/ai', async (req, res) => {
  const { ai_api_url, ai_api_key } = req.body;
  try {
    await db.query(
      `INSERT INTO settings (key, value) VALUES ('ai_api_url',$1)
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
      [ai_api_url]
    );
    await db.query(
      `INSERT INTO settings (key, value) VALUES ('ai_api_key',$1)
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
      [ai_api_key]
    );
    res.json({ ai_api_url, ai_api_key });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

module.exports = router;
