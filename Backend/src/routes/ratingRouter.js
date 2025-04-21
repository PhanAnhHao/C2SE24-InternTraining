const express = require('express');
const router = express.Router();
const Rating = require('../models/Rating');
const Course = require('../models/Course');
const mongoose = require('mongoose');

// CREATE - Add a new rating
router.post('/', async (req, res) => {
  try {
    const newRating = new Rating(req.body);
    await newRating.save();
    res.status(201).json(newRating);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ ALL - Get all ratings
router.get('/', async (req, res) => {
  try {
    const ratings = await Rating.find()
      .populate('studentId', 'idStudent')
      .populate('courseId', 'idCourse infor');
    res.json(ratings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ BY ID - Get a specific rating
router.get('/:id', async (req, res) => {
  try {
    const rating = await Rating.findById(req.params.id)
      .populate('studentId', 'idStudent')
      .populate('courseId', 'idCourse infor');
    
    if (!rating) return res.status(404).json({ message: 'Rating not found' });
    res.json(rating);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ BY COURSE - Get all ratings for a specific course
router.get('/course/:courseId', async (req, res) => {
  try {
    const courseId = req.params.courseId;
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ error: 'Invalid course ID format' });
    }

    const ratings = await Rating.find({ courseId })
      .populate('studentId', 'idStudent')
      .sort({ createdAt: -1 });
    
    // Calculate average rating
    const totalRatings = ratings.length;
    const sum = ratings.reduce((acc, curr) => acc + curr.stars, 0);
    const averageRating = totalRatings > 0 ? (sum / totalRatings).toFixed(1) : 0;
    
    res.json({
      ratings,
      totalRatings,
      averageRating: parseFloat(averageRating)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ BY STUDENT - Get all ratings by a specific student
router.get('/student/:studentId', async (req, res) => {
  try {
    const studentId = req.params.studentId;
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ error: 'Invalid student ID format' });
    }

    const ratings = await Rating.find({ studentId })
      .populate('courseId', 'idCourse infor')
      .sort({ createdAt: -1 });
    
    res.json(ratings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE - Update a rating
router.put('/:id', async (req, res) => {
  try {
    const updated = await Rating.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Rating not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE - Delete a rating
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Rating.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Rating not found' });
    res.json({ message: 'Rating deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 