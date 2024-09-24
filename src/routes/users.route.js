const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');
const {
  signup,
  signin,
  deleteUser,
  forgotPassword,
  resetPassword,
} = require('../controllers/auth.controllers');

/* GET users listing. */
router.post('/', signup);
router.post('/auth', signin);
router.post('/forgot', forgotPassword);
router.post('/reset', resetPassword);

router.delete('/', verifyToken, deleteUser);

module.exports = router;
