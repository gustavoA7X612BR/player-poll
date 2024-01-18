const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');
const { createUser, loginUser, deleteUser, forgotPassword } = require('../controllers/auth');

/* GET users listing. */
router.post('/', createUser);
router.post('/auth', loginUser);
router.post('/forgot', forgotPassword);

router.delete('/', verifyToken, deleteUser);

module.exports = router;
