const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const mongoose = require('mongoose');

// CREATE
router.post('/', async (req, res) => {
  try {
    const { idCourse, infor, languageID, rating } = req.body;

    if (!idCourse || !infor || !languageID) {
      return res.status(400).json({ error: 'idCourse, infor, and languageID are required' });
    }

    const newCourse = new Course({ idCourse, infor, languageID, rating });
    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ all
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find().populate('languageID', 'languageId name');
    res.json(courses);
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
    const course = await Course.findById(req.params.id).populate('languageID', 'languageId name');
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
router.put('/:id', async (req, res) => {
  try {
    const updated = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
