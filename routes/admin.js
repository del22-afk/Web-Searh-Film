const express = require('express');
const { isAuthenticated, isAdmin } = require('../services/middleware');
const User = require('../models/User');
const Comment = require('../models/Comment');
const Rating = require('../models/Rating');
const Favorite_Movies = require('../models/Favorite_Movies');
const { getMovieDetails } = require('../services/omdbService'); // Pastikan untuk mengimport service ini

const router = express.Router();

// Admin Dashboard Route (Hanya admin yang bisa mengakses)
router.get('/dashboard', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const users = await User.find({});
    const comments = await Comment.find().populate('userId');
    const rawRatings = await Rating.find({}).populate('userId');
    const favorites = await Favorite_Movies.find({});

    // Ambil detail judul movie dari OMDB API untuk setiap rating
    const ratings = await Promise.all(
      rawRatings.map(async (rating) => {
        const movie = await getMovieDetails(rating.movieId);
        return {
          _id: rating._id,
          rating: rating.rating,
          createdAt: rating.createdAt,
          user: rating.userId, // populated
          movieTitle: movie.Title || rating.movieId, // fallback kalau gagal ambil
        };
      })
    );

    res.render('admin_dashboard', {
      user: req.session.user,
      users,
      comments,
      ratings, // Mengirim ratings lengkap dengan movieTitle
      favorites,
      title: 'Admin Dashboard'
    });
  } catch (err) {
    console.error('Error loading dashboard:', err);
    res.status(500).send('Terjadi kesalahan saat memuat dashboard.');
  }
});

// POST /admin/dashboard - Hapus User dan Komentar
router.post('/dashboard', isAuthenticated, isAdmin, async (req, res) => {
  const deleteUserId = req.body.deleteUserId;

  try {
    if (deleteUserId) {
      // Cegah admin hapus dirinya sendiri
      if (deleteUserId === req.session.user._id) {
        return res.status(400).send('Tidak bisa menghapus akun sendiri.');
      }

      // Hapus user dan komentarnya
      await User.findByIdAndDelete(deleteUserId);
      await Comment.deleteMany({ userId: deleteUserId });
    }

    // Setelah delete, render ulang dashboard
    const users = await User.find();
    const comments = await Comment.find().populate('userId');
    const ratings = await Rating.find();
    const favorites = await Favorite_Movies.find();

    res.render('admin_dashboard', {
      user: req.session.user,
      users,
      comments,
      ratings,
      favorites,
      title: 'Admin Dashboard'
    });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).send('Terjadi kesalahan saat menghapus user.');
  }
});

// Fitur menghapus komentar
router.post('/comment/:id/delete', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).send('Komentar tidak ditemukan.');

    await Comment.findByIdAndDelete(req.params.id);

    // Redirect kembali ke dashboard, supaya UI muncul lagi
    res.redirect('/admin/dashboard');
  } catch (err) {
    console.error('Error deleting comment:', err);
    res.status(500).send('Terjadi kesalahan saat menghapus komentar.');
  }
});

// Hapus rating
router.post('/rating/:id/delete', isAuthenticated, isAdmin, async (req, res) => {
  try {
    await Rating.findByIdAndDelete(req.params.id);
    res.redirect('/admin/dashboard');
  } catch (err) {
    console.error('Gagal menghapus rating:', err);
    res.status(500).send('Terjadi kesalahan saat menghapus rating.');
  }
});

module.exports = router;
