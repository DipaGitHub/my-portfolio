const Portfolio = require('../models/Portfolio');
const User = require('../models/User');
const Profile = require('../models/Profile');

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
    
    // If resume provided, also update the main Profile for this user
    if (resumeUrl) {
      await Profile.findOneAndUpdate(
        { userId: req.user.id },
        { resumeFile: resumeUrl },
        { upsert: true, new: true }
      );
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
