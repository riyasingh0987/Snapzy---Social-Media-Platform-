const express = require('express');
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

const router = express.Router();

// Routes
router.get('/search', auth, userController.searchUsers);
router.get('/profile/:username', auth, userController.getUserProfile);
router.put('/follow/:id', auth, userController.followUser);
router.get('/suggested', auth, userController.getSuggestedUsers);

module.exports = router;