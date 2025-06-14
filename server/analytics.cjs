
const express = require('express');
const db = require('./db.cjs');

const router = express.Router();

// Get analytics overview
router.get('/overview', async (req, res) => {
  try {
    // Get basic counts
    const [usersResult, hotelsResult, conversationsResult] = await Promise.all([
      db.query('SELECT COUNT(*) FROM users'),
      db.query('SELECT COUNT(*) FROM hotels'),
      db.query('SELECT COUNT(*) FROM conversations')
    ]);

    const stats = {
      totalUsers: parseInt(usersResult.rows[0].count),
      totalHotels: parseInt(hotelsResult.rows[0].count),
      totalConversations: parseInt(conversationsResult.rows[0].count)
    };

    res.json({ stats });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get chart data
router.get('/chart-data', async (req, res) => {
  try {
    // For now, return mock data
    const chartData = [
      { name: 'Jan', conversations: 400, users: 240 },
      { name: 'Feb', conversations: 300, users: 139 },
      { name: 'Mar', conversations: 200, users: 980 },
      { name: 'Apr', conversations: 278, users: 390 },
      { name: 'May', conversations: 189, users: 480 },
      { name: 'Jun', conversations: 239, users: 380 },
    ];

    res.json({ chartData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get recent activity
router.get('/recent-activity', async (req, res) => {
  try {
    // For now, return mock data
    const recentActivity = [
      { id: 1, type: 'user_registered', description: 'New user registered', timestamp: new Date() },
      { id: 2, type: 'hotel_created', description: 'Hotel "Grand Palace" created', timestamp: new Date() },
      { id: 3, type: 'conversation_started', description: 'New conversation started', timestamp: new Date() }
    ];

    res.json({ recentActivity });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
