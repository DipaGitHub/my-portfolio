const Education = require('../models/Education');
const User = require('../models/User');

exports.getEducation = async (req, res) => {
  try {
    let userId = req.user ? req.user.id : req.query.userId;
    
    if (!userId) {
      const admin = await User.findOne({ isAdmin: true });
      if (admin) userId = admin._id;
    }

    if (!userId) return res.json([]);
    
    const education = await Education.find({ userId }).sort({ createdAt: -1 });
    res.json(education);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addEducation = async (req, res) => {
  try {
    const education = new Education({ ...req.body, userId: req.user.id });
    await education.save();
    res.status(201).json(education);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateEducation = async (req, res) => {
  try {
    const education = await Education.findOneAndUpdate(
        { _id: req.params.id, userId: req.user.id },
        req.body,
        { new: true }
    );
    if (!education) return res.status(404).json({ message: 'Education not found or unauthorized' });
    res.json(education);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteEducation = async (req, res) => {
  try {
    const result = await Education.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!result) return res.status(404).json({ message: 'Education not found or unauthorized' });
    res.json({ message: 'Education deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
