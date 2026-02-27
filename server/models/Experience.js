const mongoose = require('mongoose');

const ExperienceSchema = new mongoose.Schema({
  position: { type: String, required: true },
  company: { type: String, required: true },
  duration: { type: String, required: true },
  type: { type: String }, // Full-time, Trainee, etc.
  location: { type: String },
  achievements: [{ type: String }],
  technologies: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Experience', ExperienceSchema);
