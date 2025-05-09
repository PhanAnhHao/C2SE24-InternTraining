const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  location: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: 'default-avatar.jpg'
  },
  idAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true,
    unique: true // Mỗi account chỉ có 1 user profile
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema, 'users');
module.exports = User;
