// Backend/src/routes/cvUpload.route.js
const express = require("express");
const multer = require("multer");
const { bucket } = require("../configs/firebase");

const router = express.Router();

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

// Custom middleware with error handling for document uploads
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

// Route for CV document upload
router.post("/upload-cv", documentUploadMiddleware, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send({ error: "No document file uploaded" });
    }

    const file = req.file;
    // Store CV files in a dedicated 'cv_documents' folder
    const blob = bucket.file(`cv_documents/${Date.now()}_${file.originalname}`);
    const blobStream = blob.createWriteStream({
      metadata: { 
        contentType: file.mimetype,
        metadata: {
          // Add custom metadata if needed
          fileType: file.mimetype.includes('pdf') ? 'pdf' : 'docx',
          uploadedBy: req.body.studentId || 'unknown',
        }
      },
    });

    blobStream.on("error", err => res.status(500).send({ error: err.message }));

    blobStream.on("finish", async () => {
      const [url] = await blob.getSignedUrl({
        action: "read",
        expires: "03-09-2491", // Long expiration
      });
      res.send({ 
        documentUrl: url,
        fileName: file.originalname,
        fileType: file.mimetype,
        uploadDate: new Date().toISOString()
      });
    });

    blobStream.end(file.buffer);
  } catch (err) {
    res.status(500).send({ error: "CV upload failed", details: err.message });
  }
});

module.exports = router;
