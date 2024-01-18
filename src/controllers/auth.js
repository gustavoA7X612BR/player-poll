const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const crypto = require('crypto');

exports.createUser = async (req, res) => {
  const { name, email, birthDate, password } = req.body;
  const user = new User({ name, email, birthDate, password });

  try {
    await user.save();
    return res.status(200).send({ message: 'User registred successfully' });
  } catch (err) {
    console.log(err);
    if (err.code === 11000)
      return res.status(400).send({ message: 'Email already registred!' });

    if ((err.name = 'ValidationError')) {
      const firstErrorMessage = Object.values(err.errors)[0].message;
      return res.status(400).send({ message: firstErrorMessage });
    }

    return res.status(500).send({ message: 'Internal Server Error' });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email) return res.status(400).send({ message: 'email not provided' });
  if (!password)
    return res.status(400).send({ message: 'password not provided' });

  try {
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
  } catch (err) {
    return res.status(500).send({ message: err });
  }
};

exports.deleteUser = async (req, res) => {
  const { userId } = req;
  const { password } = req.body;

  if (!userId) return res.status(400).send({ message: 'User ID not provided' });

  if (!password)
    return res.status(400).send({ message: 'password not provided' });

  try {
    const user = await User.findById(userId).select('+password');
    if (!user) return res.status(400).send({ message: 'User not found!' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(401).send({ message: 'Invalid password' });

    await user.deleteOne();
    return res.status(200).send({ message: 'User deleted' });
  } catch (err) {
    return res.status(500).send({ message: 'Internal Server Error' });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(401).send({ message: 'email not providded' });

  const user = await User.findOne({ email });
  if (!user) return res.status(401).send({ message: 'email not registred' });

  const passwordResetToken = crypto.randomBytes(32).toString('hex');

  const passwordResetExpires = new Date();
  passwordResetExpires.setHours(passwordResetExpires.getHours() + 1);

  await User.findOneAndUpdate(
    { _id: user._id },
    {
      $set: {
        passwordResetToken,
        passwordResetExpires,
      },
    }
  );

  await user.save();

  //Send token to email

  return res.status(200).send({ message: 'ok' });
};
