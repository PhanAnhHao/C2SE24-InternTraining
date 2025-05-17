const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true }, // Liên kết với bảng Role
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date }
}, { timestamps: true });

const Account = mongoose.model('Account', accountSchema, 'accounts'); // Collection là "accounts"
module.exports = Account;
