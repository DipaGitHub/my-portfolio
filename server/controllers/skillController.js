const Skill = require('../models/Skill');
const User = require('../models/User');

exports.getSkills = async (req, res) => {
  try {
    let userId = req.user ? req.user.id : req.query.userId;
    
    if (!userId) {
      const admin = await User.findOne({ isAdmin: true });
      if (admin) userId = admin._id;
    }

    if (!userId) return res.json([]);
    
    const skills = await Skill.find({ userId });
    res.json(skills);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addSkillGroup = async (req, res) => {
  try {
    const skillGroup = new Skill({ ...req.body, userId: req.user.id });
    await skillGroup.save();
    res.status(201).json(skillGroup);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateSkillGroup = async (req, res) => {
  try {
    const skillGroup = await Skill.findOneAndUpdate(
        { _id: req.params.id, userId: req.user.id },
        req.body,
        { new: true }
    );
    if (!skillGroup) return res.status(404).json({ message: 'Skill group not found or unauthorized' });
    res.json(skillGroup);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteSkillGroup = async (req, res) => {
  try {
    const result = await Skill.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!result) return res.status(404).json({ message: 'Skill group not found or unauthorized' });
    res.json({ message: 'Skill group deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
