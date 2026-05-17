const express = require('express');
const router = express.Router();

router.post('/login', (req, res) => {
  const { password } = req.body;
  const adminPassword = process.env.ADMIN_PASSWORD || 'GlobalTnaAdmin2026';

  if (!password || password !== adminPassword) {
    return res.status(401).json({ success: false, message: 'Invalid administration password' });
  }

  // Use the admin password itself as the authorization token, completely removing JWT overhead
  res.json({ success: true, token: adminPassword });
});

module.exports = router;