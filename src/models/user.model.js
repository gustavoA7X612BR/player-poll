const mongoose = require('../db');
const bcrypt = require('bcrypt');
const validateEmail = require('../utils/validateEmail');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Field is missing'],
    },
    email: {
      type: String,
      unique: [true, 'Email already registred'],
      required: [true, 'Field is missing'],
      lowercase: true,
      trim: true,
      validate: {
        validator: validateEmail,
        message: '{email} is not valid!',
      },
    },
    birthDate: {
      type: Date,
      required: [true, 'Field is missing'],
    },
    password: {
      type: String,
      select: false,
      required: [true, 'Field is missing'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    polls: {
      type: [{ type: mongoose.Schema.Types.ObjectId }],
    },
  },
  {
    timestamps: true,
  }
);

async function encryptUserPassword(next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(
    this.password,
    Number(process.env.BCRYPT_SALT)
  );
  next();
}

UserSchema.pre('save', encryptUserPassword);

const User = mongoose.model('Users', UserSchema);
module.exports = User;
