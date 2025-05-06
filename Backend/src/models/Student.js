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
        ref: 'User', // Changed from 'Account' to 'User' to match seed data
        required: true,
        unique: true, // mỗi Student chỉ gắn với một User duy nhất
    }
}, {
    timestamps: true
});
module.exports = mongoose.model('Student', StudentSchema);
