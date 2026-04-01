const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Event = require('../models/Event');
const Notification = require('../models/Notification');
const verifyToken = require('../middleware/verifyToken');

// Create booking + instant notification
router.post('/create', verifyToken, async (req, res) => {
  try {
    const { eventId, seats } = req.body;
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const available = event.totalSeats - event.bookedSeats;
    if (seats > available) {
      return res.status(400).json({ message: 'Not enough seats available' });
    }

    const booking = await Booking.create({
      user: req.user.id,
      event: eventId,
      seats,
      totalAmount: event.price * seats,
      status: 'confirmed',
    });

    event.bookedSeats += seats;
    await event.save();

    // Instant booking confirmation notification
    const eventDateFormatted = new Date(event.date).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'long', year: 'numeric'
    });

    await Notification.create({
      user: req.user.id,
      event: eventId,
      message: `Yay!! You have booked ${seats} ticket${seats > 1 ? 's' : ''} for "${event.title}" — happening on ${eventDateFormatted}. See you there!`,
    });

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get my bookings
router.get('/my', verifyToken, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('event')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Cancel booking
router.patch('/:id/cancel', verifyToken, async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user.id })
      .populate('event');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    booking.status = 'cancelled';
    await booking.save();

    await Event.findByIdAndUpdate(booking.event._id, {
      $inc: { bookedSeats: -booking.seats },
    });

    const eventName = booking.event?.title || 'the event';
    const eventDate = booking.event?.date
      ? new Date(booking.event.date).toLocaleDateString('en-IN', {
          day: 'numeric', month: 'long', year: 'numeric'
        })
      : '';

    await Notification.create({
      user: req.user.id,
      event: booking.event._id,
      message: `You have cancelled your booking for "${eventName}" on ${eventDate}. Your payment of ₹${booking.totalAmount.toLocaleString()} will be refunded within 5-7 business days.`,
    });

    res.json({ message: 'Booking cancelled' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;