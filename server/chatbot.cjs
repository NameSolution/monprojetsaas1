const express = require('express');
const db = require('./db.cjs');

let openai;
async function getOpenAI() {
  if (!openai) {
    const { default: OpenAI } = await import('openai');
    openai = new OpenAI({
      baseURL: process.env.AI_API_URL || 'https://openrouter.ai/api/v1',
      apiKey: process.env.AI_API_KEY || '',
    });
  }
  return openai;
}

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

    const client = await getOpenAI();
    const messages = [
      { role: 'system', content: knowledge.join('\n') },
      ...historyRows.flatMap(h => [
        { role: 'user', content: h.user_input },
        { role: 'assistant', content: h.bot_response }
      ]),
      { role: 'user', content: prompt }
    ];
    const completion = await client.chat.completions.create({
      model: process.env.AI_MODEL || 'google/gemma-3n-e4b-it:free',
      messages
    });
    const responseText = completion.choices?.[0]?.message?.content || '';

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
