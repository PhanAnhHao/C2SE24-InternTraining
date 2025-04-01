const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  idCourse: {
    type: String,
    required: true,
    unique: true
  },
  infor: {
    type: String,
    required: true
  },
  languageID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Language',
    required: true
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Course', CourseSchema);
