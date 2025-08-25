const express = require('express');
const { Message, Conversation, User } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Get conversations for current user
router.get('/conversations', authenticateToken, async (req, res) => {
  try {
    const conversations = await Conversation.findAll({
      where: {
        participants: {
          $contains: [req.user.id]
        }
      },
      include: [
        {
          model: User,
          as: 'creator',
          attributes: { exclude: ['password'] }
        },
        {
          model: Message,
          as: 'messages',
          limit: 1,
          order: [['createdAt', 'DESC']],
          include: [
            {
              model: User,
              as: 'sender',
              attributes: { exclude: ['password'] }
            }
          ]
        }
      ],
      order: [['lastMessageAt', 'DESC']]
    });

    // Add participant information
    const conversationsWithParticipants = await Promise.all(
      conversations.map(async (conversation) => {
        const participants = await User.findAll({
          where: {
            id: conversation.participants
          },
          attributes: { exclude: ['password'] }
        });
        
        return {
          ...conversation.toJSON(),
          participantDetails: participants
        };
      })
    );

    res.json(conversationsWithParticipants);
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ message: 'Error fetching conversations' });
  }
});

// Create new conversation
router.post('/conversations', authenticateToken, async (req, res) => {
  try {
    const { participants, name, type = 'direct' } = req.body;
    
    // Ensure current user is included in participants
    const allParticipants = [...new Set([req.user.id, ...participants])];
    
    // For direct messages, check if conversation already exists
    if (type === 'direct' && allParticipants.length === 2) {
      const existingConversation = await Conversation.findOne({
        where: {
          type: 'direct',
          participants: {
            $contains: allParticipants
          }
        }
      });
      
      if (existingConversation) {
        return res.json({
          message: 'Conversation already exists',
          conversation: existingConversation
        });
      }
    }

    const conversation = await Conversation.create({
      name,
      type,
      participants: allParticipants,
      createdBy: req.user.id,
    });

    // Fetch complete conversation data
    const createdConversation = await Conversation.findByPk(conversation.id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: { exclude: ['password'] }
        }
      ]
    });

    res.status(201).json({
      message: 'Conversation created successfully',
      conversation: createdConversation,
    });
  } catch (error) {
    console.error('Create conversation error:', error);
    res.status(500).json({ message: 'Error creating conversation' });
  }
});

// Get messages in a conversation
router.get('/conversations/:conversationId/messages', authenticateToken, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    
    const conversation = await Conversation.findByPk(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // Check if user is participant
    if (!conversation.participants.includes(req.user.id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const offset = (page - 1) * limit;
    
    const messages = await Message.findAndCountAll({
      where: { conversationId },
      include: [
        {
          model: User,
          as: 'sender',
          attributes: { exclude: ['password'] }
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      messages: messages.rows.reverse(), // Reverse to show oldest first
      total: messages.count,
      page: parseInt(page),
      totalPages: Math.ceil(messages.count / limit)
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Error fetching messages' });
  }
});

// Send message
router.post('/conversations/:conversationId/messages', authenticateToken, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { content, type = 'text', replyTo, attachments } = req.body;
    
    const conversation = await Conversation.findByPk(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // Check if user is participant
    if (!conversation.participants.includes(req.user.id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const message = await Message.create({
      content,
      type,
      senderId: req.user.id,
      conversationId,
      replyTo: replyTo || null,
      attachments: attachments || [],
    });

    // Update conversation's last message time
    await conversation.update({ lastMessageAt: new Date() });

    // Fetch complete message data
    const createdMessage = await Message.findByPk(message.id, {
      include: [
        {
          model: User,
          as: 'sender',
          attributes: { exclude: ['password'] }
        }
      ]
    });

    res.status(201).json({
      message: 'Message sent successfully',
      data: createdMessage,
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Error sending message' });
  }
});

// Mark messages as read
router.put('/conversations/:conversationId/read', authenticateToken, async (req, res) => {
  try {
    const { conversationId } = req.params;
    
    const conversation = await Conversation.findByPk(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // Check if user is participant
    if (!conversation.participants.includes(req.user.id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Mark all messages in conversation as read by current user
    await Message.update(
      {
        readBy: Sequelize.fn(
          'jsonb_set',
          Sequelize.col('readBy'),
          `{${req.user.id}}`,
          new Date()
        )
      },
      {
        where: {
          conversationId,
          senderId: { $ne: req.user.id } // Don't mark own messages as read
        }
      }
    );

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ message: 'Error marking messages as read' });
  }
});

// Delete conversation (only creator or admin)
router.delete('/conversations/:conversationId', authenticateToken, async (req, res) => {
  try {
    const { conversationId } = req.params;
    
    const conversation = await Conversation.findByPk(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // Check permissions
    if (req.user.role !== 'admin' && conversation.createdBy !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Delete all messages in conversation
    await Message.destroy({ where: { conversationId } });
    
    // Delete conversation
    await conversation.destroy();

    res.json({ message: 'Conversation deleted successfully' });
  } catch (error) {
    console.error('Delete conversation error:', error);
    res.status(500).json({ message: 'Error deleting conversation' });
  }
});

module.exports = router;