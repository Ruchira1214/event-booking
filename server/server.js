const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/events', require('./routes/event.routes'));
app.use('/api/bookings', require('./routes/booking.routes'));
app.use('/api/notifications', require('./routes/notification.routes'));

// Health check
app.get('/', (req, res) => res.json({ message: 'Event Booking API running' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));