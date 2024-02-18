const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

exports.findUser = async (email) => {
  const user = await User.findOne({ email });
  return user;
};

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
