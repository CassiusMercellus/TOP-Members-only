const express = require('express');
const router = express.Router();
const Message = require('../models/message');
const User = require('../models/user');

// Home page
router.get('/', async (req, res) => {
  try {
    const messages = await Message.findAll();
    res.render('index', {
      user: req.user,
      messages,
      flash: { error: req.flash('error'), success: req.flash('success') }
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.render('index', {
      user: req.user,
      messages: [],
      flash: { error: 'Error loading messages' }
    });
  }
});

// Join club
router.post('/join-club', async (req, res) => {
  if (!req.user) {
    req.flash('error', 'You must be logged in to join the club');
    return res.redirect('/');
  }

  if (req.user.isMember) {
    req.flash('success', 'You are already a member!');
    return res.redirect('/');
  }

  const { passcode } = req.body;
  if (passcode !== 'secret123') {
    req.flash('error', 'Invalid passcode');
    return res.redirect('/');
  }

  try {
    // Update the user's membership status
    await req.user.update({ is_member: true });
    
    // Update the session user object
    req.user.isMember = true;
    
    req.flash('success', 'Welcome to the club!');
    res.redirect('/');
  } catch (error) {
    console.error('Error joining club:', error);
    req.flash('error', 'Error joining club. Please try again.');
    res.redirect('/');
  }
});

module.exports = router; 