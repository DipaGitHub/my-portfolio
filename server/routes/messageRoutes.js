const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const auth = require('../middleware/auth');

router.post('/', messageController.sendMessage); // Public
router.get('/', auth, messageController.getMessages);
router.put('/:id', auth, messageController.updateMessageStatus);
router.delete('/:id', auth, messageController.deleteMessage);

module.exports = router;
