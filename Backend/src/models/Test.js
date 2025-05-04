const mongoose = require('mongoose');

const TestSchema = new mongoose.Schema({
  idTest: {
    type: String,
    required: true,
  },
  idCourse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  idQuestion: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question'
  }],
}, {
  timestamps: true
});

module.exports = mongoose.model('Test', TestSchema);
