const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const User = require('../models/User');
const mongoose = require('mongoose');
const authMiddleware = require('../middlewares/authMiddleware');
const multer = require('multer');
const { bucket } = require('../configs/firebase');
const path = require('path');
const fs = require('fs');

// Configure multer with file filter for images
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    // Check if the file is an image
    if (file.mimetype.startsWith('image/')) {
      // Accept only common image formats
      if (
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/gif' ||
        file.mimetype === 'image/webp' ||
        file.mimetype === 'image/svg+xml'
      ) {
        cb(null, true);
      } else {
        cb(new Error('Only JPG, PNG, GIF, WebP, and SVG image formats are allowed'), false);
      }
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  }
});

// Custom middleware with error handling for image uploads
const imageUploadMiddleware = (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ 
        error: 'File upload error', 
        details: err.message 
      });
    } else if (err) {
      return res.status(400).json({ 
        error: 'Invalid file', 
        details: err.message 
      });
    }
    next();
  });
};

// CREATE - Post a new blog with image upload
router.post('/', authMiddleware, imageUploadMiddleware, async (req, res) => {
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
    
    // Create blog without image first
    const newBlog = new Blog({
      title,
      content,
      tags: processedTags,
      status: status || 'published',
      userId: user._id,
      image: 'default-blog-image.jpg' // Default image that will be replaced if there's an upload
    });
      // Handle image upload if provided
    if (req.file) {
      try {
        const file = req.file;
        const filename = `blogs/${newBlog._id}_${Date.now()}_${file.originalname}`;
        const blob = bucket.file(filename);
        const blobStream = blob.createWriteStream({
          metadata: { 
            contentType: file.mimetype,
            metadata: {
              fileType: file.mimetype.split('/')[1], // Extract format (jpeg, png, etc.)
              blogId: newBlog._id.toString(),
              userId: user._id.toString()
            }
          }
        });
        
        // Return a promise that resolves when the upload is complete
        const uploadPromise = new Promise((resolve, reject) => {
          blobStream.on('error', (err) => reject(err));
          
          blobStream.on('finish', async () => {
            // Make the file publicly accessible
            await blob.makePublic();
            
            // Get the public URL
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;
            newBlog.image = publicUrl;
            resolve();
          });
          
          // Send the file data to Firebase
          blobStream.end(file.buffer);
        });
        
        await uploadPromise;
      } catch (uploadErr) {
        console.error('Blog image upload error:', uploadErr);
        // Continue with default image if upload fails
      }
    }
    
    const savedBlog = await newBlog.save();
    
    // Populate author information
    await savedBlog.populate({
      path: 'userId',
      select: 'userName avatar'
    });
    
    res.status(201).json(savedBlog);
  } catch (err) {
    console.error('Blog creation error:', err);
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
        select: 'userName avatar'
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
      select: 'userName avatar'
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
      select: 'userName avatar'
    })
    .limit(3);
    
    res.json({ blog, relatedBlogs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE - Update a blog with image upload (auth required)
router.put('/:id', authMiddleware, imageUploadMiddleware, async (req, res) => {
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
      // Handle image upload if provided
    if (req.file) {
      try {
        const file = req.file;
        const filename = `blogs/${blog._id}_${Date.now()}_${file.originalname}`;
        const blob = bucket.file(filename);
        const blobStream = blob.createWriteStream({
          metadata: { 
            contentType: file.mimetype,
            metadata: {
              fileType: file.mimetype.split('/')[1], // Extract format (jpeg, png, etc.)
              blogId: blog._id.toString(),
              userId: user._id.toString(),
              operation: 'update'
            }
          }
        });
        
        // Return a promise that resolves when the upload is complete
        const uploadPromise = new Promise((resolve, reject) => {
          blobStream.on('error', (err) => reject(err));
          
          blobStream.on('finish', async () => {
            // Make the file publicly accessible
            await blob.makePublic();
            
            // Get the public URL
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;
            req.body.image = publicUrl;
            resolve();
          });
          
          // Send the file data to Firebase
          blobStream.end(file.buffer);
        });
        
        await uploadPromise;
      } catch (uploadErr) {
        console.error('Blog image update error:', uploadErr);
        // Continue without changing the image if upload fails
      }
    }
    
    // Update the blog
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate({
      path: 'userId',
      select: 'userName avatar'
    });
    
    res.json(updatedBlog);
  } catch (err) {
    console.error('Blog update error:', err);
    res.status(500).json({ error: err.message });
  }
});

// UPDATE BLOG IMAGE ENDPOINT - Used for updating just the image
router.put('/:id/update-image', authMiddleware, imageUploadMiddleware, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid blog ID' });
    }
    
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
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
      return res.status(403).json({ error: 'You can only update your own blogs' });
    }
    
    // Handle the image upload
    const file = req.file;
    const filename = `blogs/${blog._id}_${Date.now()}_${file.originalname}`;
    const blob = bucket.file(filename);
    const blobStream = blob.createWriteStream({
      metadata: { 
        contentType: file.mimetype,
        metadata: {
          fileType: file.mimetype.split('/')[1], // Extract format (jpeg, png, etc.)
          blogId: blog._id.toString(),
          userId: user._id.toString()
        }
      }
    });
    
    // Return a promise that resolves when the upload is complete
    const uploadPromise = new Promise((resolve, reject) => {
      blobStream.on('error', (err) => {
        console.error('Blog image upload error:', err);
        reject(err);
      });
      
      blobStream.on('finish', async () => {
        try {
          // Make the file publicly accessible
          await blob.makePublic();
          
          // Get the public URL
          const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;
          
          // Update only the image field
          const updatedBlog = await Blog.findByIdAndUpdate(
            req.params.id,
            { image: publicUrl },
            { new: true }
          ).populate({
            path: 'userId',
            select: 'userName avatar'
          });
          
          resolve(updatedBlog);
        } catch (err) {
          reject(err);
        }
      });
      
      // Send the file data to Firebase
      blobStream.end(file.buffer);
    });
    
    const updatedBlog = await uploadPromise;
    res.json({
      message: 'Blog image updated successfully',
      blog: updatedBlog
    });
  } catch (err) {
    console.error('Blog image update error:', err);
    res.status(500).json({ error: 'Failed to update blog image', details: err.message });
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