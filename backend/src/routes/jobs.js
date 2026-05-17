const express = require('express');
const router = express.Router();
const JobRequest = require('../models/JobRequest');
const protect = require('../middleware/auth'); // JWT enforcement middleware

// GET /api/jobs — list all jobs with optional ?category= and ?status= filters
// Bonus: ?search= for full-text keyword search
// PUBLIC: Accessible by anyone/tradespeople
router.get('/', async (req, res, next) => {
  try {
    const { category, status, search } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (status) filter.status = status;

    // Keyword search across title + description (bonus feature)
    if (search && search.trim()) {
      filter.$text = { $search: search.trim() };
    }

    const jobs = await JobRequest.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: jobs.length, data: jobs });
  } catch (err) {
    next(err);
  }
});

// GET /api/jobs/:id — fetch single job
// PUBLIC: Accessible by anyone/tradespeople
router.get('/:id', async (req, res, next) => {
  try {
    const job = await JobRequest.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    res.json({ success: true, data: job });
  } catch (err) {
    // CastError handles malformed MongoDB ObjectIds gracefully
    if (err.name === 'CastError') {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    next(err);
  }
});

// POST /api/jobs — create a new job
// PROTECTED: Only authenticated administrators can post jobs
router.post('/', protect, async (req, res, next) => {
  try {
    const { title, description, category, location, contactName, contactEmail } = req.body;

    // Required field validation
    const missing = [];
    if (!title || !title.trim()) missing.push('title');
    if (!description || !description.trim()) missing.push('description');
    if (missing.length) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missing.join(', ')}`,
      });
    }

    const job = await JobRequest.create({
      title,
      description,
      category,
      location,
      contactName,
      contactEmail,
    });

    res.status(201).json({ success: true, data: job });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join('; ') });
    }
    next(err);
  }
});

// PATCH /api/jobs/:id — update status only
// PUBLIC/TRADE ACCESS: Tradespeople are authorized to mark jobs as "In Progress" or "Closed"
router.patch('/:id', async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowed = ['Open', 'In Progress', 'Closed'];

    if (!status) {
      return res.status(400).json({ success: false, message: 'status field is required' });
    }
    if (!allowed.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `status must be one of: ${allowed.join(', ')}`,
      });
    }

    const job = await JobRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    res.json({ success: true, data: job });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    next(err);
  }
});

// PUT /api/jobs/:id — update all job details
// PROTECTED: Only authenticated administrators can update jobs
router.put('/:id', protect, async (req, res, next) => {
  try {
    console.log(`[Backend] PUT /api/jobs/${req.params.id} called`); // Added to trigger nodemon restart
    const { title, description, category, location, contactName, contactEmail, status } = req.body;
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (location !== undefined) updateData.location = location;
    if (contactName !== undefined) updateData.contactName = contactName;
    if (contactEmail !== undefined) updateData.contactEmail = contactEmail;
    if (status !== undefined) updateData.status = status;

    const job = await JobRequest.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    res.json({ success: true, data: job });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    next(err);
  }
});

// DELETE /api/jobs/:id — delete a job
// PUBLIC/TRADE ACCESS: Tradespeople / system users can remove entries
router.delete('/:id', async (req, res, next) => {
  try {
    const job = await JobRequest.findByIdAndDelete(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    res.json({ success: true, message: 'Job deleted successfully' });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    next(err);
  }
});

module.exports = router;