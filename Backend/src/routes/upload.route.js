// Backend/src/routes/upload.route.js
const express = require("express");
const multer = require("multer");
const { bucket } = require("../configs/firebase");

const router = express.Router();

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

// Custom middleware with error handling
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

router.post("/upload", imageUploadMiddleware, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send({ error: "No image file uploaded" });
    }

    const file = req.file;
    const filename = `images/${Date.now()}_${file.originalname}`;
    const blob = bucket.file(filename);
    const blobStream = blob.createWriteStream({
      metadata: { 
        contentType: file.mimetype,
        metadata: {
          fileType: file.mimetype.split('/')[1], // Extract format (jpeg, png, etc.)
          uploadedBy: req.body.userId || 'unknown',
          uploadedAt: new Date().toISOString()
        }
      }
    });

    blobStream.on("error", err => res.status(500).send({ error: err.message }));

    blobStream.on("finish", async () => {
      const [url] = await blob.getSignedUrl({
        action: "read",
        expires: "03-09-2491",
      });
      res.send({ 
        imageUrl: url,
        fileName: file.originalname,
        fileType: file.mimetype,
        uploadDate: new Date().toISOString()
      });
    });

    blobStream.end(file.buffer);
  } catch (err) {
    res.status(500).send({ error: "Upload failed", details: err.message });
  }
});

module.exports = router;