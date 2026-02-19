// backend/src/routes/authRoutes.js

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { login, getMe, logout, changePassword } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

// Validation rules
const loginValidation = [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty()
];

const changePasswordValidation = [
    body('currentPassword').notEmpty(),
    body('newPassword').isLength({ min: 6 })
];

// Routes
router.post('/login', validate(loginValidation), login);
router.get('/me', authenticate, getMe);
router.post('/logout', authenticate, logout);
router.put('/change-password', authenticate, validate(changePasswordValidation), changePassword);

module.exports = router;