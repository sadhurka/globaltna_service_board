const path = require('path');
// Resolve .env relative to the current file directory to ensure correct loading regardless of from where Node was launched
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const jobsRouter = require('./routes/jobs');
const authRouter = require('./routes/auth'); // Admin authentication entry route

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Sanitize and normalize duplicate slashes in request URL path (e.g., //api/jobs -> /api/jobs)
app.use((req, res, next) => {
  if (req.url.includes('//')) {
    req.url = req.url.replace(/\/\/+/g, '/');
  }
  next();
});

// Routes
app.get('/', (_req, res) => res.json({
  success: true,
  message: 'GlobalTNA Service Request Board API is running',
  version: '1.0.0',
  endpoints: {
    health: '/health',
    auth: '/api/auth/login',
    jobs: '/api/jobs'
  }
}));
app.get('/favicon.ico', (_req, res) => res.status(204).end());
app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRouter); // Exposes POST /api/auth/login
app.use('/api/jobs', jobsRouter);  // Exposes REST endpoints for job requests

// 404 handler for unmatched routes
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// Database connection and server start
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/globaltna';

console.log('Connecting to:', MONGODB_URI);
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('✅  MongoDB connected');
  })
  .catch((err) => {
    console.error('❌  MongoDB connection error:', err.message);
  });

if (require.main === module) {
  app.listen(PORT, () => console.log(`🚀  API running on http://localhost:${PORT}`));
}

module.exports = app;