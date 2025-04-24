const express = require('express');
const router = express.Router();
const { searchMovies } = require('../services/omdbService');

router.get('/search', async (req, res) => {
    const query = req.query.query; 
    if (!query) {
        return res.render('home', { 
            movies: [], 
            user: req.session.user, 
            title: "Hasil Pencarian Kosong" 
        });
    }

    try {
        const movies = await searchMovies(query);
        const filtered = movies.filter(movie => movie.Type === "movie");
        res.render('home', { 
            movies: filtered, 
            user: req.session.user, 
            title: `Hasil Pencarian untuk "${query}"`
        });
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).send('Terjadi kesalahan saat mencari film.');
    }
});

module.exports = router;
