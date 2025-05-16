const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const StudentLessonProgress = require('../models/StudentLessonProgress');
const mongoose = require('mongoose');
const multer = require('multer');
const { bucket } = require('../configs/firebase');
const path = require('path');
const fs = require('fs');

// Configure multer with file filter for images
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    // Check if the file is an image
    if (file.mimetype.startsWith('image/')) {
      // Accept only common image formats
      if (
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/gif' ||
        file.mimetype === 'image/webp' ||
        file.mimetype === 'image/svg+xml'
      ) {
        cb(null, true);
      } else {
        cb(new Error('Only JPG, PNG, GIF, WebP, and SVG image formats are allowed'), false);
      }
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  }
});

// Custom middleware with error handling for image uploads
const imageUploadMiddleware = (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ 
        error: 'File upload error', 
        details: err.message 
      });
    } else if (err) {
      return res.status(400).json({ 
        error: 'Invalid file', 
        details: err.message 
      });
    }
    next();
  });
};

// CREATE with optional image upload
router.post('/', imageUploadMiddleware, async (req, res) => {
  try {
    const { idCourse, infor, languageID, businessId } = req.body;

    if (!idCourse || !infor || !languageID || !businessId) {
      return res.status(400).json({ error: 'idCourse, infor, languageID, and businessId are required' });
    }

    // Kiểm tra businessId có hợp lệ không
    if (!mongoose.Types.ObjectId.isValid(businessId)) {
      return res.status(400).json({ error: 'Invalid businessId format' });
    }

    // Get business with populated user data
    const businessExists = await mongoose.model('Business')
      .findById(businessId)
      .populate('userId', 'userName email location phone avatar cv');
      
    if (!businessExists) {
      return res.status(404).json({ error: 'Business not found' });
    }

    const newCourse = new Course({ 
      idCourse, 
      infor, 
      languageID, 
      businessId,
      image: 'default-course-image.jpg' // Default image
    });
    await newCourse.save();

    // Handle image upload if provided
    if (req.file) {
      try {
        const file = req.file;
        const filename = `courses/${newCourse._id}_${Date.now()}_${file.originalname}`;
        const blob = bucket.file(filename);
        const blobStream = blob.createWriteStream({
          metadata: { 
            contentType: file.mimetype,
            metadata: {
              fileType: file.mimetype.split('/')[1], // Extract format (jpeg, png, etc.)
              courseId: newCourse._id.toString(),
              businessId: businessId
            }
          }
        });
        
        // Return a promise that resolves when the upload is complete
        const uploadPromise = new Promise((resolve, reject) => {
          blobStream.on('error', (err) => reject(err));
          
          blobStream.on('finish', async () => {
            // Make the file publicly accessible
            await blob.makePublic();
            
            // Get the public URL
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;
            
            // Update the course with the image URL
            newCourse.image = publicUrl;
            await newCourse.save();
            
            resolve(publicUrl);
          });
        });
        
        // Complete the upload by sending the buffer to Firebase
        blobStream.end(file.buffer);
        
        // Wait for the upload to complete
        await uploadPromise;
      } catch (uploadError) {
        console.error('Error uploading image:', uploadError);
        // We continue even if image upload fails, as the course is already created
      }
    }

    // Return the created course with business and user info
    const courseWithBusiness = await Course.findById(newCourse._id)
      .populate('languageID', 'languageId name')
      .populate({
        path: 'businessId',
        populate: {
          path: 'userId',
          select: 'userName email location phone avatar cv'
        }
      });

    res.status(201).json(courseWithBusiness);
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
    }    const courses = await Course.find(filter)
      .populate('languageID', 'languageId name')
      .populate({
        path: 'businessId',
        select: 'idBusiness type detail userId',
        populate: {
          path: 'userId',
          select: 'userName email location phone avatar cv'
        }
      })
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
    const { studentId } = req.query;    const course = await Course.findById(req.params.id)
      .populate('languageID', 'languageId name')
      .populate({
        path: 'businessId',
        select: 'idBusiness type detail userId',
        populate: {
          path: 'userId',
          select: 'userName email location phone avatar cv'
        }
      })
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

// UPDATE with optional image upload
router.put('/:id', imageUploadMiddleware, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid course ID' });
    }

    // Find the course first to make sure it exists
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Remove rating from the request body since it's now virtual
    const { rating, ...updateData } = req.body;
    
    // Handle image upload if provided
    if (req.file) {
      try {
        const file = req.file;
        const filename = `courses/${course._id}_${Date.now()}_${file.originalname}`;
        const blob = bucket.file(filename);
        const blobStream = blob.createWriteStream({
          metadata: { 
            contentType: file.mimetype,
            metadata: {
              fileType: file.mimetype.split('/')[1], // Extract format (jpeg, png, etc.)
              courseId: course._id.toString(),
              businessId: course.businessId.toString(),
              operation: 'update'
            }
          }
        });
        
        // Return a promise that resolves when the upload is complete
        const uploadPromise = new Promise((resolve, reject) => {
          blobStream.on('error', (err) => reject(err));
          
          blobStream.on('finish', async () => {
            // Make the file publicly accessible
            await blob.makePublic();
            
            // Get the public URL
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;
            
            // Update the image field directly
            updateData.image = publicUrl;
            
            resolve();
          });
        });
        
        // Complete the upload by sending the buffer to Firebase
        blobStream.end(file.buffer);
        
        // Wait for the upload to complete
        await uploadPromise;
      } catch (uploadError) {
        console.error('Error uploading image:', uploadError);
        // Continue without updating the image if there was an error
      }
    }
    
    // Update the course with all data including potentially the new image URL
    const updated = await Course.findByIdAndUpdate(req.params.id, updateData, { new: true })
      .populate('languageID', 'languageId name')
      .populate({
        path: 'businessId',
        select: 'idBusiness type detail userId',
        populate: {
          path: 'userId',
          select: 'userName email location phone avatar cv'
        }
      })
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
    
    // Format response with ratings summary
    const courseObj = updated.toObject();
    let avgRating = 0;
    
    if (courseObj.ratings && courseObj.ratings.length > 0) {
      const sum = courseObj.ratings.reduce((acc, rating) => acc + rating.stars, 0);
      avgRating = parseFloat((sum / courseObj.ratings.length).toFixed(1));
    }
    
    const formattedCourse = {
      ...courseObj,
      avgRating: avgRating,
      ratingsCount: courseObj.ratings ? courseObj.ratings.length : 0
    };
    
    res.json(formattedCourse);
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

// UPDATE COURSE IMAGE ONLY - Update just the course's image
router.put('/:id/update-image', imageUploadMiddleware, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid course ID' });
    }
    
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }
    
    // Find the course
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    // Handle the image upload
    const file = req.file;
    const filename = `courses/${course._id}_${Date.now()}_${file.originalname}`;
    const blob = bucket.file(filename);
    const blobStream = blob.createWriteStream({
      metadata: { 
        contentType: file.mimetype,
        metadata: {
          fileType: file.mimetype.split('/')[1], // Extract format (jpeg, png, etc.)
          courseId: course._id.toString(),
          businessId: course.businessId.toString(),
          operation: 'update'
        }
      }
    });
    
    // Return a promise that resolves when the upload is complete
    const uploadPromise = new Promise((resolve, reject) => {
      blobStream.on('error', (err) => {
        console.error('Course image upload error:', err);
        reject(err);
      });
      
      blobStream.on('finish', async () => {
        try {
          // Make the file publicly accessible
          await blob.makePublic();
          
          // Get the public URL
          const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;
          
          // Update only the image field
          const updatedCourse = await Course.findByIdAndUpdate(
            req.params.id,
            { image: publicUrl },
            { new: true }
          ).populate('languageID', 'languageId name')
          .populate({
            path: 'businessId',
            select: 'idBusiness type detail userId',
            populate: {
              path: 'userId',
              select: 'userName email location phone avatar cv'
            }
          })
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
          
          // Format response with ratings summary
          const courseObj = updatedCourse.toObject();
          let avgRating = 0;
          
          if (courseObj.ratings && courseObj.ratings.length > 0) {
            const sum = courseObj.ratings.reduce((acc, rating) => acc + rating.stars, 0);
            avgRating = parseFloat((sum / courseObj.ratings.length).toFixed(1));
          }
          
          const formattedCourse = {
            ...courseObj,
            avgRating: avgRating,
            ratingsCount: courseObj.ratings ? courseObj.ratings.length : 0
          };
          
          resolve(formattedCourse);
        } catch (err) {
          reject(err);
        }
      });
    });
    
    // Complete the upload by sending the buffer to Firebase
    blobStream.end(file.buffer);
    
    // Wait for the upload to complete and return the result
    const result = await uploadPromise;
    res.json(result);
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
    }    const courses = await Course.find({ businessId })
      .populate('languageID', 'languageId name')
      .populate({
        path: 'businessId',
        select: 'idBusiness type detail userId',
        populate: {
          path: 'userId',
          select: 'userName email location phone avatar cv'
        }
      })
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
