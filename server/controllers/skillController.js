const Skill = require('../models/Skill');

exports.getSkills = async (req, res) => {
  try {
    const skills = await Skill.find();
    res.json(skills);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addSkillGroup = async (req, res) => {
  try {
    const skillGroup = new Skill(req.body);
    await skillGroup.save();
    res.status(201).json(skillGroup);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateSkillGroup = async (req, res) => {
  try {
    const skillGroup = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(skillGroup);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteSkillGroup = async (req, res) => {
  try {
    await Skill.findByIdAndDelete(req.params.id);
    res.json({ message: 'Skill group deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
