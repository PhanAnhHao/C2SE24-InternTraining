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
const upload = multer({ storage: multer.memoryStorage() });
const sendEmail = require('../utils/sendEmail');
const authenticate = require('../middleware/auth');
const mongoose = require('mongoose');

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

    // Kiểm tra username đã tồn tại chưa
    const existing = await Account.findOne({ username });
    if (existing) return res.status(400).json({ error: 'Username already exists' });

    // Kiểm tra email đã tồn tại chưa
    const emailExists = await User.findOne({ email });
    if (emailExists) return res.status(400).json({ error: 'Email already exists' });

    // Sử dụng transaction để đảm bảo tính toàn vẹn dữ liệu
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      // Thêm trường 'role' với giá trị là defaultRoleId
      const newAccount = new Account({
        username,
        password: hashedPassword,
        role: defaultRoleId // Gán Role mặc định khi tạo Account
      });

      const savedAccount = await newAccount.save({ session });

      const newUser = new User({
        userName,
        email,
        location,
        phone,
        idAccount: savedAccount._id
      });

      const savedUser = await newUser.save({ session });

      // Generate a random student ID (e.g., "S_" followed by 6 random hex chars)
      const randomId = crypto.randomBytes(3).toString('hex').toUpperCase();
      const studentId = `S_${randomId}`;

      // Create a Student record with default values if not provided
      const newStudent = new Student({
        idStudent: studentId,
        age: age || 18, // Default age if not provided
        school: school || 'Unknown', // Default school if not provided
        course: course ? (Array.isArray(course) ? course : [course]) : ['IT'], // Ensure course is an array
        englishSkill: englishSkill || 'Intermediate', // Default English skill if not provided
        userId: savedUser._id
      });

      const savedStudent = await newStudent.save({ session });

      // Commit transaction
      await session.commitTransaction();
      session.endSession();

      res.status(201).json({
        message: 'Register successful',
        studentId: savedStudent._id // Return the ID of the created student record
      });
    } catch (error) {
      // Nếu có lỗi, hủy transaction
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
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

    // Kiểm tra username đã tồn tại chưa
    const existing = await Account.findOne({ username });
    if (existing) return res.status(400).json({ error: 'Username already exists' });

    // Kiểm tra email đã tồn tại chưa
    const emailExists = await User.findOne({ email });
    if (emailExists) return res.status(400).json({ error: 'Email already exists' });

    // Sử dụng transaction để đảm bảo tính toàn vẹn dữ liệu
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const newAccount = new Account({
        username,
        password: hashedPassword,
        role: defaultRoleId
      });

      const savedAccount = await newAccount.save({ session });

      const newUser = new User({
        userName,
        email,
        location,
        phone,
        idAccount: savedAccount._id
      });

      const savedUser = await newUser.save({ session });

      // Generate a random business ID with format BUS12345
      const randomNumbers = Math.floor(10000 + Math.random() * 90000); // Generate a 5-digit number
      const businessId = `BUS${randomNumbers}`;

      const newBusiness = new Business({
        idBusiness: businessId, // Use the generated business ID
        type, // Added the type field
        detail,
        userId: savedUser._id
      });

      const savedBusiness = await newBusiness.save({ session });

      // Commit transaction
      await session.commitTransaction();
      session.endSession();

      res.status(201).json({
        message: 'Business registration successful',
        businessId: savedBusiness.idBusiness // Return the generated business ID
      });
    } catch (error) {
      // Nếu có lỗi, hủy transaction
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
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

// Update user avatar
router.put('/update-avatar', authMiddleware, upload.single('avatar'), async (req, res) => {
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
      metadata: { contentType: file.mimetype }
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

// Change password route (requires authentication)
router.post('/change-password', authenticate, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // Find the account
    const account = await Account.findById(userId);
    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, account.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Hash the new password and update
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    account.password = hashedPassword;
    await account.save();

    res.json({ message: 'Password successfully updated' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

// Register admin account (requires a secret key for security)
router.post('/register-admin', async (req, res) => {
  try {
    const {
      username,
      password,
      email,
      userName,
      location,
      phone
    } = req.body;

    const adminRoleId = '660edabc12eac0f2fc123401'; // Admin role ID

    // Check if username already exists
    const existing = await Account.findOne({ username });
    if (existing) return res.status(400).json({ error: 'Username already exists' });

    // Check if email already exists
    const emailExists = await Account.findOne({ email });
    if (emailExists) return res.status(400).json({ error: 'Email already exists' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new account with admin role
    const newAccount = new Account({
      username,
      password: hashedPassword,
      role: adminRoleId
    });

    const savedAccount = await newAccount.save();

    // Create user profile for admin
    const newUser = new User({
      userName,
      email,
      location,
      phone,
      idAccount: savedAccount._id
    });

    const savedUser = await newUser.save();

    res.status(201).json({
      message: 'Admin registration successful',
      adminId: savedUser._id
    });
  } catch (err) {
    console.error("Admin Registration Error:", err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
});

// Forgot password - Request password reset
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found with that email' });
    }

    // Find associated account
    const account = await Account.findById(user.idAccount);
    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Save token to account with expiration (1 hour)
    account.resetPasswordToken = resetToken;
    account.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await account.save();

    // Create reset URL

    const resetUrl = `${process.env.FRONTEND_URL || 'https://localhost:5173'}/reset-password/${resetToken}`;


    // Send email
    await sendEmail({
      to: email,
      subject: 'Password Reset Request',
      htmlContent: `
        <p>You requested a password reset. Please click the link below to reset your password:</p>
        <p><a href="${resetUrl}" style="padding: 10px 15px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
        <p>If you didn't request this, please ignore this email and your password will remain unchanged.</p>
        <p>This link will expire in 1 hour.</p>
      `
    });

    res.json({ message: 'Password reset email sent' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Failed to process password reset request' });
  }
});

// Reset password with token
router.post('/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    // Find account with the provided token and valid expiration
    const account = await Account.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!account) {
      return res.status(400).json({ error: 'Password reset token is invalid or has expired' });
    }

    // Hash new password and update account
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    account.password = hashedPassword;
    account.resetPasswordToken = undefined;
    account.resetPasswordExpires = undefined;
    await account.save();

    // Find user to get email for confirmation
    const user = await User.findOne({ idAccount: account._id });
    if (user) {
      // Send confirmation email
      await sendEmail({
        to: user.email,
        subject: 'Password Reset Successful',
        htmlContent: `
          <p>Your password has been successfully reset.</p>
          <p>If you did not make this change, please contact our support team immediately.</p>
        `
      });
    }

    res.json({ message: 'Password has been reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

// Verify reset token validity
router.get('/verify-reset-token/:token', async (req, res) => {
  try {
    const { token } = req.params;

    const account = await Account.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!account) {
      return res.status(400).json({ valid: false, error: 'Password reset token is invalid or has expired' });
    }

    res.json({ valid: true });
  } catch (error) {
    console.error('Verify token error:', error);
    res.status(500).json({ valid: false, error: 'Failed to verify token' });
  }
});

module.exports = router;