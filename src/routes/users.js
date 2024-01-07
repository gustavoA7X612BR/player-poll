const express = require('express');
const router = express.Router();
const { createUser, loginUser } = require('../controllers/auth');

/* GET users listing. */
router.post('/', createUser);

router.post('/auth', loginUser);

module.exports = router;
