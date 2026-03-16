const express = require('express');
const router = express.Router();
const skillController = require('../controllers/skillController');
const auth = require('../middleware/auth');
const optionalAuth = require('../middleware/optionalAuth');

router.get('/', optionalAuth, skillController.getSkills);
router.post('/', auth, skillController.addSkillGroup);
router.put('/:id', auth, skillController.updateSkillGroup);
router.delete('/:id', auth, skillController.deleteSkillGroup);

module.exports = router;
