const Chat = require('../models/Chat');
const User = require('../models/User');

const populateConversation = async (conversation) => {
  await conversation
    .populate('participants', 'username fullName profilePicture')
    .populate({ path: 'messages.sender', select: 'username fullName profilePicture' });
  return conversation;
};

exports.getConversations = async (req, res) => {
  try {
    const conversations = await Chat.find({ participants: req.user._id })
      .sort({ updatedAt: -1 })
      .populate('participants', 'username fullName profilePicture')
      .populate({ path: 'messages.sender', select: 'username fullName profilePicture' });

    const summary = conversations.map((conversation) => {
      const otherParticipants = conversation.participants.filter(
        (participant) => participant._id.toString() !== req.user._id.toString()
      );
      const lastMessage = conversation.messages[conversation.messages.length - 1] || null;

      return {
        _id: conversation._id,
        participants: otherParticipants,
        messages: conversation.messages,
        lastMessage,
        updatedAt: conversation.updatedAt
      };
    });

    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.openConversation = async (req, res) => {
  try {
    const { recipientId } = req.body;

    if (!recipientId) {
      return res.status(400).json({ error: 'Recipient ID is required' });
    }

    if (recipientId === req.user._id.toString()) {
      return res.status(400).json({ error: 'Cannot message yourself' });
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ error: 'Recipient not found' });
    }

    let conversation = await Chat.findOne({
      participants: { $all: [req.user._id, recipientId] }
    });

    if (!conversation) {
      conversation = new Chat({
        participants: [req.user._id, recipientId],
        messages: []
      });
      await conversation.save();
    }

    await populateConversation(conversation);
    res.json(conversation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getConversation = async (req, res) => {
  try {
    const conversation = await Chat.findById(req.params.id);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    if (!conversation.participants.some((participant) => participant.toString() === req.user._id.toString())) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await populateConversation(conversation);
    res.json(conversation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const conversation = await Chat.findById(req.params.id);

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    if (!conversation.participants.some((participant) => participant.toString() === req.user._id.toString())) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Message cannot be empty' });
    }

    conversation.messages.push({ sender: req.user._id, text: text.trim() });
    await conversation.save();

    await populateConversation(conversation);
    res.json(conversation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
