const express = require('express');
const router = express.Router();
const Role = require('../models/Role');  // Nếu file là Role.js


// Route tạo mới một vai trò
router.post('/add-role', async (req, res) => {
  const { name, description } = req.body;

  try {
    const newRole = new Role({
      name,
      description
    });

    await newRole.save();
    res.status(201).json({ message: 'Role created successfully', role: newRole });
  } catch (err) {
    res.status(400).json({ message: 'Error creating role', error: err });
  }
});

module.exports = router;
