const Experience = require('../models/Experience');
const User = require('../models/User');

exports.getExperience = async (req, res) => {
  try {
    let userId = req.user ? req.user.id : req.query.userId;
    
    if (!userId) {
      const admin = await User.findOne({ isAdmin: true });
      if (admin) userId = admin._id;
    }

    if (!userId) return res.json([]);
    
    const experiences = await Experience.find({ userId }).sort({ createdAt: -1 });
    res.json(experiences);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addExperience = async (req, res) => {
  try {
    const experience = new Experience({ ...req.body, userId: req.user.id });
    await experience.save();
    res.status(201).json(experience);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateExperience = async (req, res) => {
  try {
    const experience = await Experience.findOneAndUpdate(
        { _id: req.params.id, userId: req.user.id },
        req.body,
        { new: true }
    );
    if (!experience) return res.status(404).json({ message: 'Experience not found or unauthorized' });
    res.json(experience);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteExperience = async (req, res) => {
  try {
    const result = await Experience.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!result) return res.status(404).json({ message: 'Experience not found or unauthorized' });
    res.json({ message: 'Experience deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
