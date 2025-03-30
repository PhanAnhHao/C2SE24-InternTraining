const mongoose = require('mongoose');

const BusinessSchema = new mongoose.Schema({
  idBusiness: {
    type: String,
    required: true,
    unique: true,
  },
  detail: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true, // Mỗi user chỉ có 1 business
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Business', BusinessSchema);
