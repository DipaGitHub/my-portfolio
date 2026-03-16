require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Profile = require('./models/Profile');
const Project = require('./models/Project');
const Skill = require('./models/Skill');
const Experience = require('./models/Experience');
const Education = require('./models/Education');
const Message = require('./models/Message');

const migrate = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for migration...');

    const admin = await User.findOne({ username: 'admin' });
    if (!admin) {
      console.error('Super admin "admin" not found. Please run createAdmin.js first.');
      process.exit(1);
    }

    const userId = admin._id;
    console.log(`Migrating data to User ID: ${userId} (${admin.username})`);

    const models = [Profile, Project, Skill, Experience, Education, Message];
    
    for (const Model of models) {
      const result = await Model.updateMany(
        { userId: { $exists: false } },
        { $set: { userId: userId } }
      );
      console.log(`${Model.modelName}: Updated ${result.modifiedCount} documents.`);
    }

    console.log('Migration completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
};

migrate();
