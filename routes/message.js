const express = require('express');
const { Message } = require('../models');
const router = express.Router();

// Middleware to check if user is logged in
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Please log in to access this resource' });
};

// Create a new message
router.post('/', isLoggedIn, async (req, res) => {
  try {
    const { title, text } = req.body;
    const message = await Message.create({
      title,
      text,
      userId: req.user.id
    });
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all messages
router.get('/', async (req, res) => {
  try {
    const messages = await Message.findAll({
      include: [{ model: User, attributes: ['firstName', 'lastName'] }]
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 