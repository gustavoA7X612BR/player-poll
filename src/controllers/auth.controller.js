const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const Token = require('../models/token.model');
const crypto = require('crypto');
const emailTransporter = require('../modules/nodemailer');

const getHBSTemplateFromFile = require('../modules/handlebars');
const bcryptSalt = Number(process.env.BCRYPT_SALT);
const ObjectId = require('mongoose').Types.ObjectId;

const { createUser, findUser } = require('../services/auth.service');

exports.signup = async (req, res) => {
  const { name, email, birthDate, password } = req.body;

  if (!name) return res.status(400).send({ message: 'Name not provided!' });

  if (!email) return res.status(400).send({ message: 'Email not provided!' });

  if (!birthDate)
    return res.status(400).send({ message: 'BirthDate not provided!' });

  if (!password)
    return res.status(400).send({ message: 'Password not provided!' });

  const data = await createUser({ name, email, birthDate, password });

  return res
    .status(200)
    .send({ message: 'User registred successfully', ...data });
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email) return res.status(400).send({ message: 'email not provided' });
  if (!password)
    return res.status(400).send({ message: 'password not provided' });

  const user = await User.findOne({ email }).select('+password');
  if (!user) return res.status(404).send({ message: 'user not found' });

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid)
    return res.status(401).send({ message: 'Password is not valid!' });

  const token = jwt.sign({ id: user.id }, process.env.API_SECRET, {
    expiresIn: '1 day',
  });
  user.password = undefined;
  return res.status(200).send({ user, token, message: 'login successful' });
};

exports.deleteUser = async (req, res) => {
  const { userId } = req;
  const { password } = req.body;

  if (!userId) return res.status(400).send({ message: 'User ID not provided' });

  if (!password)
    return res.status(400).send({ message: 'password not provided' });

  const user = await User.findById(userId).select('+password');
  if (!user) return res.status(404).send({ message: 'User not found!' });

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid)
    return res.status(401).send({ message: 'Invalid password' });

  await user.deleteOne();
  return res.status(200).send({ message: 'User deleted' });
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).send({ message: 'email not provided' });

  const user = await User.findOne({ email });
  if (!user) return res.status(404).send({ message: 'email not registred' });

  const existingToken = await Token.findOne({ userId: user._id });
  if (existingToken) await existingToken.deleteOne();

  const resetTokenValue = crypto.randomBytes(32).toString('hex');
  const resetTokenHash = await bcrypt.hash(resetTokenValue, bcryptSalt);

  const newToken = new Token({
    userId: user._id,
    value: resetTokenHash,
  });

  await newToken.save();

  const emailTemplate = getHBSTemplateFromFile('resetPassword');
  const emailHtml = emailTemplate({
    token: resetTokenValue,
    userId: user._id,
  });

  const message = {
    to: email,
    subject: 'Password Reset Request',
    html: emailHtml,
  };

  emailTransporter.sendMail(message);
  return res.status(200).send({ message: 'ok' });
};

exports.resetPassword = async (req, res) => {
  const { token, password, userId } = req.body;

  if (!token)
    return res.status(400).send({ message: 'Reset token not provided!' });

  if (!password)
    return res.status(400).send({ message: 'Password not provided!' });

  if (!userId || !ObjectId.isValid(userId))
    return res.status(400).send({ message: 'Invalid Id!' });

  const resetToken = await Token.findOne({ userId });
  if (!resetToken)
    return res.status(401).send({ message: 'Token invalid or expired!' });

  const isValid = await bcrypt.compare(token, resetToken.value);
  if (!isValid) return res.status(401).send({ message: 'Invalid token' });

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

  return res.status(200).send({ message: 'Password changed!' });
};
