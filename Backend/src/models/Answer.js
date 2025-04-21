const mongoose = require('mongoose');

const AnswerSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isCorrect: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Unique compound index to prevent duplicate answers for the same question by the same student
AnswerSchema.index({ studentId: 1, questionId: 1, testId: 1 }, { unique: true });

module.exports = mongoose.model('Answer', AnswerSchema); 