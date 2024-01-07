const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.createUser = async (req, res) => {
  const { name, email, birthDate, password } = req.body;
  const user = new User({ name, email, birthDate, password });

  try {
    await user.save();
    return res.status(200).send({ message: 'User registred successfully' });
  } catch (err) {
    return res.status(500).send({ message: err });
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
