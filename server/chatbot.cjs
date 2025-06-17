const express = require('express');
const db = require('./db.cjs');

// Rely on Node 18+ built-in fetch
const fetch = global.fetch;

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

// Forward question to AI model and store the interaction
router.post('/ask', async (req, res) => {
  const { hotel_id, session_id, lang, prompt } = req.body;
  try {
    const aiRes = await fetch(process.env.AI_API_URL || 'http://localhost:3001/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, lang, session_id, hotel_id })
    });
    const data = await aiRes.json().catch(() => ({ response: '' }));
    const responseText = data.response || '';

    const insert = await db.query(
      `INSERT INTO interactions (hotel_id, session_id, lang_code, user_input, bot_response)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [hotel_id, session_id, lang, prompt, responseText]
    );

    res.json({ response: responseText, id: insert.rows[0].id });
  } catch (err) {
    console.error('Failed to handle ask:', err);
    res.status(500).json({ error: 'Failed to process request' });
  }
});

// Store feedback for an interaction
router.post('/interactions', async (req, res) => {
  const { hotel_id, session_id, lang, input, output } = req.body;
  try {
    const insert = await db.query(
      `INSERT INTO interactions (hotel_id, session_id, lang_code, user_input, bot_response)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [hotel_id, session_id, lang, input, output]
    );
    res.json({ id: insert.rows[0].id });
  } catch (err) {
    console.error('Failed to log interaction:', err);
    res.status(500).json({ error: 'Failed to log interaction' });
  }
});

router.post('/interactions/rate', async (req, res) => {
  const { interaction_id, rating } = req.body;
  try {
    await db.query('UPDATE interactions SET feedback = $2 WHERE id = $1', [interaction_id, rating]);
    res.json({ success: true });
  } catch (err) {
    console.error('Failed to rate interaction:', err);
    res.status(500).json({ error: 'Failed to rate interaction' });
  }
});

module.exports = router;
