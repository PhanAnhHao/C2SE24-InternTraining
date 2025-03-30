const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  idQuestion: {
    type: String,
    required: true,
    unique: true
  },
  idTest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test',
    required: true
  },
  question: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Question', QuestionSchema);
