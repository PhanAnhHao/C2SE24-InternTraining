const express = require('express');
const router = express.Router();
const User = require('../models/User');
const mongoose = require('mongoose');
const authMiddleware = require('../middleware/auth');
const multer = require('multer');
const { bucket } = require('../configs/firebase');

// Configure multer for document files
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    // Accept only .pdf and .docx files
    if (
      file.mimetype === 'application/pdf' || 
      file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      cb(null, true);
    } else {
      cb(new Error('Only .pdf or .docx files are allowed'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  }
});

// Custom middleware with error handling
const documentUploadMiddleware = (req, res, next) => {
  upload.single('document')(req, res, (err) => {
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

// CREATE user profile (nếu cần)
router.post('/', async (req, res) => {
  try {
    const { userName, email, location, phone, idAccount } = req.body;

    const existing = await User.findOne({ idAccount });
    if (existing) return res.status(400).json({ error: 'User profile already exists' });

    const newUser = new User({ userName, email, location, phone, idAccount });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().populate('idAccount', 'username');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE user CV - authenticated route, users can update only their own CV
// Now accepts file upload directly instead of requiring a URL
router.put('/update-cv', authMiddleware, documentUploadMiddleware, async (req, res) => {
  try {
    // Verify file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'No CV document uploaded' });
    }
    
    // Find the user based on account ID from token
    const user = await User.findOne({ idAccount: req.user.id });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Check file type
    const file = req.file;
    if (!(file.mimetype === 'application/pdf' || 
          file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
      return res.status(400).json({ error: 'Only .pdf or .docx files are allowed' });
    }
    
    // Upload file to Firebase
    const filename = `cv_documents/${user._id}_${Date.now()}_${file.originalname}`;
    const blob = bucket.file(filename);
    const blobStream = blob.createWriteStream({
      metadata: { 
        contentType: file.mimetype,
        metadata: {
          fileType: file.mimetype.includes('pdf') ? 'pdf' : 'docx',
          userId: user._id.toString()
        }
      }
    });

    // Handle errors during upload
    blobStream.on('error', (err) => {
      return res.status(500).json({ error: 'Failed to upload CV document', details: err.message });
    });

    // When upload completes, get the public URL and update user profile
    blobStream.on('finish', async () => {
      // Get signed URL
      const [url] = await blob.getSignedUrl({
        action: "read",
        expires: "03-09-2491", // Long expiration
      });
      
      // Update user CV in database
      user.cv = {
        url: url,
        fileName: file.originalname,
        fileType: file.mimetype,
        uploadDate: new Date().toISOString()
      };
      
      await user.save();
      
      res.json({
        message: 'CV document uploaded and updated successfully',
        cv: user.cv
      });
    });

    // Start the upload by sending the buffer to Firebase
    blobStream.end(file.buffer);
  } catch (err) {
    console.error('CV update error:', err);
    res.status(500).json({ error: 'Failed to update CV', details: err.message });
  }
});

// Direct CV file upload with authentication - uploads CV file and updates user profile
router.post('/upload-cv', authMiddleware, documentUploadMiddleware, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No CV document uploaded' });
    }

    // Find the user based on account ID from token
    const user = await User.findOne({ idAccount: req.user.id });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check file type
    const file = req.file;
    if (!(file.mimetype === 'application/pdf' || 
          file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
      return res.status(400).json({ error: 'Only .pdf or .docx files are allowed' });
    }
    
    // Upload file to Firebase
    const filename = `cv_documents/${user._id}_${Date.now()}_${file.originalname}`;
    const blob = bucket.file(filename);
    const blobStream = blob.createWriteStream({
      metadata: { 
        contentType: file.mimetype,
        metadata: {
          fileType: file.mimetype.includes('pdf') ? 'pdf' : 'docx',
          userId: user._id.toString()
        }
      }
    });

    // Handle errors during upload
    blobStream.on('error', (err) => {
      return res.status(500).json({ error: 'Failed to upload CV document', details: err.message });
    });

    // When upload completes, get the public URL and update user profile
    blobStream.on('finish', async () => {
      // Get signed URL
      const [url] = await blob.getSignedUrl({
        action: "read",
        expires: "03-09-2491", // Long expiration
      });
      
      // Update user CV in database
      user.cv = {
        url: url,
        fileName: file.originalname,
        fileType: file.mimetype,
        uploadDate: new Date().toISOString()
      };
      
      await user.save();
      
      res.json({
        message: 'CV document uploaded successfully',
        cv: user.cv
      });
    });

    // Start the upload by sending the buffer to Firebase
    blobStream.end(file.buffer);
  } catch (err) {
    console.error('CV upload error:', err);
    res.status(500).json({ error: 'Failed to upload CV document', details: err.message });
  }
});

// GET user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('idAccount', 'username');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE user
router.put('/:id', async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'User not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE user
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
