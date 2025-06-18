const express = require('express');
const db = require('./db.cjs');

async function callLLM(messages, model) {
  let settings = {};
  try {
    const { rows } = await db.query(
      "SELECT key, value FROM settings WHERE key IN ('ai_api_url','ai_api_key','ai_model')"
    );
    settings = Object.fromEntries(rows.map(r => [r.key, r.value]));
  } catch (err) {
    console.error('Failed to load AI settings from DB:', err.message);
  }
  const endpoint = (settings.ai_api_url || process.env.AI_API_URL || 'http://localhost:11434/v1')
    .replace(/\/?$/, '') +
    '/chat/completions';
  const key =
    settings.ai_api_key ||
    process.env.AI_API_KEY ||
    process.env.OPENROUTER_API_KEY ||
    '';
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(key ? { Authorization: `Bearer ${key}` } : {}),
      ...(process.env.SITE_URL ? { 'HTTP-Referer': process.env.SITE_URL } : {}),
      ...(process.env.SITE_NAME ? { 'X-Title': process.env.SITE_NAME } : {})
    },
    body: JSON.stringify({
      model: model || settings.ai_model || process.env.AI_MODEL || 'phi3:mini',
      messages
    })
  });
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`LLM request failed: ${res.status} ${text}`);
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}

const router = express.Router();

// Fetch public hotel config by slug
router.get('/hotel/:slug', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT h.id,
              COALESCE(c.name,h.name) AS name,
              COALESCE(c.theme_color,h.theme_color) AS theme_color,
              COALESCE(c.welcome_message,h.welcome_message) AS welcome_message,
              COALESCE(c.logo_url,h.logo_url) AS logo_url,
              COALESCE(c.default_language,h.default_lang_code) AS default_lang_code,
              c.menu_items,
              COALESCE(json_agg(json_build_object('code', hl.lang_code,
                                          'name', l.name,
                                          'active', hl.is_active))
                  FILTER (WHERE hl.lang_code IS NOT NULL), '[]') AS languages
         FROM hotels h
         LEFT JOIN hotel_customizations c ON c.hotel_id = h.id
         LEFT JOIN hotel_languages hl ON hl.hotel_id = h.id
         LEFT JOIN languages l ON l.code = hl.lang_code
        WHERE h.slug = $1
        GROUP BY h.id, c.id`,
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

// Simple keyword extractor
function extractKeywords(text) {
  if (!text) return '';
  const stop = new Set(['the','a','and','of','to','is','in','for','la','le','et','les','des','de','un','une']);
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(w => w && !stop.has(w))
    .slice(0, 5)
    .join(',');
}

// Forward question to AI model and store the interaction with context
router.post('/ask', async (req, res) => {
  const { hotel_id, session_id, lang, prompt } = req.body;
  try {
    // Load knowledge base snippets for context
    const { rows: knowledgeRows } = await db.query(
      'SELECT info FROM knowledge_items WHERE hotel_id = $1 ORDER BY created_at DESC LIMIT 20',
      [hotel_id]
    );
    const knowledge = knowledgeRows.map(r => r.info);

    // Load last interactions for conversation memory
    const { rows: historyRows } = await db.query(
      `SELECT user_input, bot_response FROM interactions
        WHERE hotel_id = $1 AND session_id = $2
        ORDER BY timestamp ASC LIMIT 5`,
      [hotel_id, session_id]
    );

    const systemParts = [...knowledge];
    if (lang) {
      systemParts.push(`Please answer in ${lang}`);
    }

    const messages = [
      { role: 'system', content: systemParts.join('\n') },
      ...historyRows.flatMap(h => [
        { role: 'user', content: h.user_input },
        { role: 'assistant', content: h.bot_response }
      ]),
      { role: 'user', content: prompt }
    ];
    const responseText = await callLLM(messages, process.env.AI_MODEL || 'phi3:mini');

    const keywords = extractKeywords(prompt);
    const insert = await db.query(
      `INSERT INTO interactions (hotel_id, session_id, lang_code, user_input, bot_response, keywords)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [hotel_id, session_id, lang, prompt, responseText, keywords]
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
    const keywords = extractKeywords(input);
    const insert = await db.query(
      `INSERT INTO interactions (hotel_id, session_id, lang_code, user_input, bot_response, keywords)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [hotel_id, session_id, lang, input, output, keywords]
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
