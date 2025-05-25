const express = require('express');
const { body, validationResult } = require('express-validator');
const passport = require('passport');
const router = express.Router();
const User = require('../models/user');

// Show login form
router.get('/login', (req, res) => {
  res.render('auth/login', { messages: {} });
});

// Show signup form
router.get('/signup', (req, res) => {
  res.render('auth/signup', { messages: {} });
});

// Sign-up route
router.post('/signup', [
  body('username').trim().notEmpty().withMessage('Username is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('isAdmin').optional()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    if (req.xhr || req.headers.accept.includes('application/json')) {
      return res.status(400).json({ errors: errors.array() });
    }
    req.flash('error', errors.array()[0].msg);
    return res.redirect('/auth/signup');
  }

  try {
    const { username, password, isAdmin } = req.body;
    console.log('Signup data:', { username, isAdmin }); // Debug log

    const user = await User.create({
      username,
      password,
      isAdmin: isAdmin === 'on' || isAdmin === true
    });
    
    // Log the user in after successful signup
    req.login(user, (err) => {
      if (err) {
        console.error('Login error after signup:', err);
        if (req.xhr || req.headers.accept.includes('application/json')) {
          return res.status(500).json({ error: err.message });
        }
        req.flash('error', 'Error logging in after signup');
        return res.redirect('/auth/login');
      }
      
      if (req.xhr || req.headers.accept.includes('application/json')) {
        return res.status(201).json({ message: 'User created successfully', user });
      }
      res.redirect('/');
    });
  } catch (error) {
    console.error('Error creating user:', error);
    if (req.xhr || req.headers.accept.includes('application/json')) {
      return res.status(500).json({ error: error.message });
    }
    req.flash('error', error.message);
    res.redirect('/auth/signup');
  }
});

// Login route
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/auth/login',
  failureFlash: true
}));

// Handle logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

module.exports = router; 