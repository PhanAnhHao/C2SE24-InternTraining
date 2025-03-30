const mongoose = require('mongoose');

const TestSchema = new mongoose.Schema({
  idTest: {
    type: String,
    required: true,
    unique: true
  },
  idLesson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  idQuestion: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Test', TestSchema);
