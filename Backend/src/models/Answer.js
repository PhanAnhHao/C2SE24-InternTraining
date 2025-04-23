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
  selectedOptionIndex: {
    type: Number,
    required: true,
    min: 0
  },
  isCorrect: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Unique compound index to prevent duplicate answers for the same question by the same user
AnswerSchema.index({ userId: 1, questionId: 1 }, { unique: true });

module.exports = mongoose.model('Answer', AnswerSchema);