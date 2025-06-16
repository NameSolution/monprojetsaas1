
const express = require('express');

const router = express.Router();

// For now, return mock analytics so the dashboard doesn't crash
const mockStats = {
  totalUsers: 0,
  totalHotels: 0,
  totalConversations: 0
};

// Basic stats
router.get('/', (req, res) => {
  res.json({ stats: mockStats });
});

// Alias for backwards compatibility
router.get('/overview', (req, res) => {
  res.json({ stats: mockStats });
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
