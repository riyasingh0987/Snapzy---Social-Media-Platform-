const User = require('../models/User');

exports.searchUsers = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.json([]);
    }

    const users = await User.find({
      $text: { $search: query }
    }, {
      score: { $meta: 'textScore' }
    })
    .select('username fullName profilePicture bio')
    .sort({ score: { $meta: 'textScore' } })
    .limit(10);

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .select('-password')
      .populate('followers', 'username fullName profilePicture')
      .populate('following', 'username fullName profilePicture')
      .populate({
        path: 'posts',
        populate: {
          path: 'author',
          select: 'username fullName profilePicture'
        },
        options: { sort: { createdAt: -1 } }
      });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.followUser = async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id);

    if (!userToFollow) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ error: 'Cannot follow yourself' });
    }

    const isFollowing = req.user.following.includes(req.params.id);

    if (isFollowing) {
      // Unfollow
      req.user.following = req.user.following.filter(id => id.toString() !== req.params.id);
      userToFollow.followers = userToFollow.followers.filter(id => id.toString() !== req.user._id.toString());
    } else {
      // Follow
      req.user.following.push(req.params.id);
      userToFollow.followers.push(req.user._id);
    }

    await req.user.save();
    await userToFollow.save();

    res.json({
      message: isFollowing ? 'Unfollowed successfully' : 'Followed successfully',
      isFollowing: !isFollowing
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSuggestedUsers = async (req, res) => {
  try {
    // Get users not followed by current user, excluding self
    const suggestedUsers = await User.find({
      _id: { $ne: req.user._id, $nin: req.user.following }
    })
    .select('username fullName profilePicture bio')
    .limit(10);

    res.json(suggestedUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};