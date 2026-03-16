const Profile = require('../models/Profile');
const User = require('../models/User');

exports.getProfile = async (req, res) => {
  try {
    // 1. Priority: Authenticated user (Admin Dashboard)
    if (req.user && req.user.id) {
      const profile = await Profile.findOne({ userId: req.user.id });
      return res.json(profile || {}); // Return empty object if no profile yet, don't fallback to admin
    }

    // 2. Secondary: Specific userId in query (Public view of a specific user)
    let searchUserId = req.query.userId;
    
    // 3. Fallback: First admin (Public default view)
    if (!searchUserId) {
      const admin = await User.findOne({ isAdmin: true });
      if (admin) searchUserId = admin._id;
    }

    if (!searchUserId) {
      return res.status(404).json({ message: 'No profile found' });
    }

    const profile = await Profile.findOne({ userId: searchUserId });
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
