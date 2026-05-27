const express = require('express');
const commentController = require('../controllers/commentController');
const auth = require('../middleware/auth');

const router = express.Router();

// Routes
router.post('/', auth, commentController.createComment);
router.get('/:postId', auth, commentController.getComments);
router.put('/:id/like', auth, commentController.likeComment);
router.delete('/:id', auth, commentController.deleteComment);

module.exports = router;