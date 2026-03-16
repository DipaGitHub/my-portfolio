const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/', auth, upload.single('resume'), portfolioController.createPortfolio);
router.get('/my', auth, portfolioController.getMyPortfolios);
router.put('/:id/publish', auth, portfolioController.publishPortfolio);
router.get('/slug/:slug', portfolioController.getPortfolioBySlug);

module.exports = router;
