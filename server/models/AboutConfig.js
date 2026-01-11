
const mongoose = require('mongoose');

const AboutConfigSchema = new mongoose.Schema({
  title: { type: String, default: 'About The Goddess' },
  profileImage: { type: String, default: 'https://raw.githubusercontent.com/princerocky8951-tech/aradhya/refs/heads/main/public/about.png' },
  paragraphs: { type: [String], default: [
    'I am Goddess Aradhya, a Mistress of the psychological and physical arts of BDSM. My approach is strict yet nurturing, demanding nothing less than your total surrender.',
    'With years of experience in the lifestyle, I curate sessions that explore the boundaries of pain, pleasure, and servitude. My dungeon is a judgment-free zone where we construct a reality built on trust and intense sensation.',
    'I specialize in sensation play, psychological dominance, and ritualistic service. My goal is not merely to dominate, but to elevate you through your submission.'
  ]},
  values: { type: [String], default: ['Safe, Sane, Consensual', 'Absolute Discretion', 'Psychological Depth', 'Ritualistic Discipline'] }
}, { timestamps: true });

module.exports = mongoose.model('AboutConfig', AboutConfigSchema);
