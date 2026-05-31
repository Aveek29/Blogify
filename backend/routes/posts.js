const express = require('express');
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
const Post = require('../models/Post');
const auth = require('../middleware/auth');

const router = express.Router();

router.post(
  '/',
  auth,
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('content').trim().notEmpty().withMessage('Content is required'),
    body('category').isIn([
      'General', 'AI', 'Algorithms', 'Android', 'Angular', 'Architecture',
      'Assignment', 'AWS', 'Azure', 'Best Practices', 'Blockchain',
      'C#', 'C++', 'Career', 'CI/CD', 'CSS',
      'Dart', 'Data Science', 'Database', 'Deep Learning', 'Deno',
      'Design', 'DevOps', 'Django', 'Docker', 'Express',
      'Flask', 'Flutter', 'GCP', 'Go', 'GraphQL',
      'HTML', 'IoT', 'Interview', 'Java', 'JavaScript',
      'Kotlin', 'Kubernetes', 'Linux', 'LLM', 'Lua',
      'Machine Learning', 'Mobile', 'MongoDB', 'MySQL', 'NLP',
      'Networking', 'Next.js', 'Node.js', 'Nuxt', 'Open Source',
      'Opinion', 'Performance', 'PHP', 'PostgreSQL', 'Project',
      'Prompt Engineering', 'Python', 'React', 'React Native', 'Redis',
      'Research', 'Review', 'Ruby', 'Rust', 'Security',
      'Spring Boot', 'SQLite', 'Svelte', 'Swift', 'System Design',
      'Testing', 'Tutorial', 'TypeScript', 'UI/UX', 'Vue',
      'Web Dev',
    ]).withMessage('Invalid category'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
      }

      const { title, content, category, imageUrl } = req.body;

      const post = await Post.create({
        title,
        content,
        author: req.user.username,
        authorId: req.user._id,
        category,
        imageUrl: imageUrl || '',
      });

      res.status(201).json(post);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
);

router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const search = req.query.search || '';
    const category = req.query.category || '';

    const queryObj = {};

    if (search) {
      queryObj.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    if (category) {
      queryObj.category = category;
    }

    const total = await Post.countDocuments(queryObj);
    const posts = await Post.find(queryObj)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      posts,
      page,
      totalPages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

router.get('/:id', async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid post ID format' });
    }
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid post ID format' });
    }
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (post.authorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this post' });
    }

    const { title, content, category, imageUrl } = req.body;

    post.title = (title !== undefined && title !== null) ? title : post.title;
    post.content = (content !== undefined && content !== null) ? content : post.content;
    post.category = (category !== undefined && category !== null) ? category : post.category;
    post.imageUrl = imageUrl !== undefined ? imageUrl : post.imageUrl;

    const updated = await post.save();
    res.json(updated);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid data format' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid post ID format' });
    }
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (post.authorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid data format' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
