
const mongoose = require('mongoose');

const MediaSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  type: { type: String, enum: ['image', 'video'], required: true },
  category: { 
    type: String, 
    enum: ['gallery', 'home', 'about', 'system'], 
    default: 'gallery' 
  },
  cloudinaryUrl: { type: String, required: true },
  publicId: { type: String, required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Media', MediaSchema);
