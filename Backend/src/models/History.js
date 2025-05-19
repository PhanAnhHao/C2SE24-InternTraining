const mongoose = require('mongoose');

const HistorySchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  testId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test',
    required: true
  },  score: {
    type: Number,
    required: true,
    min: 0,
    max: 10,
    set: function(value) {
      // Auto-normalize scores that are out of range (likely from frontend calculations)
      if (value > 10) {
        return Math.round(value > 100 ? (value / 100) * 10 : Math.min(10, value / 10));
      }
      return value;
    },
    validate: {
      validator: function(value) {
        return value >= 0 && value <= 10;
      },
      message: props => `${props.value} is not a valid score. Score must be between 0 and 10.`
    }
  },
  completedAt: {
    type: Date,
    default: Date.now
  },
  passed: {
    type: Boolean,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('History', HistorySchema); 