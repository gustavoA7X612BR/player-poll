const bcrypt = require('bcrypt');

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
};
