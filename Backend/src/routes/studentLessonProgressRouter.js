const express = require('express');
const router = express.Router();
const StudentLessonProgress = require('../models/StudentLessonProgress');
const Student = require('../models/Student');
const Lesson = require('../models/Lesson');
const mongoose = require('mongoose');

// Get all progress records
router.get('/', async (req, res) => {
  try {
    const progressRecords = await StudentLessonProgress.find()
      .populate('studentId', 'idStudent')
      .populate({
        path: 'lessonId',
        select: 'idLesson name idCourse',
        populate: {
          path: 'idCourse',
          select: 'idCourse infor'
        }
      });
    res.json(progressRecords);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get progress records for a specific student
router.get('/student/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ error: 'Invalid student ID format' });
    }
    
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    const progressRecords = await StudentLessonProgress.find({ studentId })
      .populate({
        path: 'lessonId',
        select: 'idLesson name idCourse content linkVideo',
        populate: {
          path: 'idCourse',
          select: 'idCourse infor'
        }
      })
      .sort({ 'lastAccessedAt': -1 });
    
    res.json({
      student: {
        id: student._id,
        idStudent: student.idStudent
      },
      progressCount: progressRecords.length,
      progress: progressRecords
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get progress records for a specific lesson
router.get('/lesson/:lessonId', async (req, res) => {
  try {
    const { lessonId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(lessonId)) {
      return res.status(400).json({ error: 'Invalid lesson ID format' });
    }
    
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }
    
    const progressRecords = await StudentLessonProgress.find({ lessonId })
      .populate('studentId', 'idStudent')
      .sort({ 'lastAccessedAt': -1 });
    
    res.json({
      lesson: {
        id: lesson._id,
        idLesson: lesson.idLesson,
        name: lesson.name
      },
      studentCount: progressRecords.length,
      progress: progressRecords
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get one specific progress record
router.get('/:studentId/:lessonId', async (req, res) => {
  try {
    const { studentId, lessonId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(studentId) || !mongoose.Types.ObjectId.isValid(lessonId)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }
    
    const progressRecord = await StudentLessonProgress.findOne({ 
      studentId, 
      lessonId 
    })
      .populate('studentId', 'idStudent')
      .populate({
        path: 'lessonId',
        select: 'idLesson name content linkVideo',
        populate: {
          path: 'idCourse',
          select: 'idCourse infor'
        }
      });
    
    if (!progressRecord) {
      return res.status(404).json({ 
        message: 'No progress record found',
        data: {
          studentId,
          lessonId,
          status: 'not_started'
        }
      });
    }
    
    res.json(progressRecord);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create or update progress record
router.post('/', async (req, res) => {
  try {
    const { studentId, lessonId, status, progress, watchTime, notes } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(studentId) || !mongoose.Types.ObjectId.isValid(lessonId)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }
    
    // Check if student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    // Check if lesson exists
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }
    
    // Prepare update data
    const updateData = {
      lastAccessedAt: new Date()
    };
    
    if (status) updateData.status = status;
    if (progress !== undefined) updateData.progress = progress;
    if (watchTime !== undefined) updateData.watchTime = watchTime;
    if (notes) updateData.notes = notes;
    
    // Set dates based on status
    if (status === 'in_progress' && !await StudentLessonProgress.findOne({ studentId, lessonId })) {
      updateData.startedAt = new Date();
    }
    
    if (status === 'completed') {
      updateData.completedAt = new Date();
      updateData.progress = 100;
    }
    
    // Create or update the progress record
    const progressRecord = await StudentLessonProgress.findOneAndUpdate(
      { studentId, lessonId },
      { $set: updateData },
      { new: true, upsert: true }
    );
    
    res.json(progressRecord);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
});

// Delete a progress record
router.delete('/:studentId/:lessonId', async (req, res) => {
  try {
    const { studentId, lessonId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(studentId) || !mongoose.Types.ObjectId.isValid(lessonId)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }
    
    const result = await StudentLessonProgress.findOneAndDelete({ studentId, lessonId });
    
    if (!result) {
      return res.status(404).json({ error: 'Progress record not found' });
    }
    
    res.json({ message: 'Progress record deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get overall progress for a student across all courses and lessons
router.get('/student/:studentId/overview', async (req, res) => {
  try {
    const { studentId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ error: 'Invalid student ID format' });
    }
    
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    // Get all lessons the student has progress on
    const progressRecords = await StudentLessonProgress.find({ studentId })
      .populate({
        path: 'lessonId',
        select: 'idLesson name idCourse',
        populate: {
          path: 'idCourse',
          select: 'idCourse infor'
        }
      });
    
    // Group progress by course
    const courseProgress = {};
    let totalLessons = 0;
    let completedLessons = 0;
    let inProgressLessons = 0;
    
    progressRecords.forEach(record => {
      const courseId = record.lessonId.idCourse._id.toString();
      const courseName = record.lessonId.idCourse.infor;
      
      if (!courseProgress[courseId]) {
        courseProgress[courseId] = {
          courseId,
          courseName,
          totalLessons: 0,
          completedLessons: 0,
          inProgressLessons: 0,
          notStartedLessons: 0,
          overallProgress: 0,
          lessons: []
        };
      }
      
      courseProgress[courseId].totalLessons++;
      
      if (record.status === 'completed') {
        courseProgress[courseId].completedLessons++;
        completedLessons++;
      } else if (record.status === 'in_progress') {
        courseProgress[courseId].inProgressLessons++;
        inProgressLessons++;
      } else {
        courseProgress[courseId].notStartedLessons++;
      }
      
      totalLessons++;
      
      courseProgress[courseId].lessons.push({
        lessonId: record.lessonId._id,
        lessonName: record.lessonId.name,
        status: record.status,
        progress: record.progress,
        lastAccessed: record.lastAccessedAt
      });
      
      // Calculate overall progress for this course
      courseProgress[courseId].overallProgress = (
        (courseProgress[courseId].completedLessons * 100) + 
        courseProgress[courseId].lessons.reduce((sum, lesson) => {
          if (lesson.status === 'in_progress') {
            return sum + lesson.progress;
          }
          return sum;
        }, 0)
      ) / courseProgress[courseId].totalLessons;
    });
    
    const overallProgress = totalLessons 
      ? ((completedLessons * 100) + progressRecords
          .filter(record => record.status === 'in_progress')
          .reduce((sum, record) => sum + record.progress, 0)) / totalLessons
      : 0;
    
    res.json({
      student: {
        id: student._id,
        idStudent: student.idStudent
      },
      overallProgress: Math.round(overallProgress),
      totalLessons,
      completedLessons,
      inProgressLessons,
      notStartedLessons: totalLessons - completedLessons - inProgressLessons,
      courses: Object.values(courseProgress).map(course => ({
        ...course,
        overallProgress: Math.round(course.overallProgress)
      }))
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 