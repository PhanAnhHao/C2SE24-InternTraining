const express = require('express');
const router = express.Router();
const Lesson = require('../models/Lesson');
const StudentLessonProgress = require('../models/StudentLessonProgress');
const mongoose = require('mongoose');

// CREATE
router.post('/', async (req, res) => {
  try {
    const newLesson = new Lesson(req.body);
    await newLesson.save();
    res.status(201).json(newLesson);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ all
router.get('/', async (req, res) => {
  try {
    const lessons = await Lesson.find()
      .populate('idCourse', 'idCourse')
      .populate('idTest', 'idTest');
    res.json(lessons);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ by ID with student progress (if student is provided)
router.get('/:id', async (req, res) => {
  try {
    const { studentId } = req.query;
    
    const lesson = await Lesson.findById(req.params.id)
      .populate('idCourse', 'idCourse infor')
      .populate('idTest', 'idTest content');
    
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });
    
    // If studentId is provided, fetch progress data
    if (studentId && mongoose.Types.ObjectId.isValid(studentId)) {
      const progress = await StudentLessonProgress.findOne({
        studentId,
        lessonId: lesson._id
      });
      
      // Return lesson with progress info
      return res.json({
        ...lesson.toObject(),
        progress: progress ? {
          status: progress.status,
          progress: progress.progress,
          startedAt: progress.startedAt,
          completedAt: progress.completedAt,
          lastAccessedAt: progress.lastAccessedAt,
          watchTime: progress.watchTime,
          notes: progress.notes
        } : {
          status: 'not_started',
          progress: 0
        }
      });
    }
    
    // Return lesson without progress info
    res.json(lesson);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
router.put('/:id', async (req, res) => {
  try {
    const updated = await Lesson.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Lesson not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Lesson.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Lesson not found' });
    res.json({ message: 'Lesson deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all lessons for a course with student progress
router.get('/course/:courseId', async (req, res) => {
  try {
    const { courseId } = req.params;
    const { studentId } = req.query;
    
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ error: 'Invalid course ID format' });
    }
    
    const lessons = await Lesson.find({ idCourse: courseId })
      .populate('idTest', 'idTest')
      .sort({ createdAt: 1 });
    
    if (lessons.length === 0) {
      return res.json({
        message: 'No lessons found for this course',
        courseId,
        lessons: []
      });
    }
    
    // If studentId is provided, fetch progress data for all lessons
    if (studentId && mongoose.Types.ObjectId.isValid(studentId)) {
      const lessonIds = lessons.map(lesson => lesson._id);
      
      const progressRecords = await StudentLessonProgress.find({
        studentId,
        lessonId: { $in: lessonIds }
      });
      
      // Create a map of progress records by lessonId
      const progressMap = {};
      progressRecords.forEach(record => {
        progressMap[record.lessonId.toString()] = {
          status: record.status,
          progress: record.progress,
          startedAt: record.startedAt,
          completedAt: record.completedAt,
          lastAccessedAt: record.lastAccessedAt,
          watchTime: record.watchTime
        };
      });
      
      // Add progress info to each lesson
      const lessonsWithProgress = lessons.map(lesson => {
        const lessonObj = lesson.toObject();
        const lessonId = lesson._id.toString();
        
        return {
          ...lessonObj,
          progress: progressMap[lessonId] || {
            status: 'not_started',
            progress: 0
          }
        };
      });
      
      return res.json({
        courseId,
        lessonsCount: lessons.length,
        lessons: lessonsWithProgress
      });
    }
    
    // Return lessons without progress info
    res.json({
      courseId,
      lessonsCount: lessons.length,
      lessons
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
