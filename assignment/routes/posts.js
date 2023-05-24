const express = require('express');
  const jwt = require('jsonwebtoken');
  const User = require('../models/userSchema');
  const Post = require('../models/postsSchema');
  const authMiddleware = require('../middlewares/authMiddleware');

  const router = express.Router();

  // Create a new post
  router.post('/', authMiddleware, async (req, res) => {
    try {
      const { title, body, image } = req.body;
      const userId = req.userId;
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const post = new Post({ title, body, image, user: userId });
      await post.save();

      res.status(201).json(post);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Get all posts
  router.get('/', async (req, res) => {
    try {
      const posts = await Post.find().populate('user', 'name');
      res.status(200).json({ posts });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Update a post
  router.put('/:postId', authMiddleware, async (req, res) => {
    try {
      const { postId } = req.params;
      const { title, body, image } = req.body;
      const userId = req.userId;

      const post = await Post.findById(postId);

      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }

      if (post.user.toString() !== userId) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      post.title = title;
      post.body = body;
      post.image = image;
      await post.save();

      res.status(200).json(post);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Delete a post
  router.delete('/:postId', authMiddleware, async (req, res) => {
    try {
      const { postId } = req.params;
      const userId = req.userId;

      const post = await Post.findById(postId);

      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }

      if (post.user.toString() !== userId) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      await post.remove();

      res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  module.exports = router;