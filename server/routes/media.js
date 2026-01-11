
const express = require('express');
const router = express.Router();
const multer = require('multer');
const Media = require('../models/Media');
const { storage, cloudinary } = require('../utils/cloudinary');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

const upload = multer({ storage });

// Get all media
router.get('/', verifyToken, async (req, res) => {
  try {
    const media = await Media.find().sort({ createdAt: -1 });
    res.json(media);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload manual media
router.post('/upload', verifyToken, verifyAdmin, upload.single('file'), async (req, res) => {
  try {
    const { title, description, category } = req.body;
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const type = req.file.mimetype.startsWith('video') ? 'video' : 'image';

    const newMedia = new Media({
      title,
      description,
      type,
      category: category || 'gallery',
      cloudinaryUrl: req.file.path,
      publicId: req.file.filename,
      uploadedBy: req.user.id
    });

    await newMedia.save();
    res.status(201).json(newMedia);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Upload failed' });
  }
});

// Delete media
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) return res.status(404).json({ message: 'Media not found' });
    await cloudinary.uploader.destroy(media.publicId, { resource_type: media.type });
    await Media.findByIdAndDelete(req.params.id);
    res.json({ message: 'Media deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed' });
  }
});

module.exports = router;
