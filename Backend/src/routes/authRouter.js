const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Account = require('../models/Account');
const User = require('../models/User');
const Business = require('../models/Business');
const Student = require('../models/Student'); // Added Student model
const crypto = require('crypto'); // For generating random student ID

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

    // --- SỬA ĐỔI Ở ĐÂY ---
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

    // Generate a random student ID (e.g., "S_" followed by 6 random hex chars)
    const randomId = crypto.randomBytes(3).toString('hex').toUpperCase();
    const studentId = `S_${randomId}`;

    // Create a Student record with default values if not provided
    const newStudent = new Student({
      idStudent: studentId,
      age: age || 18, // Default age if not provided
      school: school || 'Unknown', // Default school if not provided
      course: course || 'IT', // Default course if not provided
      englishSkill: englishSkill || 'Intermediate', // Default English skill if not provided
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
    const { username, password, email, userName, location, phone, detail } = req.body;

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

    const account = await Account.findOne({ username });
    if (!account) return res.status(400).json({ error: 'Invalid username or password' });

    const isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid username or password' });

    const token = jwt.sign({ id: account._id }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    res.json({ token });
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

module.exports = router;