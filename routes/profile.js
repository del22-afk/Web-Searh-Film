const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Comment = require('../models/Comment');
const Rating = require('../models/Rating');
const Favorite = require('../models/Favorite_Movies');

// Middleware untuk cek login
function requireLogin(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();
}

router.get('/profile', requireLogin, async (req, res) => {
  try {
    const userId = req.session.user._id;

    const comments = await Comment.find({ userId });
    const ratings = await Rating.find({ userId });
    const favorites = await Favorite.find({ userId });

    res.render('profile', {
      user: req.session.user, // dari session, bukan dari database
      title: 'Your Profile',
      comments,
      ratings,
      favorites
    });
  } catch (err) {
    console.error('Error loading profile:', err);
    res.status(500).send('Gagal load profil');
  }
});

module.exports = router;
