const express = require('express');
const router = express.Router();
const { searchMoviesByGenre } = require('../services/omdbService');

// Route untuk menampilkan film berdasarkan genre
router.get('/', async (req, res) => {
    const genre = req.query.genre || ''; // Ambil genre dari query parameter

    if (genre) {
        try {
            const movies = await searchMoviesByGenre(genre, genre);
            const filtered = movies.filter(movie => movie.Type === "movie");

            res.render('home', {
                movies: filtered,
                title: `Genre: ${genre}`,
                user: req.session.user
            });
        } catch (error) {
            console.error('Genre search error:', error);
            res.status(500).send('Terjadi kesalahan saat mencari genre.');
        }
    } else {
        // Jika tidak ada genre, tampilkan film acak
        const movies = await searchMoviesByGenre('Action', 'Action'); // default genre
        res.render('home', {
            movies: movies,
            title: 'For You',
            user: req.session.user
        });
    }
});

module.exports = router;
