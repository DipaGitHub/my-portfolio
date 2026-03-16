const Message = require('../models/Message');
const User = require('../models/User');

exports.sendMessage = async (req, res) => {
  try {
    let targetUserId = req.body.targetUserId;
    
    if (!targetUserId) {
      const admin = await User.findOne({ isAdmin: true });
      if (admin) targetUserId = admin._id;
    }

    if (!targetUserId) {
      return res.status(400).json({ message: 'No recipient found' });
    }

    const message = new Message({ ...req.body, userId: targetUserId });
    await message.save();
    res.status(201).json({ message: 'Message sent successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const messages = await Message.find({ userId }).sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateMessageStatus = async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(message);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const result = await Message.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!result) return res.status(404).json({ message: 'Message not found or unauthorized' });
    res.json({ message: 'Message deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
