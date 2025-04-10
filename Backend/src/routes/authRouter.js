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

    // --- BỔ SUNG: Lấy ID của Role 'Student' ---
    // Cách 1: Hardcode ID (nếu bạn chắc chắn ID này không đổi)
    const defaultRoleId = '660edabc12eac0f2fc123402';

    // Cách 2: Tìm Role ID động (an toàn hơn nếu ID có thể thay đổi)
    // const studentRole = await Role.findOne({ name: 'Student' });
    // if (!studentRole) {
    //   return res.status(500).json({ error: 'Default role "Student" not found.' });
    // }
    // const defaultRoleId = studentRole._id;
    // --- KẾT THÚC BỔ SUNG ---

    const existing = await Account.findOne({ username });
    if (existing) return res.status(400).json({ error: 'Username already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    // --- SỬA ĐỔI Ở ĐÂY ---
    // Thêm trường 'role' với giá trị là defaultRoleId
    const newAccount = new Account({
      username,
      password: hashedPassword,
      role: defaultRoleId // Gán Role mặc định khi tạo Account
    });
    // --- KẾT THÚC SỬA ĐỔI ---

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
