const express = require('express');
const router = express.Router();
const User = require('../models/User');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a res');
});

router.post('/', async (req, res, next) => {

});

module.exports = router;
