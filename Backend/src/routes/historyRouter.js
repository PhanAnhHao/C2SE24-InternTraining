const express = require('express');
const router = express.Router();
const History = require('../models/History');
const mongoose = require('mongoose');

// CREATE - Add test history for a student
router.post('/', async (req, res) => {
  try {
    const newHistory = new History(req.body);
    await newHistory.save();
    res.status(201).json(newHistory);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ ALL - Get all test history records
router.get('/', async (req, res) => {
  try {
    const histories = await History.find()
      .populate('studentId', 'idStudent')
      .populate('testId', 'idTest content');
    res.json(histories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ BY ID - Get a specific history record
router.get('/:id', async (req, res) => {
  try {
    const history = await History.findById(req.params.id)
      .populate('studentId', 'idStudent')
      .populate('testId', 'idTest content');
    
    if (!history) return res.status(404).json({ message: 'History record not found' });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ BY STUDENT - Get all history for a specific student
router.get('/student/:studentId', async (req, res) => {
  try {
    const studentId = req.params.studentId;
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ error: 'Invalid student ID format' });
    }

    const histories = await History.find({ studentId })
      .populate('testId', 'idTest content')
      .sort({ completedAt: -1 });
    
    res.json(histories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE - Update a history record
router.put('/:id', async (req, res) => {
  try {
    const updated = await History.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'History record not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE - Delete a history record
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await History.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'History record not found' });
    res.json({ message: 'History record deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 