const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');
const { createUser, loginUser, deleteUser, forgotPassword, resetPassword } = require('../controllers/auth.controller');

/* GET users listing. */
router.post('/', createUser);
router.post('/auth', loginUser);
router.post('/forgot', forgotPassword);
router.post('/reset', resetPassword);

router.delete('/', verifyToken, deleteUser);

module.exports = router;
