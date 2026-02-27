const mongoose = require('mongoose');

const EducationSchema = new mongoose.Schema({
  degree: { type: String, required: true },
  institution: { type: String, required: true },
  duration: { type: String, required: true },
  grade: { type: String },
  type: { type: String },
  highlights: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Education', EducationSchema);
