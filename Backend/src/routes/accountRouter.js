const express = require('express');
const router = express.Router();
const Account = require('../models/Account');
const Role = require('../models/Role');

// Route tạo tài khoản mới
router.post('/add-account', async (req, res) => {
  const { username, email, password, roleId } = req.body;

  try {
    // Kiểm tra xem roleId có hợp lệ không
    const role = await Role.findById(roleId);
    if (!role) {
      return res.status(400).json({ message: 'Role not found' });
    }

    // Tạo tài khoản mới với role liên kết
    const newAccount = new Account({
      username,
      email,
      password,
      role: role._id
    });

    // Lưu tài khoản vào cơ sở dữ liệu
    await newAccount.save();

    res.status(201).json({ message: 'Account created successfully', account: newAccount });
  } catch (err) {
    res.status(400).json({ message: 'Error creating account', error: err });
  }
});

// Route lấy danh sách các tài khoản
router.get('/all-accounts', async (req, res) => {
  try {
    const accounts = await Account.find().populate('role');  // Populate để lấy thông tin role
    res.json(accounts);
  } catch (err) {
    res.status(400).json({ message: 'Error fetching accounts', error: err });
  }
});

module.exports = router;
