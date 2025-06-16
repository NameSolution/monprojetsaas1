
const express = require('express');

const router = express.Router();

const db = require('./db.cjs');

// Basic stats
router.get('/', async (req, res) => {
  try {
    const users = await db.query('SELECT COUNT(*) FROM users');
    const hotels = await db.query('SELECT COUNT(*) FROM hotels');
    const tickets = await db.query('SELECT COUNT(*) FROM support_tickets');

    const stats = {
      totalUsers: Number(users.rows[0].count),
      totalHotels: Number(hotels.rows[0].count),
      totalTickets: Number(tickets.rows[0].count),
    };

    res.json({ stats });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Alias for backwards compatibility
router.get('/overview', async (req, res) => {
  try {
    const users = await db.query('SELECT COUNT(*) FROM users');
    const hotels = await db.query('SELECT COUNT(*) FROM hotels');
    const tickets = await db.query('SELECT COUNT(*) FROM support_tickets');
    const stats = {
      totalUsers: Number(users.rows[0].count),
      totalHotels: Number(hotels.rows[0].count),
      totalTickets: Number(tickets.rows[0].count),
    };
    res.json({ stats });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Get chart data
router.get('/chart-data', async (req, res) => {
  try {
    res.json({ chartData: [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get recent activity
router.get('/recent-activity', async (req, res) => {
  try {
    res.json({ recentActivity: [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
