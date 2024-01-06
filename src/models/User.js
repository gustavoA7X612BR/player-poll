const mongoose = require('../db');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'name field is missing'],
  },
  email: {
    type: String,
    unique: [true, 'email already registred'],
    required: [true, 'email field is missing'],
    lowercase: true,
    trim: true,
    validate: {
      validator: function (email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: '{email} is not valid!',
    },
  },
  birthDate: {
    type: Date,
    required: [true, 'birth date field is missing'],
  },
  password: {
    type: String,
    select: false,
    required: [true, 'password is missing'],
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

function encryptUserPassword(next) {
  this.password = bcrypt.hash(this.password, 10);
  next();
}

UserSchema.pre('save', encryptUserPassword);

const User = mongoose.model('Users', UserSchema);
module.exports = User;
