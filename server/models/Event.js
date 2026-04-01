const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: {
    type: String,
    enum: ['Concerts & Music', 'Tech Conferences', 'Sports', 'Workshops & Learning'],
    required: true,
  },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  totalSeats: { type: Number, required: true },
  bookedSeats: { type: Number, default: 0 },
  image: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);