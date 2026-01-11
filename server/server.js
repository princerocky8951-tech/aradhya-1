
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth');
const mediaRoutes = require('./routes/media');
const bookingRoutes = require('./routes/bookings');
const homeRoutes = require('./routes/homeConfig');
const siteRoutes = require('./routes/siteConfig');

const app = express();

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Required for loading cross-origin media like Cloudinary
}));

// Update CORS for production
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json({ limit: '50mb' })); 

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100 
});
app.use('/api', limiter);

// Database Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB Connected');
}).catch(err => console.error('MongoDB Connection Error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/home-config', homeRoutes);
app.use('/api/site-config', siteRoutes);

// Export for Vercel
module.exports = app;

// Only listen if running locally
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
