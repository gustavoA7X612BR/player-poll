const express = require('express');
const router = express.Router();
const User = require('../models/User');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a res');
});

router.post('/', async (req, res, next) => {
  const { name, email, birthDate, password } = req.body;

  const user = new User({ name, email, birthDate, password });
  await user.save();
});

module.exports = router;
