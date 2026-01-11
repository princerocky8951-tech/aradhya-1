
const mongoose = require('mongoose');

const ServicesConfigSchema = new mongoose.Schema({
  title: { type: String, default: 'Sacred Offerings' },
  subtitle: { type: String, default: 'Hyderabad • Bangalore • Vizag' },
  mainDescription: { type: String, default: 'Choose your path of surrender. My dungeon offers a variety of ways to break you. Do not ask for the cost; if you have to ask, you cannot afford my attention.' },
  servicesList: {
    type: [{
      title: String,
      description: String
    }],
    default: [
      { title: "Foot Worship & Trampling", description: "Your existence is beneath me. Literally. In my private dungeons across Hyderabad and Bangalore, you will serve as the carpet I walk upon. Your tongue will clean my soles, and your body will cushion my steps." },
      { title: "Nipple & Genital Torture", description: "I delight in the sounds of your suffering. Using precision instruments, electricity, and hot wax, I will push your threshold of pain to levels you never thought possible." }
    ]
  },
  footerTitle: { type: String, default: 'Have a specific fetish not listed?' },
  footerDescription: { type: String, default: 'I am open to discussing custom scenarios, provided they meet my standards of intensity and safety. Do not bore me with common fantasies.' }
}, { timestamps: true });

module.exports = mongoose.model('ServicesConfig', ServicesConfigSchema);
