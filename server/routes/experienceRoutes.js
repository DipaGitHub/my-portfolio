const express = require('express');
const router = express.Router();
const experienceController = require('../controllers/experienceController');
const auth = require('../middleware/auth');
const optionalAuth = require('../middleware/optionalAuth');

router.get('/', optionalAuth, experienceController.getExperience);
router.post('/', auth, experienceController.addExperience);
router.put('/:id', auth, experienceController.updateExperience);
router.delete('/:id', auth, experienceController.deleteExperience);

module.exports = router;
