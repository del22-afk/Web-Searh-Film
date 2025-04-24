const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  movieId: { type: String, required: true },
  movieTitle: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 10 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Rating || mongoose.model('Rating', ratingSchema);
