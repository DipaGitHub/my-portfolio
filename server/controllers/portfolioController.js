const Portfolio = require('../models/Portfolio');
const User = require('../models/User');

exports.createPortfolio = async (req, res) => {
  try {
    const { title, slug, templateId, sections } = req.body;
    
    // Check if slug taken
    const existing = await Portfolio.findOne({ slug });
    if (existing) {
      return res.status(400).json({ message: 'URL slug already taken' });
    }

    const portfolio = new Portfolio({
      userId: req.user.id,
      title,
      slug,
      templateId,
      sections
    });

    await portfolio.save();
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
