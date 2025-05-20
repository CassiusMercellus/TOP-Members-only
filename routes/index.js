const express = require('express');
const { User } = require('../models');
const router = express.Router();

// Home page route
router.get('/', (req, res) => {
  res.render('index', { user: req.user });
});

// Join the club route
router.post('/join-club', async (req, res) => {
  const { passcode } = req.body;
  const secretPasscode = process.env.SECRET_PASSCODE || 'secret123';

  if (passcode === secretPasscode) {
    try {
      await User.update({ isMember: true }, { where: { id: req.user.id } });
      res.json({ message: 'You have successfully joined the club!' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(400).json({ message: 'Invalid passcode' });
  }
});

module.exports = router; 