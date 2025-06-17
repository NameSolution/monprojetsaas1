const express = require('express');
const db = require('./db.cjs');

const router = express.Router();

// Get all languages
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT code, name FROM languages ORDER BY name');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch languages' });
  }
});

module.exports = router;
