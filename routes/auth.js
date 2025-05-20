const express = require('express');
const { body, validationResult } = require('express-validator');
const { User } = require('../models');
const router = express.Router();

// Sign-up route
router.post('/signup', [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match');
    }
    return true;
  })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { firstName, lastName, email, password } = req.body;
    const user = await User.create({
      firstName,
      lastName,
      email,
      passwordHash: password
    });
    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 