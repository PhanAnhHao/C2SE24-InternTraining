const express = require('express');
const router = express.Router();
const History = require('../models/History');
const Test = require('../models/Test');
const Question = require('../models/Question');
const Lesson = require('../models/Lesson');
const Course = require('../models/Course');
const mongoose = require('mongoose');

// CREATE - Save test result to history
router.post('/', async (req, res) => {
  try {
    console.log('History POST request body:', req.body);
    const { studentId, testId, score, passed } = req.body;

    // Validate required fields
    if (!studentId || !testId) {
      console.log('Missing studentId or testId:', { studentId, testId });
      return res.status(400).json({ error: 'Student ID and Test ID are required' });
    }
    
    // Validate IDs
    if (!mongoose.Types.ObjectId.isValid(studentId) || !mongoose.Types.ObjectId.isValid(testId)) {
      console.log('Invalid ID format:', { studentId, testId });
      return res.status(400).json({ error: 'Invalid ID format' });
    }
    
    // Validate score is in the range 0-10
    if (score === undefined || score === null) {
      console.log('Score is missing');
      return res.status(400).json({ error: 'Score is required' });
    }
      // Convert score to number if it's a string
    let scoreNum = typeof score === 'string' ? parseFloat(score) : score;
    
    // Fix for scores coming in with decimal points but representing correct answers out of total
    // For example, 5.33 might mean 5 correct out of some number of questions
    if (scoreNum > 10) {
      console.log('Normalizing out-of-range score:', score);
      // Round to nearest integer if it seems like it might be a fraction or percentage
      scoreNum = Math.round(scoreNum > 100 ? (scoreNum / 100) * 10 : Math.min(10, scoreNum / 10));
      console.log('Normalized score:', scoreNum);
    } else if (scoreNum < 0) {
      scoreNum = 0; // Ensure minimum score is 0
    }
    
    // Final validation to ensure score is within range
    if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > 10) {
      console.log('Score still invalid after normalization:', scoreNum);
      return res.status(400).json({ error: 'Score must be a number between 0 and 10' });
    }
    
    // Validate passed field
    if (passed === undefined || passed === null) {
      console.log('Passed field is missing');
      return res.status(400).json({ error: 'Passed field is required' });
    }    // Create or update history entry
    const history = new History({
      studentId,
      testId,
      score: scoreNum, // Use the converted score
      completedAt: new Date(),
      passed: typeof passed === 'string' ? (passed.toLowerCase() === 'true') : !!passed // Ensure boolean
    });

    await history.save();

    res.status(201).json({
      history,
      details: {
        score,
        passed
      }
    });  } catch (err) {
    console.error('Error in history POST:', err);
    if (err.name === 'ValidationError') {
      // Extract MongoDB validation error messages
      const validationErrors = Object.values(err.errors).map(error => error.message);
      return res.status(400).json({ error: 'Validation Error', details: validationErrors });
    }
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

// THÊM ROUTE MỚI: Lấy lịch sử kết quả test của tất cả học sinh theo courseId
router.get('/course/:courseId', async (req, res) => {
  try {
    const { courseId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ error: 'Invalid course ID format' });
    }

    // Kiểm tra course có tồn tại không
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Get all lessons for this course
    const lessons = await Lesson.find({ idCourse: courseId });
    
    // Get all tests associated with these lessons
    const testIds = lessons.map(lesson => lesson.idTest).filter(id => id);
    
    // Get all test histories for these tests
    const testHistories = await History.find({ 
      testId: { $in: testIds }
    }).populate('studentId').populate('testId');

    const response = {
      courseId,
      courseName: course.infor,
      test: lessons,  // Include all lessons with their tests
      testResults: testHistories.map(history => ({
        _id: history._id,
        studentId: history.studentId._id,
        testId: history.testId._id,
        score: history.score,
        completedAt: history.completedAt,
        passed: history.passed,
        __v: history.__v,
        createdAt: history.createdAt,
        updatedAt: history.updatedAt
      }))
    };

    res.json(response);
  } catch (err) {
    console.error('Error fetching course test history:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;