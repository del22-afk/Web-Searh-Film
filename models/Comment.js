const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    movieId: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.models.Comment || mongoose.model('Comment', commentSchema);
