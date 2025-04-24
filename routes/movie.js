const express = require('express');
const router = express.Router();
const { getMovieDetails, getAverageRating } = require('../services/omdbService');
const Comment = require('../models/Comment');

// Route: /movie/:id
router.get('/movie/:id', async (req, res) => {
  const movieID = req.params.id;

  try {
    const movie = await getMovieDetails(movieID);
    if (!movie || movie.Response === "False" || movie.Type !== "movie") {
      return res.status(404).send("Movie not found");
    }

    const comments = await Comment.find({ movieId: movieID }).populate('userId');
    const averageRating = await getAverageRating(movieID);

    res.render('moviedetail', {
      movie,
      title: movie.Title,
      comments,
      user: req.session.user,
      averageRating
    });
  } catch (error) {
    console.error('Error fetching movie details:', error);
    res.status(500).send('Error fetching movie details');
  }
});

module.exports = router;
