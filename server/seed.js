require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Models
const Profile = require('./models/Profile');
const Skill = require('./models/Skill');
const Experience = require('./models/Experience');
const Education = require('./models/Education');
const Project = require('./models/Project');

const resumeData = JSON.parse(fs.readFileSync(path.join(__dirname, '../client/src/data/resume.json'), 'utf8'));

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('MongoDB Connected for Seeding');

    // Clear existing data
    await Profile.deleteMany({});
    await Skill.deleteMany({});
    await Experience.deleteMany({});
    await Education.deleteMany({});
    await Project.deleteMany({});

    // Seed Profile
    await Profile.create({
      ...resumeData.personalInfo,
      focus: "ERP systems & API development",
      specialization: "Angular + Node.js + Directus"
    });
    console.log('Profile seeded');

    // Seed Skills
    for (const skillGroup of resumeData.skills) {
      await Skill.create(skillGroup);
    }
    console.log('Skills seeded');

    // Seed Experience
    for (const exp of resumeData.experience) {
      await Experience.create(exp);
    }
    console.log('Experience seeded');

    // Seed Education
    for (const edu of resumeData.education) {
      await Education.create(edu);
    }
    console.log('Education seeded');

    // Seed Projects
    for (const project of resumeData.projects) {
      await Project.create(project);
    }
    console.log('Projects seeded');

    console.log('Seeding completed successfully');
    process.exit();
  })
  .catch(err => {
    console.error('Seeding error:', err);
    process.exit(1);
  });
