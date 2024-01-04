const mongoose = require('../db');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
  },
  birthDate: {
    type: Date,
    required: true,
  },
  password: {
    type: String,
    select: false,
    required: true,
  },
  passwordResetToken: {
    type: String,
    select: false,
  },
  passwordResetExpires: {
    type: Date,
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  polls: {
    type: [{ type: mongoose.Schema.Types.ObjectId }],
  },
});

const User = mongoose.model('Users', UserSchema);
module.exports = User;
