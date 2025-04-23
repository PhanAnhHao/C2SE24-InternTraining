const mongoose = require('mongoose');

const BusinessSchema = new mongoose.Schema({
  idBusiness: {
    type: String,
    required: true,
    unique: true,
    default: function() {
      // Generate a unique ID with 'B' prefix and a timestamp
      return 'B' + Date.now().toString().slice(-6);
    }
  },
  type: {
    type: String,
    required: true,
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

// Pre-save middleware to ensure idBusiness is always set
BusinessSchema.pre('save', function(next) {
  if (!this.idBusiness) {
    this.idBusiness = 'B' + Date.now().toString().slice(-6);
  }
  next();
});

module.exports = mongoose.model('Business', BusinessSchema);
