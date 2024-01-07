const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.createUser = async (req, res) => {
  const { name, email, birthDate, password } = req.body;

  const user = new User({ name, email, birthDate, password });

  try {
    await user.save();
    res.status(200).send({ message: 'User registred successfully' });
  } catch (err) {
    res.status(500).send({ message: err });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');

    if (!user) res.status(404).send({ message: 'user not found' });

    const isPasswordValid = bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      res.status(401).send({ message: 'Password is not valid!' });

    const token = jwt.sign({ id: user.id }, process.env.API_SECRET, {
      expiresIn: '1 day',
    });

    res.status(200).send({ user, token, message: 'login successful' });
  } catch (err) {
    res.status(500).send({ message: err });
  }
};
