const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
  category: { type: String, required: true }, // e.g., Frontend, Backend
  items: [{
    name: { type: String, required: true },
    level: { type: Number, default: 0 }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Skill', SkillSchema);
