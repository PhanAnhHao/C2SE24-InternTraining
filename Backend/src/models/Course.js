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
  },  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true
  }
}, {
  timestamps: true
});

// Add virtual property to get ratings
CourseSchema.virtual('ratings', {
  ref: 'Rating',
  localField: '_id',
  foreignField: 'courseId'
});

// Ensure virtual fields are included when converting to JSON or objects
CourseSchema.set('toJSON', { virtuals: true });
CourseSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Course', CourseSchema);
