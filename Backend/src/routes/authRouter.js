const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Account = require('../models/Account');
const User = require('../models/User');

const router = express.Router();

// Đăng ký
router.post('/register', async (req, res) => {
  try {
    const { username, password, email, userName, location, phone } = req.body;

    // Kiểm tra trùng username hoặc email
    const existing = await Account.findOne({ username });
    if (existing) return res.status(400).json({ error: 'Username already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAccount = new Account({ username, password: hashedPassword });
    const savedAccount = await newAccount.save();

    // Tạo luôn user profile
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
    res.status(500).json({ error: err.message });
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
