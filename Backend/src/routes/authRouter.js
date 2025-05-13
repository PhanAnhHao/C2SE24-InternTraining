const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Account = require('../models/Account');
const User = require('../models/User');
const Business = require('../models/Business');
const Student = require('../models/Student'); // Added Student model
const crypto = require('crypto'); // For generating random student ID
const multer = require('multer');
const { bucket } = require('../configs/firebase');

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

const router = express.Router();

// Đăng ký cho Student
router.post('/register', async (req, res) => {
  try {
    const {
      username,
      password,
      email,
      userName,
      location,
      phone,
      // Optional student fields
      age,
      school,
      course,
      englishSkill
    } = req.body;

    const defaultRoleId = '660edabc12eac0f2fc123402';

    const existing = await Account.findOne({ username });
    if (existing) return res.status(400).json({ error: 'Username already exists' });

    const emailExists = await Account.findOne({ email });
    if (emailExists) return res.status(400).json({ error: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    // Thêm trường 'role' với giá trị là defaultRoleId
    const newAccount = new Account({
      username,
      password: hashedPassword,
      role: defaultRoleId // Gán Role mặc định khi tạo Account
    });

    const savedAccount = await newAccount.save();

    const newUser = new User({
      userName,
      email,
      location,
      phone,
      idAccount: savedAccount._id
    });

    const savedUser = await newUser.save();

    // Generate a random student ID
    const randomId = crypto.randomBytes(3).toString('hex').toUpperCase();
    const studentId = `S_${randomId}`;

    // Create a Student record with default values if not provided
    const newStudent = new Student({
      idStudent: studentId,
      age: age || 18,
      school: school || 'Unknown',
      course: course ? (Array.isArray(course) ? course : [course]) : ['IT'], // Ensure course is an array
      englishSkill: englishSkill || 'Intermediate',
      userId: savedUser._id
    });

    const savedStudent = await newStudent.save();

    res.status(201).json({
      message: 'Register successful',
      studentId: savedStudent._id // Return the ID of the created student record
    });
  } catch (err) {
    console.error("Register Error:", err); // Log lỗi ra console để debug dễ hơn
    // Trả về lỗi cụ thể hơn nếu là lỗi validation
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'An internal server error occurred.' }); // Trả về lỗi chung chung hơn
  }
});

// Đăng ký cho Business
router.post('/register-business', async (req, res) => {
  try {
    const { username, password, email, userName, location, phone, detail, type } = req.body;

    if (!type) {
      return res.status(400).json({ error: 'Business type is required' });
    }

    const defaultRoleId = '660edabc12eac0f2fc123403';

    const existing = await Account.findOne({ username });
    if (existing) return res.status(400).json({ error: 'Username already exists' });

    const emailExists = await Account.findOne({ email });
    if (emailExists) return res.status(400).json({ error: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAccount = new Account({
      username,
      password: hashedPassword,
      role: defaultRoleId
    });

    const savedAccount = await newAccount.save();

    const newUser = new User({
      userName,
      email,
      location,
      phone,
      idAccount: savedAccount._id
    });

    const savedUser = await newUser.save();

    // Generate a random business ID with format BUS12345
    const randomNumbers = Math.floor(10000 + Math.random() * 90000); // Generate a 5-digit number
    const businessId = `BUS${randomNumbers}`;

    const newBusiness = new Business({
      idBusiness: businessId, // Use the generated business ID
      type, // Added the type field
      detail,
      userId: savedUser._id
    });

    const savedBusiness = await newBusiness.save();

    res.status(201).json({
      message: 'Business registration successful',
      businessId: savedBusiness.idBusiness // Return the generated business ID
    });
  } catch (err) {
    console.error("Business Registration Error:", err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
});

// Đăng nhập
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const account = await Account.findOne({ username }).populate({
      path: 'role',
      select: 'name description'
    });
    
    if (!account) return res.status(400).json({ error: 'Invalid username or password' });

    const isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid username or password' });

    const token = jwt.sign({ id: account._id }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    // Find the user to get additional information
    const user = await User.findOne({ idAccount: account._id });
    if (!user) return res.status(404).json({ error: 'User information not found' });

    let responseData = {
      token,
      userId: account._id,
      role: {
        id: account.role._id,
        name: account.role.name,
        description: account.role.description
      }
    };

    // Add role-specific ID
    if (account.role.name === 'Student') {
      const student = await Student.findOne({ userId: user._id });
      if (student) {
        responseData.studentId = student._id;
      }
    } else if (account.role.name === 'Business') {
      const business = await Business.findOne({ userId: user._id });
      if (business) {
        responseData.businessId = business._id;
      }
    }

    res.json(responseData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Lấy thông tin người dùng hiện tại
const authMiddleware = require('../middlewares/authMiddleware');
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ idAccount: req.user.id })
      .populate({
        path: 'idAccount',
        select: 'username role',
        populate: {
          path: 'role',
          select: 'name description'
        }
      });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Cập nhật thông tin người dùng hiện tại
router.put('/edit-me', authMiddleware, async (req, res) => {
  try {
    const { userName, email, location, phone } = req.body;

    // Tìm user dựa trên account ID từ token
    const user = await User.findOne({ idAccount: req.user.id });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Cập nhật các trường nếu được cung cấp
    if (userName) user.userName = userName;
    if (email) user.email = email;
    if (location) user.location = location;
    if (phone) user.phone = phone;

    // Lưu thay đổi
    const updatedUser = await user.save();

    res.json({
      message: 'User profile updated successfully',
      user: updatedUser
    });
  } catch (err) {
    console.error("Update Profile Error:", err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
});

// Update user avatar - with file type validation middleware
const updateAvatarUpload = (req, res, next) => {
  upload.single('avatar')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading (file size, etc.)
      return res.status(400).json({ 
        error: 'File upload error', 
        details: err.message 
      });
    } else if (err) {
      // File type validation error or other error
      return res.status(400).json({ 
        error: 'Invalid file', 
        details: err.message 
      });
    }
    // No errors, proceed
    next();
  });
};

// Update user avatar
router.put('/update-avatar', authMiddleware, updateAvatarUpload, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No avatar file uploaded' });
    }

    // Find the user based on account ID from token
    const user = await User.findOne({ idAccount: req.user.id });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Upload file to Firebase
    const file = req.file;
    const filename = `avatars/${user._id}_${Date.now()}_${file.originalname}`;
    const blob = bucket.file(filename);
    const blobStream = blob.createWriteStream({
      metadata: { 
        contentType: file.mimetype,
        metadata: {
          fileType: file.mimetype.split('/')[1], // Extract format (jpeg, png, etc.)
          userId: user._id.toString()
        }
      }
    });

    // Handle errors during upload
    blobStream.on('error', (err) => {
      return res.status(500).json({ error: 'Failed to upload avatar', details: err.message });
    });

    // When upload completes, get the public URL
    blobStream.on('finish', async () => {
      // Make the file publicly accessible
      await blob.makePublic();
      
      // Get the public URL
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;
      
      // Update user avatar in database
      user.avatar = publicUrl;
      await user.save();
      
      res.json({
        message: 'Avatar updated successfully',
        avatar: publicUrl
      });
    });

    // Start the upload by sending the buffer to Firebase
    blobStream.end(file.buffer);
  } catch (err) {
    console.error('Avatar update error:', err);
    res.status(500).json({ error: 'Failed to update avatar', details: err.message });
  }
});

module.exports = router;