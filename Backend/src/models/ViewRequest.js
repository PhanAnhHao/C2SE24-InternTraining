const mongoose = require('mongoose');

const viewRequestSchema = new mongoose.Schema({
    business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    status: { 
        type: String, 
        enum: ['pending', 'approved', 'rejected'], 
        default: 'pending' 
    },
    requestToken: { type: String, required: true }, // Token for student to approve/reject
    accessToken: { type: String }, // Token for business to view info (only set when approved)
    expiresAt: { type: Date }, // Expiration time for accessToken
    createdAt: { type: Date, default: Date.now },
});

const ViewRequest = mongoose.model('ViewRequest', viewRequestSchema);
module.exports = ViewRequest; 