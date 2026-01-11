
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendOTPEmail } = require('../utils/email');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

// Generate Tokens
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user._id, role: user.role }, 
    process.env.JWT_SECRET, 
    { expiresIn: '1h' } // Increased for better admin session stability
  );
  
  const refreshToken = jwt.sign(
    { id: user._id }, 
    process.env.JWT_REFRESH_SECRET, 
    { expiresIn: '7d' }
  );
  
  return { accessToken, refreshToken };
};

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    user = new User({ name, email, password });
    await user.save();

    const tokens = generateTokens(user);
    res.json({ ...tokens, user: { id: user._id, name: user.name, role: user.role, createdAt: user.createdAt } });
  } catch (err) {
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login (Step 1: Credentials Check & OTP Send)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    if (user.isSuspended) {
      return res.status(403).json({ message: 'Your access has been revoked by the Goddess. You are banished.' });
    }

    if (password !== user.password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    user.otpCode = otp;
    user.otpExpires = otpExpires;
    await user.save();

    const emailSent = await sendOTPEmail(email, otp);
    if (!emailSent) {
      return res.status(500).json({ message: 'Failed to send verification code. Check email relay status.' });
    }

    res.json({ message: 'OTP sent successfully', requiresOtp: true });
  } catch (err) {
    res.status(500).json({ message: 'Server error during login initiation' });
  }
});

// Verify OTP for Login
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.otpCode !== otp) {
      return res.status(400).json({ message: 'Invalid or expired code' });
    }

    if (user.isSuspended) {
       return res.status(403).json({ message: 'Access denied. Account suspended.' });
    }

    if (new Date() > user.otpExpires) {
      return res.status(400).json({ message: 'Code has expired' });
    }

    user.otpCode = undefined;
    user.otpExpires = undefined;
    await user.save();

    const tokens = generateTokens(user);
    res.json({ ...tokens, user: { id: user._id, name: user.name, role: user.role, createdAt: user.createdAt, isSuspended: user.isSuspended } });
  } catch (err) {
    res.status(500).json({ message: 'Verification protocol failed' });
  }
});

// Request OTP for Password Update (Secure Protocol)
// FULL ROUTE: POST /api/auth/request-password-update-otp
router.post('/request-password-update-otp', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'Identity not found in registry' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins for security tasks

    user.otpCode = otp;
    user.otpExpires = otpExpires;
    await user.save();

    const emailSent = await sendOTPEmail(user.email, otp);
    if (!emailSent) return res.status(500).json({ message: 'Email relay protocol failed' });

    res.json({ message: 'Secure OTP dispatched to registered relay' });
  } catch (err) {
    res.status(500).json({ message: 'Internal security node error' });
  }
});

// Verify OTP and Update Password (Secure Protocol)
// FULL ROUTE: POST /api/auth/verify-password-update
router.post('/verify-password-update', verifyToken, async (req, res) => {
  try {
    const { otp, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    if (!user || user.otpCode !== otp) {
      return res.status(400).json({ message: 'Invalid or expired secure code' });
    }

    if (new Date() > user.otpExpires) {
      return res.status(400).json({ message: 'Security window closed' });
    }

    user.password = newPassword; // Hashing should be implemented here in production
    user.otpCode = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({ message: 'Registry updated. Security protocol complete.' });
  } catch (err) {
    res.status(500).json({ message: 'Update protocol failure' });
  }
});

// Admin: Get all users
router.get('/users', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password -otpCode -otpExpires');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch devotee registry' });
  }
});

// Admin: Toggle Suspend User
router.put('/users/:id/suspend', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'admin') return res.status(403).json({ message: 'Cannot suspend another authority' });

    user.isSuspended = !user.isSuspended;
    await user.save();
    res.json({ message: `User ${user.isSuspended ? 'suspended' : 'reinstated'}`, user });
  } catch (err) {
    res.status(500).json({ message: 'Suspension protocol failed' });
  }
});

// Admin: Delete User
router.delete('/users/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'admin') return res.status(403).json({ message: 'Cannot delete another authority' });

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User permanently removed from registry' });
  } catch (err) {
    res.status(500).json({ message: 'Purge protocol failed' });
  }
});

module.exports = router;
