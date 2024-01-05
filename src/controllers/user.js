exports.createUser = async (req, res) => {
  const { name, email, birthDate, password } = req.body;

  const user = new User({ name, email, birthDate, password });
  await user.save();
};