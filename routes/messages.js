const express = require('express');
const router = express.Router();
const Message = require('../models/message');
const { isAuthenticated, isMember, isAdmin } = require('../middleware/auth');

// Show new message form
router.get('/new', isAuthenticated, (req, res) => {
  res.render('messages/new', { messages: {} });
});

// Create new message
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const message = await Message.create({
      title: req.body.title,
      text: req.body.text,
      userId: req.user.id
    });
    res.redirect('/');
  } catch (error) {
    console.error('Error creating message:', error);
    res.render('messages/new', {
      messages: { error: 'Failed to create message. Please try again.' }
    });
  }
});

// Delete message (admin only)
router.post('/:id/delete', isAdmin, async (req, res) => {
  try {
    console.log('Attempting to delete message:', req.params.id);
    
    const result = await Message.delete(req.params.id);
    console.log('Delete result:', result);
    
    if (!result) {
      throw new Error('Failed to delete message');
    }
    
    req.flash('success', 'Message deleted successfully');
    return res.redirect('/');
  } catch (error) {
    console.error('Error deleting message:', error);
    req.flash('error', error.message || 'Failed to delete message');
    return res.redirect('/');
  }
});

module.exports = router; 