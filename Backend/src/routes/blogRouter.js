const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const User = require('../models/User');
const mongoose = require('mongoose');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../utils/fileUpload');
const path = require('path');
const fs = require('fs');

// CREATE - Post a new blog with image upload
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { title, content, tags, status } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    // Find the user associated with the authenticated account
    const user = await User.findOne({ idAccount: req.user.id });

    if (!user) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    // Process tags if they're sent as a string
    let processedTags = [];
    if (typeof tags === 'string') {
      processedTags = tags.split(',').map(tag => tag.trim());
    } else if (Array.isArray(tags)) {
      processedTags = tags;
    }

    const newBlog = new Blog({
      title,
      content,
      tags: processedTags,
      status: status || 'published',
      userId: user._id, // Use the User ID, not the Account ID
      image: req.file ? req.file.filename : 'default-blog-image.jpg'
    });

    const savedBlog = await newBlog.save();

    // Populate author information
    await savedBlog.populate({
      path: 'userId',
      select: 'userName'
    });

    res.status(201).json(savedBlog);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ - Get all blogs (public)
router.get('/', async (req, res) => {
  try {
    const { tag, search, author, limit = 10, page = 1 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build query object
    const query = { status: 'published' };

    // Add tag filter if provided
    if (tag) {
      query.tags = tag;
    }

    // Add search filter if provided
    if (search) {
      query.$text = { $search: search };
    }

    // Add author filter if provided
    if (author && mongoose.Types.ObjectId.isValid(author)) {
      query.userId = author;
    }

    // Execute query with pagination
    const blogs = await Blog.find(query)
      .populate({
        path: 'userId',
        select: 'userName'
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Blog.countDocuments(query);

    res.json({
      blogs,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ - Get a specific blog by ID (public)
router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid blog ID' });
    }

    // Find blog and increment view count
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate({
      path: 'userId',
      select: 'userName'
    });

    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    // Find related blogs based on tags
    const relatedBlogs = await Blog.find({
      _id: { $ne: blog._id }, // Exclude current blog
      tags: { $in: blog.tags }, // Match at least one tag
      status: 'published'
    })
      .populate({
        path: 'userId',
        select: 'userName'
      })
      .limit(3);

    res.json({ blog, relatedBlogs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE - Update a blog with image upload (auth required)
router.put('/:id', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid blog ID' });
    }

    // Find the user associated with the authenticated account
    const user = await User.findOne({ idAccount: req.user.id });

    if (!user) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    // Find the blog
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    // Check if user is the author
    if (blog.userId.toString() !== user._id.toString()) {
      return res.status(403).json({ error: 'You can only edit your own blogs' });
    }

    // Process tags if they're sent as a string
    let processedTags;
    if (req.body.tags) {
      if (typeof req.body.tags === 'string') {
        processedTags = req.body.tags.split(',').map(tag => tag.trim());
        req.body.tags = processedTags;
      }
    }

    // Handle image update
    if (req.file) {
      // If there's an existing custom image, delete it
      if (blog.image && blog.image !== 'default-blog-image.jpg' && fs.existsSync(path.join(__dirname, '..', '..', blog.image))) {
        fs.unlinkSync(path.join(__dirname, '..', '..', blog.image));
      }
      req.body.image = req.file.filename;
    }

    // Update the blog
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate({
      path: 'userId',
      select: 'userName'
    });

    res.json(updatedBlog);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE - Delete a blog (auth required)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid blog ID' });
    }

    // Find the user associated with the authenticated account
    const user = await User.findOne({ idAccount: req.user.id });

    if (!user) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    // Find the blog
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    // Check if user is the author
    if (blog.userId.toString() !== user._id.toString()) {
      return res.status(403).json({ error: 'You can only delete your own blogs' });
    }

    // Delete the associated image if it's not the default
    if (blog.image && blog.image !== 'default-blog-image.jpg' && fs.existsSync(path.join(__dirname, '..', '..', blog.image))) {
      fs.unlinkSync(path.join(__dirname, '..', '..', blog.image));
    }

    // Delete the blog
    await Blog.findByIdAndDelete(req.params.id);

    res.json({ message: 'Blog deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET - User's blogs (auth required)
router.get('/user/blogs', authMiddleware, async (req, res) => {
  try {
    const { status, limit = 10, page = 1 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Find the user associated with the authenticated account
    const user = await User.findOne({ idAccount: req.user.id });

    if (!user) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    // Build query object
    const query = { userId: user._id };

    // Filter by status if provided
    if (status && ['draft', 'published'].includes(status)) {
      query.status = status;
    }

    // Get user's blogs with pagination
    const blogs = await Blog.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Blog.countDocuments(query);

    res.json({
      blogs,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET - Popular tags
router.get('/tags/popular', async (req, res) => {
  try {
    const blogs = await Blog.find({ status: 'published' });

    // Extract all tags and count occurrences
    const tagCounts = {};
    blogs.forEach(blog => {
      blog.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    // Convert to array and sort by count
    const popularTags = Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Get top 10 tags

    res.json(popularTags);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 