module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Access denied. No authentication token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const adminPassword = process.env.ADMIN_PASSWORD || 'GlobalTnaAdmin2026';

    if (token !== adminPassword) {
      return res.status(403).json({ success: false, message: 'Invalid or expired authorization token.' });
    }

    req.user = { role: 'admin' };
    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: 'Invalid or expired authorization token.' });
  }
};