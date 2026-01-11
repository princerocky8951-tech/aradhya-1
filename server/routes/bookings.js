const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const { verifyToken, verifyAdmin } = require('../middleware/auth');
const { sendBookingStatusEmail } = require('../utils/email');

// Create Booking (User)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { city, preferredDate, message, userName } = req.body;
    const newBooking = new Booking({
      userId: req.user.id,
      userName: userName || 'Devotee',
      city,
      preferredDate,
      message
    });
    await newBooking.save();
    res.status(201).json(newBooking);
  } catch (err) {
    res.status(500).json({ message: 'Booking failed' });
  }
});

// Get Bookings (Admin: All, User: Own)
router.get('/', verifyToken, async (req, res) => {
  try {
    let bookings;
    if (req.user.role === 'admin') {
      bookings = await Booking.find().sort({ createdAt: -1 });
    } else {
      bookings = await Booking.find({ userId: req.user.id }).sort({ createdAt: -1 });
    }
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update Status (Admin Only)
router.put('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    
    // Find booking and populate user to get email
    const booking = await Booking.findById(req.params.id).populate('userId');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    booking.status = status;
    await booking.save();

    // Send Notification Email
    if (booking.userId && booking.userId.email) {
      await sendBookingStatusEmail(
        booking.userId.email,
        booking.userName,
        status,
        booking.city,
        booking.preferredDate
      );
    }

    res.json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Update failed' });
  }
});

// Delete Booking (Admin or Owner)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Petition not found' });

    // Only Admin or the User who created it can delete
    if (req.user.role !== 'admin' && booking.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to purge this record' });
    }

    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: 'Petition purged from registry' });
  } catch (err) {
    res.status(500).json({ message: 'Purge failed' });
  }
});

module.exports = router;