const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');
const auth = require('../middleware/auth');

router.post('/', auth, portfolioController.createPortfolio);
router.get('/my', auth, portfolioController.getMyPortfolios);
router.put('/:id/publish', auth, portfolioController.publishPortfolio);

module.exports = router;
