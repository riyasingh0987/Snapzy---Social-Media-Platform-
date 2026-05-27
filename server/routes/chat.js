const express = require('express');
const chatController = require('../controllers/chatController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/conversations', auth, chatController.getConversations);
router.post('/conversations', auth, chatController.openConversation);
router.get('/conversations/:id', auth, chatController.getConversation);
router.post('/conversations/:id/messages', auth, chatController.sendMessage);

module.exports = router;
