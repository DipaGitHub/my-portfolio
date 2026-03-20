const mongoose = require('mongoose');

const ExperienceSchema = new mongoose.Schema({
  role: { type: String, required: true },
  company: { type: String, required: true },
  duration: { type: String, required: true },
  description: { type: String },
  type: { type: String }, // Full-time, Trainee, etc.
  location: { type: String },
  achievements: [{ type: String }],
  technologies: [{ type: String }],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Experience', ExperienceSchema);
