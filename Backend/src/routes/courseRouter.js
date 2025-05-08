const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const StudentLessonProgress = require('../models/StudentLessonProgress');
const mongoose = require('mongoose');

// CREATE
router.post('/', async (req, res) => {
  try {
    const { idCourse, infor, languageID, businessId } = req.body;

    if (!idCourse || !infor || !languageID || !businessId) {
      return res.status(400).json({ error: 'idCourse, infor, languageID, and businessId are required' });
    }

    // Kiểm tra businessId có hợp lệ không
    if (!mongoose.Types.ObjectId.isValid(businessId)) {
      return res.status(400).json({ error: 'Invalid businessId format' });
    }

    const businessExists = await mongoose.model('Business').findById(businessId);
    if (!businessExists) {
      return res.status(404).json({ error: 'Business not found' });
    }

    const newCourse = new Course({ idCourse, infor, languageID, businessId });
    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ all
router.get('/', async (req, res) => {
  try {
    // Thêm filter theo businessId nếu có
    const filter = {};
    
    // Nếu có query parameter businessId thì thêm vào filter
    if (req.query.businessId) {
      filter.businessId = req.query.businessId;
    }
    
    const courses = await Course.find(filter)
      .populate('languageID', 'languageId name')
      .populate('businessId', 'idBusiness type detail')
      .populate('creator', 'userName')
      .populate({
        path: 'ratings',
        populate: {
          path: 'studentId',
          select: 'idStudent userId',
          populate: {
            path: 'userId',
            select: 'userName'
          }
        }
      });
    
    // Format response with ratings summary for each course
    const formattedCourses = courses.map(course => {
      const courseObj = course.toObject();
      let avgRating = 0;
      
      if (courseObj.ratings && courseObj.ratings.length > 0) {
        const sum = courseObj.ratings.reduce((acc, rating) => acc + rating.stars, 0);
        avgRating = parseFloat((sum / courseObj.ratings.length).toFixed(1));
      }
      
      return {
        ...courseObj,
        avgRating: avgRating,
        ratingsCount: courseObj.ratings ? courseObj.ratings.length : 0
      };
    });
    
    res.json(formattedCourses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ by ID with optional student progress
router.get('/:id', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  try {
    const { studentId } = req.query;
    
    const course = await Course.findById(req.params.id)
      .populate('languageID', 'languageId name')
      .populate('creator', 'userName')
      .populate({
        path: 'ratings',
        populate: {
          path: 'studentId',
          select: 'idStudent userId',
          populate: {
            path: 'userId',
            select: 'userName'
          }
        }
      });
    
    if (!course) return res.status(404).json({ message: 'Course not found' });
    
    // Format response with ratings summary
    const courseObj = course.toObject();
    let avgRating = 0;
    
    if (courseObj.ratings && courseObj.ratings.length > 0) {
      const sum = courseObj.ratings.reduce((acc, rating) => acc + rating.stars, 0);
      // Calculate precise average and convert to number with 1 decimal place
      avgRating = parseFloat((sum / courseObj.ratings.length).toFixed(1));
    }
    
    const formattedCourse = {
      ...courseObj,
      avgRating: avgRating,
      ratingsCount: courseObj.ratings ? courseObj.ratings.length : 0
    };
    
    // If studentId is provided, add progress information
    if (studentId && mongoose.Types.ObjectId.isValid(studentId)) {
      // Find all lessons for this course
      const lessons = await Lesson.find({ idCourse: course._id });
      
      if (lessons.length > 0) {
        const lessonIds = lessons.map(lesson => lesson._id);
        
        // Find progress records for these lessons
        const progressRecords = await StudentLessonProgress.find({
          studentId, 
          lessonId: { $in: lessonIds }
        });
        
        // Calculate progress statistics
        const totalLessons = lessons.length;
        const completedLessons = progressRecords.filter(record => record.status === 'completed').length;
        const inProgressLessons = progressRecords.filter(record => record.status === 'in_progress').length;
        const notStartedLessons = totalLessons - completedLessons - inProgressLessons;
        
        // Calculate overall progress percentage
        let overallProgress = 0;
        if (totalLessons > 0) {
          overallProgress = (
            (completedLessons * 100) + 
            progressRecords
              .filter(record => record.status === 'in_progress')
              .reduce((sum, record) => sum + record.progress, 0)
          ) / totalLessons;
        }
        
        // Add progress information to the response
        formattedCourse.progress = {
          totalLessons,
          completedLessons,
          inProgressLessons,
          notStartedLessons,
          overallProgress: Math.round(overallProgress),
          lastAccessedAt: progressRecords.length > 0 
            ? progressRecords.sort((a, b) => 
                new Date(b.lastAccessedAt) - new Date(a.lastAccessedAt)
              )[0].lastAccessedAt 
            : null
        };
      } else {
        formattedCourse.progress = {
          totalLessons: 0,
          completedLessons: 0,
          inProgressLessons: 0,
          notStartedLessons: 0,
          overallProgress: 0,
          lastAccessedAt: null
        };
      }
    }
    
    res.json(formattedCourse);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
router.put('/:id', async (req, res) => {
  try {
    // Remove rating from the request body since it's now virtual
    const { rating, ...updateData } = req.body;
    
    const updated = await Course.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updated) return res.status(404).json({ message: 'Course not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Course.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Course not found' });
    res.json({ message: 'Course deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ courses by business ID
router.get('/business/:businessId', async (req, res) => {
  try {
    const { businessId } = req.params;
    const { studentId } = req.query;
    
    if (!mongoose.Types.ObjectId.isValid(businessId)) {
      return res.status(400).json({ error: 'Invalid business ID format' });
    }
    
    // Kiểm tra business có tồn tại
    const business = await mongoose.model('Business').findById(businessId);
    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }
    
    const courses = await Course.find({ businessId })
      .populate('languageID', 'languageId name')
      .populate('businessId', 'idBusiness type detail')
      .populate('creator', 'userName')
      .populate({
        path: 'ratings',
        populate: {
          path: 'studentId',
          select: 'idStudent userId',
          populate: {
            path: 'userId',
            select: 'userName'
          }
        }
      });
    
    // Nếu không tìm thấy khóa học nào
    if (courses.length === 0) {
      return res.json({
        message: 'No courses found for this business',
        business: {
          id: business._id,
          idBusiness: business.idBusiness,
          type: business.type,
          detail: business.detail
        },
        courses: []
      });
    }
    
    // Format response with ratings summary
    const formattedCourses = await Promise.all(courses.map(async course => {
      const courseObj = course.toObject();
      let avgRating = 0;
      
      if (courseObj.ratings && courseObj.ratings.length > 0) {
        const sum = courseObj.ratings.reduce((acc, rating) => acc + rating.stars, 0);
        avgRating = parseFloat((sum / courseObj.ratings.length).toFixed(1));
      }
      
      const result = {
        ...courseObj,
        avgRating: avgRating,
        ratingsCount: courseObj.ratings ? courseObj.ratings.length : 0
      };
      
      // If studentId is provided, add progress information
      if (studentId && mongoose.Types.ObjectId.isValid(studentId)) {
        // Find all lessons for this course
        const lessons = await Lesson.find({ idCourse: course._id });
        
        if (lessons.length > 0) {
          const lessonIds = lessons.map(lesson => lesson._id);
          
          // Find progress records for these lessons
          const progressRecords = await StudentLessonProgress.find({
            studentId, 
            lessonId: { $in: lessonIds }
          });
          
          // Calculate progress statistics
          const totalLessons = lessons.length;
          const completedLessons = progressRecords.filter(record => record.status === 'completed').length;
          const inProgressLessons = progressRecords.filter(record => record.status === 'in_progress').length;
          const notStartedLessons = totalLessons - completedLessons - inProgressLessons;
          
          // Calculate overall progress percentage
          let overallProgress = 0;
          if (totalLessons > 0) {
            overallProgress = (
              (completedLessons * 100) + 
              progressRecords
                .filter(record => record.status === 'in_progress')
                .reduce((sum, record) => sum + record.progress, 0)
            ) / totalLessons;
          }
          
          // Add progress information to the response
          result.progress = {
            totalLessons,
            completedLessons,
            inProgressLessons,
            notStartedLessons,
            overallProgress: Math.round(overallProgress),
            lastAccessedAt: progressRecords.length > 0 
              ? progressRecords.sort((a, b) => 
                  new Date(b.lastAccessedAt) - new Date(a.lastAccessedAt)
                )[0].lastAccessedAt 
              : null
          };
        } else {
          result.progress = {
            totalLessons: 0,
            completedLessons: 0,
            inProgressLessons: 0,
            notStartedLessons: 0,
            overallProgress: 0,
            lastAccessedAt: null
          };
        }
      }
      
      return result;
    }));
    
    res.json({
      message: `Found ${courses.length} courses for business ${business.idBusiness}`,
      business: {
        id: business._id,
        idBusiness: business.idBusiness,
        type: business.type,
        detail: business.detail
      },
      courses: formattedCourses
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
