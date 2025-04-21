const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  idQuestion: {
    type: String,
    required: true,
    unique: true
  },
  content: {
    type: String,
    required: true
  },
  correct: {
    type: String,
    required: true
  },
  testId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test',
    required: true
  }
  // answer field removed - now managed through Answer collection
}, {
  timestamps: true
});

// Virtual property to get answers when needed
QuestionSchema.virtual('answers', {
  ref: 'Answer',
  localField: '_id',
  foreignField: 'questionId'
});

// Ensure the virtual field is included when converting to JSON
QuestionSchema.set('toJSON', { virtuals: true });
QuestionSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Question', QuestionSchema);
