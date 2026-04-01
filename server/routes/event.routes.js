const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const verifyToken = require('../middleware/verifyToken');
const isAdmin = require('../middleware/isAdmin');

// Public: get active events / Admin: get all events
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    const query = {};

    // Check if request is from admin
    const authHeader = req.headers.authorization;
    let isAdmin = false;
    if (authHeader?.startsWith('Bearer ')) {
      try {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
        isAdmin = decoded.role === 'admin';
      } catch {}
    }

    // Only filter active events for non-admins
    if (!isAdmin) query.isActive = true;

    if (category && category !== 'All') query.category = category;
    if (search) query.title = { $regex: search, $options: 'i' };

    const events = await Event.find(query).sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Public: get single event
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: create event
router.post('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: update event
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: delete event
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;