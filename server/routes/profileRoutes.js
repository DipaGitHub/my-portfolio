const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const auth = require('../middleware/auth');
const optionalAuth = require('../middleware/optionalAuth');

router.get('/', optionalAuth, profileController.getProfile);
router.put('/', auth, profileController.updateProfile);

module.exports = router;
