const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const Token = require('../models/token.model');
const crypto = require('crypto');
const emailTransporter = require('../modules/nodemailer');

const getHBSTemplateFromFile = require('../modules/handlebars');
const bcryptSalt = Number(process.env.BCRYPT_SALT);

const {
  createUser,
  loginUser,
  removeUser,
  requestPasswordToken,
  passwordResetService,
} = require('../services/auth.services');

exports.signup = async (req, res) => {
  const { name, email, birthDate, password } = req.body;

  if (!name) return res.status(400).send({ message: 'Name not provided!' });

  if (!email) return res.status(400).send({ message: 'Email not provided!' });

  if (!birthDate)
    return res.status(400).send({ message: 'BirthDate not provided!' });

  if (!password)
    return res.status(400).send({ message: 'Password not provided!' });

  const { user, token } = await createUser({
    name,
    email,
    birthDate,
    password,
  });

  return res
    .status(200)
    .send({ user, token, message: 'User registred successfully' });
};

exports.signin = async (req, res) => {
  const { email, password } = req.body;

  if (!email) return res.status(400).send({ message: 'email not provided' });

  if (!password)
    return res.status(400).send({ message: 'password not provided' });

  const { user, token } = await loginUser(email, password);

  return res.status(200).send({ user, token, message: 'login successful' });
};

exports.deleteUser = async (req, res) => {
  const { userId } = req;
  const { password } = req.body;

  if (!userId) return res.status(400).send({ message: 'User ID not provided' });

  if (!password)
    return res.status(400).send({ message: 'password not provided' });

  await removeUser(userId, password);
  return res.status(200).send({ message: 'User deleted' });
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).send({ message: 'email not provided' });

  await requestPasswordToken(email);

  return res.status(200).send({ message: 'ok' });
};

exports.resetPassword = async (req, res) => {
  const { token, password, userId } = req.body;

  if (!token)
    return res.status(400).send({ message: 'Reset token not provided!' });

  if (!password)
    return res.status(400).send({ message: 'Password not provided!' });

  if (!userId) return res.status(400).send({ message: 'Invalid Id!' });

  await passwordResetService(userId, password, token);
  return res.status(200).send({ message: 'Password changed!' });
};
