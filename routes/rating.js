const express = require('express');
const router = express.Router();
const Rating = require('../models/Rating');

// Route POST untuk submit rating
router.post('/movie/:id/rating', async (req, res) => {
  console.log('Session userId:', req.session.userId);
  if (!req.session.user) {
    return res.redirect('/login');
  }

  const { rating } = req.body;
  const movieId = req.params.id;
  const userId = req.session.user._id;

  try {
    await Rating.findOneAndUpdate(
      { userId, movieId },
      { rating, createdAt: Date.now() },
      { upsert: true, new: true }
    );

    res.redirect(`/movie/${movieId}`);
  } catch (err) {
    console.error('Gagal simpan rating:', err);
    res.status(500).send('Gagal simpan rating');
  }
});

module.exports = router;
