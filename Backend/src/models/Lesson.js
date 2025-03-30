const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema({
  idLesson: {
    type: String,
    required: true,
    unique: true
  },
  idCourse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  content: {
    type: String
  },
  linkVideo: {
    type: String
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  idTest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Lesson', LessonSchema);
