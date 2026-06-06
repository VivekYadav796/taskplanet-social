const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const { protect } = require('../middleware/auth');
const { upload, cloudinary } = require('../config/cloudinary');

// @route   GET /api/posts
// @desc    Get all posts (with pagination)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const filter = req.query.filter || 'all'; // all, mostLiked, mostCommented

    let sortOption = { createdAt: -1 };
    if (filter === 'mostLiked') sortOption = { 'likes.length': -1, createdAt: -1 };
    if (filter === 'mostCommented') sortOption = { 'comments.length': -1, createdAt: -1 };

    const skip = (page - 1) * limit;

    let aggregatePipeline = [
      {
        $addFields: {
          likesCount: { $size: '$likes' },
          commentsCount: { $size: '$comments' },
        },
      },
    ];

    if (filter === 'mostLiked') {
      aggregatePipeline.push({ $sort: { likesCount: -1, createdAt: -1 } });
    } else if (filter === 'mostCommented') {
      aggregatePipeline.push({ $sort: { commentsCount: -1, createdAt: -1 } });
    } else {
      aggregatePipeline.push({ $sort: { createdAt: -1 } });
    }

    aggregatePipeline.push(
      { $skip: skip },
      { $limit: limit }
    );

    const posts = await Post.aggregate(aggregatePipeline);
    const total = await Post.countDocuments();

    res.json({
      posts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/posts
// @desc    Create a new post
// @access  Private
router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    const { text } = req.body;
    const imageUrl = req.file ? req.file.path : '';
    const imagePublicId = req.file ? req.file.filename : '';

    if (!text && !imageUrl) {
      return res.status(400).json({ message: 'Post must have text or image' });
    }

    const post = await Post.create({
      user: req.user._id,
      username: req.user.username,
      avatar: req.user.avatar,
      text: text || '',
      image: imageUrl,
      imagePublicId,
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PATCH /api/posts/:id/like
// @desc    Like or unlike a post
// @access  Private
router.patch('/:id/like', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const userId = req.user._id.toString();
    const alreadyLiked = post.likes.some((id) => id.toString() === userId);

    if (alreadyLiked) {
      // Unlike
      post.likes = post.likes.filter((id) => id.toString() !== userId);
      post.likedBy = post.likedBy.filter((u) => u !== req.user.username);
    } else {
      // Like
      post.likes.push(req.user._id);
      post.likedBy.push(req.user.username);
    }

    await post.save();

    res.json({
      likes: post.likes,
      likedBy: post.likedBy,
      liked: !alreadyLiked,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/posts/:id/comment
// @desc    Add a comment to a post
// @access  Private
router.post('/:id/comment', protect, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Comment cannot be empty' });
    }
    if (text.length > 500) {
      return res.status(400).json({ message: 'Comment too long (max 500 chars)' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comment = {
      user: req.user._id,
      username: req.user.username,
      avatar: req.user.avatar,
      text: text.trim(),
    };

    post.comments.push(comment);
    await post.save();

    // Return the new comment (last one added)
    const newComment = post.comments[post.comments.length - 1];
    res.status(201).json({
      comment: newComment,
      commentsCount: post.comments.length,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/posts/:id/comments
// @desc    Get all comments for a post
// @access  Public
router.get('/:id/comments', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).select('comments');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post.comments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/posts/:id
// @desc    Delete a post
// @access  Private (owner only)
router.delete('/:id', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    // Delete image from Cloudinary if exists
    if (post.imagePublicId) {
      await cloudinary.uploader.destroy(post.imagePublicId);
    }

    await post.deleteOne();
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
