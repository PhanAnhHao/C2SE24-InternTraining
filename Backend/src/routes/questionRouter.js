const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const mongoose = require('mongoose');

// CREATE
router.post('/', async (req, res) => {
  try {
    // Validate the correctAnswerIndex is within range
    if (req.body.correctAnswerIndex >= req.body.options.length) {
      return res.status(400).json({ 
        error: 'Correct answer index must be less than the number of options' 
      });
    }
    
    // Set the answer field to the correct option text for backward compatibility
    req.body.answer = req.body.options[req.body.correctAnswerIndex];
    
    const newQuestion = new Question(req.body);
    await newQuestion.save();
    res.status(201).json(newQuestion);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ all
router.get('/', async (req, res) => {
  try {
    const questions = await Question.find()
      .populate('idTest', 'idTest')
      .populate({
        path: 'answers',
        select: 'content isCorrect userId selectedOptionIndex',
        populate: {
          path: 'userId',
          select: 'userName -_id'
        }
      });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ by ID
router.get('/:id', async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate('idTest', 'idTest')
      .populate({
        path: 'answers',
        select: 'content isCorrect userId selectedOptionIndex',
        populate: {
          path: 'userId',
          select: 'userName -_id'
        }
      });
    if (!question) return res.status(404).json({ message: 'Question not found' });
    res.json(question);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
router.put('/:id', async (req, res) => {
  try {
    // If updating options and correctAnswerIndex, validate
    if (req.body.options && req.body.correctAnswerIndex !== undefined) {
      if (req.body.correctAnswerIndex >= req.body.options.length) {
        return res.status(400).json({
          error: 'Correct answer index must be less than the number of options'
        });
      }
      // Update the answer field for backward compatibility
      req.body.answer = req.body.options[req.body.correctAnswerIndex];
    } 
    // If only updating correctAnswerIndex, need to fetch current options
    else if (req.body.correctAnswerIndex !== undefined) {
      const question = await Question.findById(req.params.id);
      if (req.body.correctAnswerIndex >= question.options.length) {
        return res.status(400).json({
          error: 'Correct answer index must be less than the number of options'
        });
      }
      req.body.answer = question.options[req.body.correctAnswerIndex];
    }
    
    const updated = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Question not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Question.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Question not found' });
    res.json({ message: 'Question deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
