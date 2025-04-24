const express = require('express');
const router = express.Router();
const Favorite_Movies = require('../models/Favorite_Movies');

// Middleware untuk memastikan pengguna terautentikasi
const { isAuthenticated } = require('../services/middleware');

// Route untuk menambah film ke favorit
// Route untuk menambah/menghapus film ke favorit
router.post('/add-favorite', isAuthenticated, async (req, res) => {
    const { title, poster, rating, movieId } = req.body;
    const userId = req.session.user._id; 

    // Cek apakah film sudah ada di daftar favorit pengguna
    const favoriteMovie = await Favorite_Movies.findOne({ userId: userId, imdbID: movieId });

    if (favoriteMovie) {
        // Jika sudah ada, hapus film dari daftar favorit
        await Favorite_Movies.deleteOne({ userId: userId, imdbID: movieId });
    } else {
        // Jika belum ada, tambahkan film ke daftar favorit
        const newFavoriteMovie = new Favorite_Movies({
            userId: userId,
            title,
            poster,
            rating,
            imdbID: movieId
        });
        await newFavoriteMovie.save();
    }

    // Setelah menambah atau menghapus, redirect kembali ke halaman home agar status favorit diperbarui
    res.redirect('/');
});

// Route untuk menampilkan film favorit pengguna
router.get('/favorites', isAuthenticated, async (req, res) => {
    const userId = req.session.user._id;

    // Mengambil film favorit dari database
    const favoriteMovies = await Favorite_Movies.find({ userId: userId });

    // Kirim data favorit dan objek user ke halaman favorites.ejs
    res.render('favorites', { favoriteMovies, user: req.session.user, title: 'Your Favorite Movies' });
});




// Route untuk menghapus film dari daftar favorit
router.post('/remove-favorite', isAuthenticated, async (req, res) => {
    const { movieId } = req.body;
    const userId = req.session.user._id;

    try {
        // Hapus film dari daftar favorit pengguna
        await Favorite_Movies.deleteOne({ userId: userId, imdbID: movieId });

        // Redirect kembali ke halaman favorit
        res.redirect('/favorites');
    } catch (error) {
        console.error("Error removing favorite movie:", error);
        res.status(500).send("Terjadi kesalahan saat menghapus film dari favorit.");
    }
});


module.exports = router;
