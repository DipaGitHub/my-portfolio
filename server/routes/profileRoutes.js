const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const auth = require('../middleware/auth');
const optionalAuth = require('../middleware/optionalAuth');

const upload = require('../middleware/upload');

router.get('/', optionalAuth, profileController.getProfile);
router.post('/', auth, upload.single('resume'), profileController.updateProfile);
router.put('/', auth, upload.single('resume'), profileController.updateProfile);

module.exports = router;
