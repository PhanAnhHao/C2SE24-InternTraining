const mongoose = require('mongoose');

const LanguageSchema = new mongoose.Schema({
  languageId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Language', LanguageSchema);
