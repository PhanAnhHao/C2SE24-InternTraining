const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    idStudent: {
        type: String,
        required: true,
        unique: true,
    },
    age: {
        type: Number,
        required: true,
    },
    school: {
        type: String,
        required: true,
    },
    course: {
        type: [String],
        default: [],
    },
    englishSkill: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced', 'Fluent'],
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account', // Changed from 'User' to 'Account'
        required: true,
        unique: true, // mỗi Student chỉ gắn với một Account duy nhất
    }
}, {
    timestamps: true
});
module.exports = mongoose.model('Student', StudentSchema);
