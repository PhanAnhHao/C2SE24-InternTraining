const express = require('express');
const router = express.Router();
const Answer = require('../models/Answer');
const mongoose = require('mongoose');

// CREATE - Submit an answer
router.post('/', async (req, res) => {
  try {
    const newAnswer = new Answer(req.body);
    await newAnswer.save();
    res.status(201).json(newAnswer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ ALL - Get all answers
router.get('/', async (req, res) => {
  try {
    const answers = await Answer.find()
      .populate('userId', 'userName')
      .populate('questionId', 'content correct');
    res.json(answers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ BY ID - Get a specific answer
router.get('/:id', async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id)
      .populate('userId', 'userName')
      .populate('questionId', 'content correct');
    
    if (!answer) return res.status(404).json({ message: 'Answer not found' });
    res.json(answer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ BY USER - Get all answers for a specific user
router.get('/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }

    const answers = await Answer.find({ userId })
      .populate('questionId', 'content correct')
      .sort({ createdAt: -1 });
    
    res.json(answers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ BY QUESTION - Get all answers for a specific question
router.get('/question/:questionId', async (req, res) => {
  try {
    const questionId = req.params.questionId;
    if (!mongoose.Types.ObjectId.isValid(questionId)) {
      return res.status(400).json({ error: 'Invalid question ID format' });
    }

    const answers = await Answer.find({ questionId })
      .populate('userId', 'userName')
      .sort({ createdAt: -1 });
    
    res.json(answers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE - Update an answer
router.put('/:id', async (req, res) => {
  try {
    const updated = await Answer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Answer not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE - Delete an answer
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Answer.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Answer not found' });
    res.json({ message: 'Answer deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 