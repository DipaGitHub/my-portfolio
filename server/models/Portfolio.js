const mongoose = require('mongoose');

const PortfolioSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  templateId: {
    type: String,
    required: true,
    default: 'modern-v1'
  },
  title: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  sections: [{
    type: String,
    enum: ['about', 'skills', 'projects', 'experience', 'education', 'contact', 'social']
  }],
  resumeUrl: { type: String, default: '' },
  viewCount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Portfolio', PortfolioSchema);
