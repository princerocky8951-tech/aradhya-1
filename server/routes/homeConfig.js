
const express = require('express');
const router = express.Router();
const HomeConfig = require('../models/HomeConfig');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

// Get current config (Public)
router.get('/', async (req, res) => {
  try {
    let config = await HomeConfig.findOne();
    if (!config) {
      config = new HomeConfig();
      await config.save();
    }
    res.json(config);
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve site configuration' });
  }
});

// Update config (Admin Only)
router.put('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    let config = await HomeConfig.findOne();
    if (!config) {
      config = new HomeConfig(req.body);
    } else {
      Object.assign(config, req.body);
    }
    await config.save();
    res.json(config);
  } catch (err) {
    res.status(500).json({ message: 'Update failed' });
  }
});

module.exports = router;
