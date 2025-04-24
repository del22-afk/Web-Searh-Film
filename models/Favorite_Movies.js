const mongoose = require('mongoose');

const favoriteMovieSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    poster: { type: String },
    rating: { type: String },
    imdbID: { type: String, required: true }
});

const Favorite_Movies = mongoose.model('Favorite_Movies', favoriteMovieSchema);

module.exports = Favorite_Movies;
