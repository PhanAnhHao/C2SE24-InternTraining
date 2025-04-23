const express = require('express');
const router = express.Router();
const History = require('../models/History');
const Test = require('../models/Test');
const Answer = require('../models/Answer');
const Question = require('../models/Question');
const mongoose = require('mongoose');

// CREATE - Save test result to history
router.post('/', async (req, res) => {
  try {
    const { studentId, testId } = req.body;
    
    // Validate required fields
    if (!studentId || !testId) {
      return res.status(400).json({ error: 'Student ID and Test ID are required' });
    }
    
    // Validate IDs
    if (!mongoose.Types.ObjectId.isValid(studentId) || !mongoose.Types.ObjectId.isValid(testId)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }
    
    // Get the test with its questions
    const test = await Test.findById(testId);
    if (!test) {
      return res.status(404).json({ error: 'Test not found' });
    }
    
    // Get all answers from this student for this test's questions
    const answers = await Answer.find({
      userId: studentId,
      questionId: { $in: test.idQuestion }
    });
    
    // Calculate score
    const totalQuestions = test.idQuestion.length;
    const correctAnswers = answers.filter(answer => answer.isCorrect).length;
    const score = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
    
    // Determine if passed (e.g., score >= 70%)
    const passThreshold = 70; // Can be configured as needed
    const passed = score >= passThreshold;
    
    // Create or update history entry
    const history = new History({
      studentId,
      testId,
      score,
      completedAt: new Date(),
      passed
    });
    
    await history.save();
    
    res.status(201).json({
      history,
      details: {
        totalQuestions,
        correctAnswers,
        score,
        passed
      }
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ ALL - Get all history entries
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

// READ BY ID - Get a specific history entry
router.get('/:id', async (req, res) => {
  try {
    const history = await History.findById(req.params.id)
      .populate('studentId', 'idStudent')
      .populate('testId', 'idTest content');
    
    if (!history) return res.status(404).json({ message: 'History not found' });
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

// READ BY TEST - Get all history entries for a specific test
router.get('/test/:testId', async (req, res) => {
  try {
    const testId = req.params.testId;
    if (!mongoose.Types.ObjectId.isValid(testId)) {
      return res.status(400).json({ error: 'Invalid test ID format' });
    }

    const histories = await History.find({ testId })
      .populate('studentId', 'idStudent')
      .sort({ completedAt: -1 });
    
    res.json(histories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE - Delete a history entry
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await History.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'History not found' });
    res.json({ message: 'History deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;