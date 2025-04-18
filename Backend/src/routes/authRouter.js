const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Account = require('../models/Account');
const User = require('../models/User');
const Business = require('../models/Business');

const router = express.Router();

// Đăng ký cho Student
router.post('/register', async (req, res) => {
  try {
    const { username, password, email, userName, location, phone } = req.body;

    const defaultRoleId = '660edabc12eac0f2fc123402';

    const existing = await Account.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already exists' });

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

    await newUser.save();

    res.status(201).json({ message: 'Register successful' });
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
    const { username, password, email, userName, location, phone, idBusiness, detail } = req.body;

    const defaultRoleId = '660edabc12eac0f2fc123403';

    const existing = await Account.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already exists' });

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

    const newBusiness = new Business({
      idBusiness,
      detail,
      userId: savedUser._id
    });

    await newBusiness.save();

    res.status(201).json({ message: 'Business registration successful' });
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
    const user = await User.findOne({ idAccount: req.user.id }).populate('idAccount', 'username');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;