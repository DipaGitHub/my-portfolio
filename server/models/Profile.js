const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  github: { type: String },
  linkedin: { type: String },
  location: { type: String },
  experience: { type: String },
  company: { type: String },
  summary: { type: String },
  focus: { type: String },
  specialization: { type: String },
  resumeFile: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Profile', ProfileSchema);
