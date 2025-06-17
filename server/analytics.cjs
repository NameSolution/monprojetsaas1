
const express = require('express');

const router = express.Router();

const db = require('./db.cjs');

// Basic stats
router.get('/', async (req, res) => {
  try {
    const userHotelId = req.user && req.user.role !== 'superadmin' ? req.user.hotel_id : null;

    const users = await db.query('SELECT COUNT(*) FROM users');
    const hotels = await db.query('SELECT COUNT(*) FROM hotels');
    const tickets = await db.query('SELECT COUNT(*) FROM support_tickets');

    const stats = {
      totalUsers: Number(users.rows[0].count),
      totalHotels: Number(hotels.rows[0].count),
      totalTickets: Number(tickets.rows[0].count),
    };

    const convQuery = `SELECT to_char(timestamp::date, 'YYYY-MM-DD') AS day, COUNT(*)
      FROM interactions
      ${userHotelId ? 'WHERE hotel_id = $1' : ''}
      GROUP BY day ORDER BY day DESC LIMIT 7`;
    const convParams = userHotelId ? [userHotelId] : [];
    const convRes = await db.query(convQuery, convParams);
    const conversationData = convRes.rows.map(r => ({ name: r.day, conversations: Number(r.count) })).reverse();

    const themeQuery = `SELECT intent_detected AS name, COUNT(*) AS count
      FROM interactions
      WHERE intent_detected IS NOT NULL
      ${userHotelId ? 'AND hotel_id = $1' : ''}
      GROUP BY intent_detected
      ORDER BY count DESC LIMIT 5`;
    const themeRes = await db.query(themeQuery, convParams);
    const topThemes = themeRes.rows.map(r => ({ name: r.name, count: Number(r.count) }));

    res.json({ stats, conversationData, topThemes });
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
