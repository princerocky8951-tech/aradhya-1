
const mongoose = require('mongoose');

const HomeConfigSchema = new mongoose.Schema({
  heroTagline: { type: String, default: 'Obedience • Sacrifice • Silence' },
  heroTitleLine1: { type: String, default: 'Goddess' },
  heroTitleLine2: { type: String, default: 'Aradhya' },
  heroSubtitle: { type: String, default: '"You are not here to negotiate. You are here to submit. My word is your only law."' },
  heroBanner: { type: String, default: 'https://raw.githubusercontent.com/princerocky8951-tech/aradhya/refs/heads/main/public/image.png' },
  covenantTitle: { type: String, default: 'The Covenant of Reality' },
  covenantParagraphs: { type: [String], default: [
    'Do not mistake this for a game. When you enter my dominion in Hyderabad, Bangalore, or Vizag, you leave your rights at the door.',
    'I do not require your understanding, only your compliance. I am everything, and you are nothing.'
  ]},
  servicesTitle: { type: String, default: 'Instruments of Control' },
  servicesSubtitle: { type: String, default: 'Hyderabad • Bangalore • Vizag' },
  services: {
    type: [{
      title: String,
      desc: String,
      img: String
    }],
    default: [
      { title: "Foot Worship", desc: "In Bangalore or Hyderabad, you will learn that your highest calling is to be beneath my feet.", img: "https://raw.githubusercontent.com/princerocky8951-tech/aradhya/refs/heads/main/public/foot-worship.png" },
      { title: "Nipple Torment", desc: "Pain is the only currency I accept. Endure whatever agony I devise for my amusement.", img: "https://raw.githubusercontent.com/princerocky8951-tech/aradhya/refs/heads/main/public/nipal-tourcher.png" },
      { title: "Ball Busting", desc: "I will crush your manhood and your ego simultaneously. There is no escape from my precision.", img: "https://raw.githubusercontent.com/princerocky8951-tech/aradhya/refs/heads/main/public/ball.png" },
      { title: "Verbal Degradation", desc: "I will break your mind with words alone, reducing you to a trembling worm.", img: "https://raw.githubusercontent.com/princerocky8951-tech/aradhya/refs/heads/main/public/vd.png" },
    ]
  },
  videoSectionTitle: { type: String, default: 'Cinematic Short' },
  videoUrl: { type: String, default: "https://raw.githubusercontent.com/princerocky8951-tech/aradhya/refs/heads/main/public/video/ld4Men0ABwWyJhHK.mp4" },
  videoThumb: { type: String, default: 'https://raw.githubusercontent.com/princerocky8951-tech/aradhya/refs/heads/main/public/video-thumal.png' },
  videoMistressTag: { type: String, default: '@MistressAradhya' },
  videoMistressDesc: { type: String, default: 'Experience the absolute peak of digital dominance. Secure and exclusive content for the devoted.' }
}, { timestamps: true });

module.exports = mongoose.model('HomeConfig', HomeConfigSchema);
