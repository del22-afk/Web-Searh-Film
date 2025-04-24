const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Tampilkan halaman signup
router.get('/signup', (req, res) => {
  res.render('signup', { error: '' });
});

// Handle proses signup
router.post('/signup', async (req, res) => {
  const { username, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.render('signup', { error: 'Passwords do not match!' });
  }

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.render('signup', {
      error: 'Password must be at least 8 characters long and contain uppercase, lowercase, and a number.'
    });
  }

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.render('signup', { error: 'Username is already taken!' });
  }

  const user = new User({ username, password });
  await user.save();

  res.redirect('/login');
});

// Tampilkan halaman login
router.get('/login', (req, res) => {
  res.render('login', { error: '' });
});

// Handle proses login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user || !(await user.comparePassword(password))) {
    return res.render('login', { error: 'Invalid username or password' });
  }

  req.session.user = {
    _id: user._id.toString(),
    username: user.username,
    role: user.role
  };
  res.redirect('/');
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

module.exports = router;
