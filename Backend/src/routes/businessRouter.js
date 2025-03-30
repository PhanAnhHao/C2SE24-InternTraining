const express = require('express');
const router = express.Router();
const Business = require('../models/Business');

// CREATE
router.post('/', async (req, res) => {
  try {
    const newBusiness = new Business(req.body);
    await newBusiness.save();
    res.status(201).json(newBusiness);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ all
router.get('/', async (req, res) => {
  try {
    const businesses = await Business.find().populate('userId');
    res.json(businesses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ by ID
router.get('/:id', async (req, res) => {
  try {
    const business = await Business.findById(req.params.id).populate('userId');
    if (!business) return res.status(404).json({ message: 'Business not found' });
    res.json(business);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
router.put('/:id', async (req, res) => {
  try {
    const updated = await Business.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Business not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Business.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Business not found' });
    res.json({ message: 'Business deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
