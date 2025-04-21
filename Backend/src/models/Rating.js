const mongoose = require('mongoose');

const RatingSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  stars: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  feedback: {
    type: String,
    required: false,
    maxlength: 500
  }
}, {
  timestamps: true
});

// Unique compound index to prevent duplicate ratings for the same course by the same student
RatingSchema.index({ studentId: 1, courseId: 1 }, { unique: true });

module.exports = mongoose.model('Rating', RatingSchema); 