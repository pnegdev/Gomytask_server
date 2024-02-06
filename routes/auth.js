const express = require('express');
const router = express.Router();
const { login, register, resetPassword, logout } = require('../controllers/authController');
const { authenticateUser } = require('../middleware/auth');

router.post('/login', login);
router.post('/register', register);
router.post('/reset-password', resetPassword);
router.post('/logout', authenticateUser, logout);

module.exports = router;