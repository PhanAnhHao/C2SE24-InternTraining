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
    type: {
        type: [String],
        default: []
    },
    options: {
        type: [String],
        required: true,
        validate: [
            function(options) {
                return options.length >= 2; // At least 2 options required
            },
            'Multiple choice questions need at least 2 options'
        ]
    },
    correctAnswerIndex: {
        type: Number,
        required: true,
        min: 0,
        validate: [
            function(value) {
                return value < this.options.length;
            },
            'Correct answer index must be less than the number of options'
        ]
    },
    answer: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for answers - establishes relationship without storing in document
QuestionSchema.virtual('answers', {
    ref: 'Answer',
    localField: '_id',
    foreignField: 'questionId'
});

module.exports = mongoose.model('Question', QuestionSchema);
