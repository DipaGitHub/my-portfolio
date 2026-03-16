const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

// Note: In a real app, you'd add a secondary middleware like 'isAdmin'
router.get('/', auth, userController.getAllUsers);
router.put('/approve/:id', auth, userController.approveUser);
router.delete('/:id', auth, userController.deleteUser);

module.exports = router;
