const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');

// POST /movie/:id/comment
router.post('/movie/:id/comment', async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  const { content } = req.body;
  const movieId = req.params.id;
  const userId = req.session.user._id;
  console.log('content:', content);

  try {
    const newComment = new Comment({
      movieId,
      userId,
      content
    });

    await newComment.save();
    res.redirect(`/movie/${movieId}`);
  } catch (err) {
    console.error('Error saving comment:', err);
    res.status(500).send('Gagal menyimpan komentar.');
  }
});

// UPDATE /movie/:id/comment/:commentId
router.post('/comment/:id/edit', async (req, res) => {
  if (!req.session.user) return res.redirect('/login');

  const comment = await Comment.findById(req.params.id);
  if (comment.userId.toString() !== req.session.user._id) {
      return res.status(403).send('Unauthorized');
  }

  comment.content = req.body.content;
  await comment.save();
  res.redirect(`/movie/${comment.movieId}`);
  
});

// DELETE /movie/:id/comment/:commentId
router.post('/comment/:id/delete', async (req, res) => {
  if (!req.session.user) return res.redirect('/login');

  try {
    const comment = await Comment.findById(req.params.id);
    const isOwner = comment.userId.toString() === req.session.user._id;
    const isAdmin = req.session.user.role === 'admin';

    if (!isOwner && !isAdmin) {
        return res.status(403).send('Unauthorized');
    }

    await Comment.findByIdAndDelete(req.params.id);
    res.redirect(`/movie/${comment.movieId}`);
  } catch (err) {
    console.error('Error saat hapus komentar:', err);
    res.status(500).send('Terjadi kesalahan saat menghapus komentar.');
  }
});


module.exports = router;
