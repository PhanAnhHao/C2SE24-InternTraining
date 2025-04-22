const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const mongoose = require('mongoose');

// CREATE
router.post('/', async (req, res) => {
  try {
    const { idCourse, infor, languageID } = req.body;

    if (!idCourse || !infor || !languageID) {
      return res.status(400).json({ error: 'idCourse, infor, and languageID are required' });
    }

    const newCourse = new Course({ idCourse, infor, languageID });
    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ all
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find()
      .populate('languageID', 'languageId name')
      .populate({
        path: 'ratings',
        select: 'stars feedback',
        options: { limit: 5 }
      });

    // Format response with ratings summary
    const formattedCourses = courses.map(course => {
      const courseObj = course.toObject();
      
      // Calculate average rating
      let avgRating = 0;
      if (courseObj.ratings && courseObj.ratings.length > 0) {
        const sum = courseObj.ratings.reduce((acc, rating) => acc + rating.stars, 0);
        // Calculate precise average and convert to number with 1 decimal place
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

// READ by ID
router.get('/:id', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  try {
    const course = await Course.findById(req.params.id)
      .populate('languageID', 'languageId name')
      .populate({
        path: 'ratings',
        populate: {
          path: 'studentId',
          select: 'idStudent -_id'
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

module.exports = router;
