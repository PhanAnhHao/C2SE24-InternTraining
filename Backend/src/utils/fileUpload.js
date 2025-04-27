const multer = require('multer');
const path = require('path');

// Set storage engine for blog images
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/blogs');
  },
  filename: function(req, file, cb) {
    cb(null, `blog-${Date.now()}${path.extname(file.originalname)}`);
  }
});

// Check file type
function checkFileType(file, cb) {
  // Allowed file extensions
  const filetypes = /jpeg|jpg|png|gif|webp/;
  // Check extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime type
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images only (jpeg, jpg, png, gif, webp)!');
  }
}

// Initialize upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 5000000 }, // 5MB
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
});

module.exports = upload; 