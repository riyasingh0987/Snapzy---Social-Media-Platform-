const express = require('express');
const postController = require('../controllers/postController');
const auth = require('../middleware/auth');
const upload = require('../utils/upload');

const router = express.Router();

// Routes
router.post('/', auth, upload.single('image'), postController.createPost);
router.get('/', auth, postController.getPosts);
router.get('/:id', auth, postController.getPostById);
router.put('/:id/like', auth, postController.likePost);
router.delete('/:id', auth, postController.deletePost);

module.exports = router;