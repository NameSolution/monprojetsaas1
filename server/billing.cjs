const express = require('express');
const Stripe = require('stripe');
const router = express.Router();

const stripeSecret = process.env.STRIPE_SECRET;
const stripe = stripeSecret ? new Stripe(stripeSecret, { apiVersion: '2022-11-15' }) : null;

// Route to start a Stripe checkout session
router.post('/session', async (req, res) => {
  if (!stripe) {
    return res.status(500).json({ error: 'Billing not configured' });
  }
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [
        { price: process.env.STRIPE_PRICE_ID || 'price_123', quantity: 1 }
      ],
      success_url: req.body.success_url || 'https://example.com/success',
      cancel_url: req.body.cancel_url || 'https://example.com/cancel'
    });
    res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe session error:', err);
    res.status(500).json({ error: 'Failed to create billing session' });
  }
});

module.exports = router;

