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

// Route lấy thông tin tài khoản theo ID
router.get('/account/:id', async (req, res) => {
  try {
    const account = await Account.findById(req.params.id).populate('role');
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }
    res.json(account);
  } catch (err) {
    res.status(400).json({ message: 'Error fetching account', error: err });
  }
});

// Route cập nhật tài khoản
router.put('/update-account/:id', async (req, res) => {
  try {
    const { username, email, password, roleId } = req.body;
    const updateData = {};
    
    // Chỉ cập nhật các trường được gửi lên
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (password) updateData.password = password;
    
    // Kiểm tra nếu có thay đổi roleId
    if (roleId) {
      const role = await Role.findById(roleId);
      if (!role) {
        return res.status(400).json({ message: 'Role not found' });
      }
      updateData.role = roleId;
    }
    
    // Tìm và cập nhật tài khoản
    const updatedAccount = await Account.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true, runValidators: true }
    ).populate('role');
    
    if (!updatedAccount) {
      return res.status(404).json({ message: 'Account not found' });
    }
    
    res.json({ message: 'Account updated successfully', account: updatedAccount });
  } catch (err) {
    res.status(400).json({ message: 'Error updating account', error: err });
  }
});

// Route xóa tài khoản
router.delete('/delete-account/:id', async (req, res) => {
  try {
    const deletedAccount = await Account.findByIdAndDelete(req.params.id);
    
    if (!deletedAccount) {
      return res.status(404).json({ message: 'Account not found' });
    }
    
    res.json({ message: 'Account deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Error deleting account', error: err });
  }
});

module.exports = router;
