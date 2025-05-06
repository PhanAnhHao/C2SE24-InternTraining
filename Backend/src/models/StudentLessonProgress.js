const mongoose = require('mongoose');

const StudentLessonProgressSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: true
  },
  status: {
    type: String,
    enum: ['not_started', 'in_progress', 'completed'],
    default: 'not_started'
  },
  progress: {
    type: Number, // percentage of completion (0-100)
    default: 0,
    min: 0,
    max: 100
  },
  startedAt: {
    type: Date
  },
  completedAt: {
    type: Date
  },
  lastAccessedAt: {
    type: Date,
    default: Date.now
  },
  watchTime: {
    type: Number, // total watch time in seconds
    default: 0
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Create a compound index to ensure a student can only have one progress record per lesson
StudentLessonProgressSchema.index({ studentId: 1, lessonId: 1 }, { unique: true });

module.exports = mongoose.model('StudentLessonProgress', StudentLessonProgressSchema); 