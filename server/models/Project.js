const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String },
  tech: { type: String }, // Comma separated or single string as in json
  description: { type: String },
  image: { type: String },
  link: { type: String },
  github: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);
