const Project = require('../models/Project');
const User = require('../models/User');

exports.getProjects = async (req, res) => {
  try {
    let userId = req.user ? req.user.id : req.query.userId;
    
    if (!userId) {
      const admin = await User.findOne({ isAdmin: true });
      if (admin) userId = admin._id;
    }

    if (!userId) return res.json([]);
    
    const projects = await Project.find({ userId }).sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addProject = async (req, res) => {
  try {
    const project = new Project({ ...req.body, userId: req.user.id });
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id }, 
      req.body, 
      { new: true }
    );
    if (!project) return res.status(404).json({ message: 'Project not found or unauthorized' });
    res.json(project);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const result = await Project.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!result) return res.status(404).json({ message: 'Project not found or unauthorized' });
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
