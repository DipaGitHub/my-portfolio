const Profile = require('../models/Profile');
const User = require('../models/User');

exports.getProfile = async (req, res) => {
  try {
    let userId = req.user ? req.user.id : req.query.userId;
    
    // Fallback for public portfolio: show the first admin's data if no userId is specified
    if (!userId) {
      const admin = await User.findOne({ isAdmin: true });
      if (admin) userId = admin._id;
    }

    if (!userId) {
      return res.status(404).json({ message: 'No profile found' });
    }

    const profile = await Profile.findOne({ userId });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const profileData = { ...req.body, userId };
    const profile = await Profile.findOneAndUpdate({ userId }, profileData, { new: true, upsert: true });
    res.json(profile);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
