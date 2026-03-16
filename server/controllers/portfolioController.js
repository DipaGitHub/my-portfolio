const Portfolio = require('../models/Portfolio');
const User = require('../models/User');
const Profile = require('../models/Profile');
const Project = require('../models/Project');
const Skill = require('../models/Skill');
const Education = require('../models/Education');
const Experience = require('../models/Experience');

async function autoPopulateUserData(userId) {
  try {
    // Only populate if they have almost no data
    const existingProjects = await Project.countDocuments({ userId });
    if (existingProjects > 0) return;

    // Add Sample Projects
    await Project.insertMany([
      { 
        userId, 
        title: 'Enterprise Analytics Dashboard', 
        description: 'A high-performance dashboard with real-time data visualization.',
        technologies: ['React', 'Node.js', 'D3.js']
      },
      { 
        userId, 
        title: 'AI Portfolio Builder', 
        description: 'Automated platform for generating professional resumes and portfolios.',
        technologies: ['Next.js', 'OpenAI', 'Tailwind']
      }
    ]);

    // Add Sample Skills
    await Skill.insertMany([
      { userId, category: 'Frontend', items: [{ name: 'React', level: 90 }, { name: 'JavaScript', level: 95 }] },
      { userId, category: 'Backend', items: [{ name: 'Node.js', level: 85 }, { name: 'MongoDB', level: 80 }] }
    ]);

    // Add Sample Experience
    await Experience.create({
      userId,
      role: 'Senior Software Engineer',
      company: 'Tech Innovators Inc.',
      duration: '2021 - Present',
      description: 'Leading the development of mission-critical web applications.'
    });

    // Add Sample Education
    await Education.create({
      userId,
      degree: 'B.Sc. in Computer Science',
      school: 'Elite University of Technology',
      duration: '2016 - 2020'
    });

  } catch (err) {
    console.error('Auto-populate error:', err);
  }
}

exports.createPortfolio = async (req, res) => {
  try {
    const { title, slug, templateId, sections } = req.body;
    let resumeUrl = '';
    
    if (req.file) {
      resumeUrl = `/uploads/resumes/${req.file.filename}`;
    }

    const portfolio = new Portfolio({
      userId: req.user.id,
      title,
      slug,
      templateId,
      sections: typeof sections === 'string' ? JSON.parse(sections) : sections,
      resumeUrl
    });

    await portfolio.save();
    
    // If resume provided, also update the main Profile for this user and trigger smart populator
    if (resumeUrl) {
      await Profile.findOneAndUpdate(
        { userId: req.user.id },
        { resumeFile: resumeUrl },
        { upsert: true, new: true }
      );
      
      // Smart Auto-Populator (Simulation)
      await autoPopulateUserData(req.user.id);
    }

    res.status(201).json(portfolio);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyPortfolios = async (req, res) => {
  try {
    const portfolios = await Portfolio.find({ userId: req.user.id });
    res.json(portfolios);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.publishPortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ _id: req.params.id, userId: req.user.id });
    if (!portfolio) return res.status(404).json({ message: 'Portfolio not found' });
    
    portfolio.status = 'published';
    await portfolio.save();
    res.json(portfolio);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPortfolioBySlug = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ slug: req.params.slug, status: 'published' })
      .populate('userId', 'name email username');
    
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found or not published' });
    }
    
    res.json(portfolio);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
