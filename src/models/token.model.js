const mongoose = require('../db');

const TokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'userId field is missing'],
    ref: 'user',
  },
  value: {
    type: String,
    required: [true, 'no value for token'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: 3600,
  },
});

const Token = mongoose.model('Token', TokenSchema);
module.exports = Token;
