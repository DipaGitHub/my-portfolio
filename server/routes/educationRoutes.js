const express = require('express');
const router = express.Router();
const educationController = require('../controllers/educationController');
const auth = require('../middleware/auth');

router.get('/', educationController.getEducation);
router.post('/', auth, educationController.addEducation);
router.put('/:id', auth, educationController.updateEducation);
router.delete('/:id', auth, educationController.deleteEducation);

module.exports = router;
