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

    const test = await Lesson.find({ idCourse: courseId });

    // Tìm tất cả các lessons thuộc về course này
    const lessons = await Lesson.find({ idCourse: courseId });
    if (lessons.length === 0) {
      return res.json({
        courseId,
        courseName: course.infor,
        test,
        message: 'No lessons found for this course',
        testResults: []
      });
    }

    // Lấy tất cả các tests từ các lessons này
    const lessonIds = lessons.map(lesson => lesson._id);
    const tests = await Test.find({ idLesson: { $in: lessonIds } });

    if (tests.length === 0) {
      return res.json({
        courseId,
        courseName: course.infor,
        test,
        message: 'No tests found for this course',
        testResults: []
      });
    }

    const testIds = tests.map(test => test._id);

    // Lấy tất cả lịch sử kiểm tra cho các tests này
    const testHistories = await History.find({ testId: { $in: testIds } })
      .populate({
        path: 'studentId',
        select: 'idStudent',
        populate: {
          path: 'userId',
          select: 'userName'
        }
      })
      .populate({
        path: 'testId'
      });

    // Tạo map để lưu trữ thông tin test và lesson để tham chiếu
    const testMap = {};
    for (const test of tests) {
      testMap[test._id.toString()] = test;
    }

    const lessonMap = {};
    for (const lesson of lessons) {
      lessonMap[lesson._id.toString()] = lesson;
    }

    // Tổng hợp dữ liệu
    const results = {
      courseId: course._id,
      courseName: course.infor,
      totalStudents: new Set(testHistories.map(h => h.studentId._id.toString())).size,
      totalTests: tests.length,
      totalResults: testHistories.length,
      averageScore: testHistories.length > 0
        ? (testHistories.reduce((sum, h) => sum + h.score, 0) / testHistories.length).toFixed(2)
        : 0,
      passRate: testHistories.length > 0
        ? ((testHistories.filter(h => h.passed).length / testHistories.length) * 100).toFixed(2)
        : 0,
      testResults: testHistories.map(history => {
        const test = testMap[history.testId._id.toString()];
        const lesson = test && test.idLesson ? lessonMap[test.idLesson.toString()] : null;

        return {
          id: history._id,
          student: {
            id: history.studentId._id,
            idStudent: history.studentId.idStudent,
            name: history.studentId.userId ? history.studentId.userId.userName : 'Unknown'
          },
          test: {
            id: history.testId._id,
            idTest: test ? test.idTest : 'Unknown',
            content: test ? test.content : 'Unknown',
            lesson: lesson ? {
              id: lesson._id,
              idLesson: lesson.idLesson,
              name: lesson.name
            } : null
          },
          score: history.score,
          passed: history.passed,
          completedAt: history.completedAt
        };
      })
    };

    res.json(results);
  } catch (err) {
    console.error('Error fetching course test history:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;