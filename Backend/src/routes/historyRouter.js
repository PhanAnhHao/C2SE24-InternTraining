const express = require('express');
const router = express.Router();
const History = require('../models/History');
const Test = require('../models/Test');
const Answer = require('../models/Answer');
const Question = require('../models/Question');
const Lesson = require('../models/Lesson');
const Course = require('../models/Course');
const mongoose = require('mongoose');

// CREATE - Save test result to history
router.post('/', async (req, res) => {
  try {
    const { studentId, testId, score, passed } = req.body;

    // Validate required fields
    if (!studentId || !testId) {
      return res.status(400).json({ error: 'Student ID and Test ID are required' });
    }

    // Validate IDs
    if (!mongoose.Types.ObjectId.isValid(studentId) || !mongoose.Types.ObjectId.isValid(testId)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

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