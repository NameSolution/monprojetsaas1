const express = require('express');
const router = express.Router();

// Placeholder route to start a Stripe checkout session
router.post('/session', async (req, res) => {
  // TODO: integrate with Stripe using your secret key
  res.json({ url: 'https://example.com/checkout-session' });
});

module.exports = router;

