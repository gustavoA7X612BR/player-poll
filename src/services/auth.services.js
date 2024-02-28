const User = require('../models/user.model');
const Token = require('../models/token.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendPassowordResetEmail } = require('./email.services');
const ObjectId = require('mongoose').Types.ObjectId;

async function findUserByEmail(email) {
  const user = await User.findOne({ email });
  return user;
}

exports.createUser = async (name, email, birthDate, password) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error('Email already registred');

  const user = new User({ name, email, birthDate, password });
  await user.save();

  const token = jwt.sign({ id: user.id }, process.env.API_SECRET, {
    expiresIn: '1 day',
  });

  return {
    user,
    token,
  };
};

exports.loginUser = async (email, password) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) throw new Error('User not found');

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new Error('Invalid password');

  const token = jwt.sign({ id: user.id }, process.env.API_SECRET, {
    expiresIn: '1 day',
  });
  user.password = undefined;

  return {
    user,
    token,
  };
};

async function validateUserPassword(userId, password) {
  const user = await User.findById(userId).select('+password');

  if (!user) throw new Error('User not found!');

  const isPasswordValid = await bcrypt.compare(password, user.password);
  return isPasswordValid;
}

exports.removeUser = async (userId, password) => {
  const isPasswordValid = await validateUserPassword(userId, password);
  if (!isPasswordValid) throw new Error('Invalid password!');

  return await User.deleteOne({ _id: userId });
};

exports.requestPasswordToken = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('User not found');

  const existingToken = await Token.findOne({ userId: user._id });
  if (existingToken) await existingToken.deleteOne();

  const resetTokenValue = crypto.randomBytes(32).toString('hex');
  const resetTokenHash = await bcrypt.hash(resetTokenValue, bcryptSalt);

  const newToken = new Token({
    userId: user._id,
    value: resetTokenHash,
  });

  await newToken.save();
  await sendPassowordResetEmail(user._id, resetTokenValue, user.email);
};

exports.resetPasswordService = async (token, password, userID) => {
  if (!ObjectId.isValid(userId)) throw new Error('Invalid ID');

  const resetToken = await Token.findOne({ userId });
  if (!resetToken) throw new Error('Token invalid or expired!');

  const isValid = await bcrypt.compare(token, resetToken.value);
  if (!isValid) throw new Error('Invalid token!');

  const passwordHash = await bcrypt.hash(password, bcryptSalt);
  await User.updateOne(
    {
      _id: userId,
    },
    {
      $set: {
        password: passwordHash,
      },
    }
  );

  await resetToken.deleteOne();
};
