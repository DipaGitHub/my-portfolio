const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String },
  message: { type: String, required: true },
  status: { type: String, enum: ['new', 'read', 'replied'], default: 'new' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Message', MessageSchema);
