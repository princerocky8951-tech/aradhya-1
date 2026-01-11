
const express = require('express');
const router = express.Router();
const AboutConfig = require('../models/AboutConfig');
const ServicesConfig = require('../models/ServicesConfig');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

// --- ABOUT CONFIG ---
router.get('/about', async (req, res) => {
  try {
    let config = await AboutConfig.findOne();
    if (!config) { config = new AboutConfig(); await config.save(); }
    res.json(config);
  } catch (err) { res.status(500).json({ message: 'Failed to retrieve about configuration' }); }
});

router.put('/about', verifyToken, verifyAdmin, async (req, res) => {
  try {
    let config = await AboutConfig.findOne();
    if (!config) { config = new AboutConfig(req.body); } else { Object.assign(config, req.body); }
    await config.save();
    res.json(config);
  } catch (err) { res.status(500).json({ message: 'Update failed' }); }
});

// --- SERVICES CONFIG ---
router.get('/services', async (req, res) => {
  try {
    let config = await ServicesConfig.findOne();
    if (!config) { config = new ServicesConfig(); await config.save(); }
    res.json(config);
  } catch (err) { res.status(500).json({ message: 'Failed to retrieve services configuration' }); }
});

router.put('/services', verifyToken, verifyAdmin, async (req, res) => {
  try {
    let config = await ServicesConfig.findOne();
    if (!config) { config = new ServicesConfig(req.body); } else { Object.assign(config, req.body); }
    await config.save();
    res.json(config);
  } catch (err) { res.status(500).json({ message: 'Update failed' }); }
});

module.exports = router;
