const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./server/auth.cjs');
const hotelRoutes = require('./server/hotels.cjs');
const userRoutes = require('./server/users.cjs');
const analyticsRoutes = require('./server/analytics.cjs');
const supportRoutes = require('./server/support.cjs');
const planRoutes = require('./server/plans.cjs');
const languageRoutes = require('./server/languages.cjs');
const chatbotRoutes = require('./server/chatbot.cjs');
const knowledgeRoutes = require('./server/knowledge.cjs');
const billingRoutes = require('./server/billing.cjs');
// Upload functionality will be integrated directly

const authMiddleware = require('./server/authMiddleware.cjs');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://hotelbot-ai-saas.replit.app']
    : ['http://localhost:3000', 'http://localhost:5173', 'http://0.0.0.0:5000'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/hotels', authMiddleware, hotelRoutes);
app.use('/api/users', authMiddleware, userRoutes);
app.use('/api/analytics', authMiddleware, analyticsRoutes);
app.use('/api/support', authMiddleware, supportRoutes);
app.use('/api/plans', authMiddleware, planRoutes);
app.use('/api/languages', authMiddleware, languageRoutes);
app.use('/api/knowledge', authMiddleware, knowledgeRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/billing', authMiddleware, billingRoutes);
app.use('/api/upload', authMiddleware, uploadRoutes);
app.use('/storage', express.static(path.join(__dirname, 'storage')));
// Upload routes integrated directly

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Serve React app for all other routes using a catch-all pattern
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Handle process termination gracefully
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});
