const express = require('express');
const router = express.Router();
const User = require('../models/User');
const mongoose = require('mongoose');

// CREATE user profile (nếu cần)
router.post('/', async (req, res) => {
  try {
    const { userName, email, location, phone, idAccount } = req.body;

    const existing = await User.findOne({ idAccount });
    if (existing) return res.status(400).json({ error: 'User profile already exists' });

    const newUser = new User({ userName, email, location, phone, idAccount });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().populate('idAccount', 'username');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('idAccount', 'username');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE user
router.put('/:id', async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'User not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE user
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
